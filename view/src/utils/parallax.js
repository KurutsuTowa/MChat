/**
 * 用于实现视差效果
 * @param moveThreshold 视差移动阈值，以百分比为单位，默认为 5
 * @param randomThreshold 随机移动阈值，以百分比为单位，默认为 5
 * @returns 包含 parallaxSchool 方法的对象
 */

export default function useParallaxSchool(paralStatus,box,randomTime=3000,moveThreshold = 5,randomThreshold = 5){

    moveThreshold = moveThreshold || 5; 
    randomThreshold = randomThreshold || 5; // 随机移动阈值 百分比单位
    let lastSchoolTime  = new Date().getTime();
    paralStatus.timer = setInterval(() => {
        randomParallaxSchool();
    },randomTime);

    
    box.value.style.setProperty('--randomY', `0%`);
    box.value.style.setProperty('--randomX', `0%`);    
    box.value.style.setProperty('--difY', `0%`);
    box.value.style.setProperty('--difX', `0%`);  
    function randomParallaxSchool(){
        // 计算出随机移动的差值
        const randomY = (-randomThreshold) + (Math.random() * randomThreshold * 2);
        const randomX = (-randomThreshold) + (Math.random() * randomThreshold * 2);

        box.value.style.setProperty('--randomY', `${randomY}%`);
        box.value.style.setProperty('--randomX', `${randomX}%`);    
    }
    function parallaxSchool(e){

        // 节流
        const currentTime  = new Date().getTime();
        if(currentTime  - lastSchoolTime  < 100) return;

        // 当前鼠标在页面中的x和y轴
        const { clientX,clientY } = e;
        // 页面的宽高
        const { innerWidth,innerHeight } = window;

        // 计算出移动的差值 移动差值减半
        const difY = ((clientY / innerHeight) * (moveThreshold / 2)).toFixed(3);
        const difX = ((clientX / innerWidth)  * (moveThreshold / 2)).toFixed(3);
        box.value.style.setProperty('--difY', `${difY}%`);
        box.value.style.setProperty('--difX', `${difX}%`);  
    }
    return parallaxSchool
}