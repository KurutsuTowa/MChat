/**
 *  √ 主色调‌：主色调的选择依据整个图像中分布最广的颜色。它是设计中的主要色彩，用于大面积的背景或形状元素上，对整个设计的氛围和基调起到决定性作用。例如，在一张以蓝色为主色调的图片中，蓝色可能以不同明暗层次出现在云雾和湖泊中，选择一种过渡均衡的中度灰蓝作为主色调，能够突出图片的特色。
    extractDominantColor(src)[0] 作为darkColor
    ‌√ ‌辅助色‌：辅助色通常用于烘托主色调，与之产生呼应，形成对比或互补，从而增强设计的视觉效果。如果主色调是冷色调，辅助色可能会选择暖色调，以在色环上形成对比，如冷蓝色与暖橙色的搭配。辅助色常用于小面积的元素或字体上，以达到与主色形成对比的同时，增强设计的视觉效果。
    findMostDifferentColor(src,'min') 作为uiColor
    √ 对比色‌：对比色是指在色环上位置刚好相对的颜色，如红色和绿色、紫色和橙色、蓝色和黄色等。对比色的使用可以在设计中产生强烈的视觉冲击，用于强调特定的元素或信息，吸引观众的注意力。
    findMostDifferentColor(src,'max') 作为contrastiveColor
    ‌强调色‌：如果需要进一步强调设计中的某个元素，可以选择主色的对比色作为强调色，这样可以增加设计的层次感和焦点。
 *  
 * */

// 判断颜色是否为暗色
export function isDark(color) {
    // 使用平均值作为灰度值
    var gray = (color[0] + color[1] + color[2]) / 3;
    // 简单地比较灰度值与阈值
    return gray < 128;
}

/**
 * 判断图片偏亮还是偏暗
 * @param image 图片标签
 * @param sampleRate 采样率，每n个像素点之间分析一次
 */
export async function analyzeImageBrightness(src, sampleRate=3) {
    var image = new Image();
    image.src = src;
    return await new Promise((resolve,reject) => {
        image.onload = () => resolve();
        image.onerror = e => reject(e.message);
    }).then(() => {
        
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = image.width;
        canvas.height = image.height;

        ctx.drawImage(image, 0, 0, image.width, image.height);

        var imageData = ctx.getImageData(0, 0, image.width, image.height);
        var data = imageData.data;
        var darkCount = 0;
        var lightCount = 0;

        // 每 sampleRate 个像素中只分析一个
        for (var i = 0; i < data.length; i += 4 * sampleRate) {
            var color = [data[i], data[i + 1], data[i + 2]];
            if (isDark(color)) {
            darkCount++;
            } else {
            lightCount++;
            };
        }

        // 根据采样率调整计数
        darkCount *= sampleRate * sampleRate;
        lightCount *= sampleRate * sampleRate;

        if (darkCount > lightCount) {
            console.log('暗色像素更多');
            return 'dark';
        } else {
            console.log('亮色像素更多');
            return 'light';
        }
    }).catch(message => console.log('图片读取失败:' + message))
}
// 找出图片的n个最常出现的色调 降序 越靠前的颜色出现次数越多
export async function extractDominantColor(src, n=1) {
    var image = new Image();
    image.src = src;
    return await new Promise((resolve,reject) => {
        image.onload = () => resolve();
        image.onerror = (e) => reject(e.message);
    }).then(() => {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = image.width;
        canvas.height = image.height;
        ctx.drawImage(image, 0, 0, image.width, image.height);
    
        var imageData = ctx.getImageData(0, 0, image.width, image.height);
        var data = imageData.data;
        var colorCounts = {};
    
        // 遍历所有像素，计算颜色出现的次数
        for (var i = 0; i < data.length; i += 4) {
        var r = data[i];
        var g = data[i + 1];
        var b = data[i + 2];
        var colorKey = r + ',' + g + ',' + b;
            colorCounts[colorKey] = (colorCounts[colorKey] || 0) + 1;
        }
        // 获取前n位主色调
        var topColors = [];
        var colorKeys = Object.keys(colorCounts).map(function(key) {
            return [parseInt(key.split(',')[0], 10), parseInt(key.split(',')[1], 10), parseInt(key.split(',')[2], 10), colorCounts[key]];
        }).sort(function(a, b) {
            return b[3] - a[3];
        });
        for (var i = 0; i < n; i++) {
            // error
            topColors.push([colorKeys[i][0], colorKeys[i][1], colorKeys[i][2], colorKeys[i][3]]);
        }
        return topColors.length == 1 ? topColors[0] : topColors;
    }).catch(message => console.log('图片读取失败:' + message))
}
// 从颜色数组中找出差别最大的颜色
export function findMostDifferentColor(colors,type='max') {
    if(colors.length == 0) return;
    // 计算平均颜色
    var averageColor = colors.reduce(function(acc, color) {
        return acc.map(function(avg, i) {
            return avg + color[i];
        });
    }, colors[0].map(function() {
        return 0;
    }));
    averageColor = averageColor.map(function(value) {
        return value / colors.length;
    });
    // 计算每个颜色与平均颜色的差值
    var differences = colors.map(function(color) {
        var difference = 0;
        for (var i = 0; i < 3; i++) {
            difference += Math.abs(color[i] - averageColor[i]);
        }
        return difference;
    });
    if(type == 'max'){
        // 找出差值最大的颜色
        var mostDifferentColorIndex = differences.indexOf(Math.max(...differences));
        // 找出差值最大的颜色的对比色
        var mostDifferentColor = colors[mostDifferentColorIndex];
        return mostDifferentColor;
    }else if(type == 'min'){
        // 找出差值最小的颜色
        var mostDifferentColorIndex = differences.indexOf(Math.min(...differences));
        var mostDifferentColor = colors[mostDifferentColorIndex];
        return mostDifferentColor;
    }

}
export function getContrastColor([r,g,b]) {
    // 计算亮度的公式（YIQ）
    const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
    if(yiq < 160){
        return [244,244,244];
    }else{
        return [15,15,15]
    }
}
// 获取该图片的对比色、主色
// export async function getDifferentColorByImage(src){
//     const image = new Image();
//     image.src = src;
//     return await new Promise((resolve) => {
//         image.onload = () => {
//             // 获取图片中最常见的前1000种颜色
//             const arr = extractDominantColor(image,1000);
//             // 获取100种颜色中差值最大的颜色 使用差值作为页面反差色
//             const different = findMostDifferentColor(arr);

//             const color = { noraml:'rgba(' + different + ',1)',opacity:'rgba(' + different + ',.4)',main:'rgba(' + arr[0] + ',1)',mainOpacity:'rgba(' + arr[0] + ',.7)' };
//             resolve(color);
//         }

//     })
// }

// 找出图片的主色调
// export function extractDominantColor(image) {
//     var canvas = document.createElement('canvas');
//     var ctx = canvas.getContext('2d');
//     canvas.width = image.width;
//     canvas.height = image.height;
//     ctx.drawImage(image, 0, 0, image.width, image.height);
  
//     var imageData = ctx.getImageData(0, 0, image.width, image.height);
//     var data = imageData.data;
//     var colorCounts = {};
  
//     // 遍历所有像素，计算颜色出现的次数
//     for (var i = 0; i < data.length; i += 4) {
//       var r = data[i];
//       var g = data[i + 1];
//       var b = data[i + 2];
//       var colorKey = r + ',' + g + ',' + b;
//       colorCounts[colorKey] = (colorCounts[colorKey] || 0) + 1;
//     }
  
//     // 找出出现次数最多的颜色
//     var dominantColor = null;
//     var maxCount = 0;
//     console.log(colorCounts)
//     for (var key in colorCounts) {
//       if (colorCounts[key] > maxCount) {
//         maxCount = colorCounts[key];
//         dominantColor = key.split(',').map(function(value) {
//           return parseInt(value, 10);
//         });
//       }
//     }
  
//     return dominantColor;
//   }