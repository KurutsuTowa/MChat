export const formatTime = (date) => {
    if(!date) return;
    if(typeof date == 'string'){
        date = new Date(date);
    }
    const now = new Date();
    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const diffTime = nowDate - targetDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    function pad(number) {
        return number < 10 ? '0' + number : number;
    }

    function getTimePeriod(hours) {
        if (hours >= 6 && hours < 12) return '早上';
        if (hours >= 12 && hours < 18) return '下午';
        if (hours >= 18 && hours < 24) return '晚上';
        return '凌晨';
    }
    if (diffDays === 0) {
        // 今天
        const period = getTimePeriod(date.getHours());
        return `${period} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
    } else if (diffDays === 1) {
        // 昨天
        return `昨天`;
    } else if (diffDays > 1 && diffDays < 7) {
        // 两天前到一周内
        return `${diffDays}天前`;
    } else if (diffDays >= 7) {
        // 超过一周
        if (date.getFullYear() === now.getFullYear()) {
            // 同一年
            return `${pad(date.getMonth() + 1)}月${pad(date.getDate())}日 ${pad(date.getHours())}:${pad(date.getMinutes())}`;
        } else {
            // 不是同一年
            return `${date.getFullYear()}年${pad(date.getMonth() + 1)}月${pad(date.getDate())}日${pad(date.getHours())}:${pad(date.getMinutes())}`;
        }
    }
}
export const formatTalkTime = (date) => {
    if(!date) return;
    if(typeof date == 'string'){
        date = new Date(date);
    }
    const now = new Date();
    const nowDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const targetDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const diffTime = nowDate - targetDate;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    function pad(number) {
        return number < 10 ? '0' + number : number;
    }

    function getTimePeriod(hours) {
        if (hours >= 6 && hours < 12) return '早上';
        if (hours >= 12 && hours < 18) return '下午';
        if (hours >= 18 && hours < 24) return '晚上';
        return '凌晨';
    }
    if (diffDays === 0) {
        // 今天
        const period = getTimePeriod(date.getHours());
        return `${period} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
    } else if (diffDays === 1) {
        // 昨天
        return `昨天`;
    } else if (diffDays > 1 && diffDays < 7) {
        // 两天前到一周内
        return `${diffDays}天前`;
    } else if (diffDays >= 7) {
        // 超过一周
        if (date.getFullYear() === now.getFullYear()) {
            // 同一年
            return `${pad(date.getMonth() + 1)}月${pad(date.getDate())}日`;
        } else {
            // 不是同一年
            return `${date.getFullYear()}年${pad(date.getMonth() + 1)}月${pad(date.getDate())}日`;
        }
    }
}
// 动态解析年月日时分秒
export const adapParseDate = (date) => {
    if(!date) return '';
    if(typeof date == 'string') date = new Date(date);

    const today = new Date(); 
        // 是今天
    if(date.getTime() > today.getTime()){
        return new String(date.getHours()).padStart(2,'0') + ':' + new String(date.getMinutes()).padStart(2,'0');
    }else if(date.getFullYear() != today.getFullYear()){
        // 不是今年
        return getYearDay(date);
    }else{
    // 是今年
        return getMonthDay(date);
    }
}
// 动态解析年月日
export const halfAdapParseDate = (date) => {
    if(!date) return '';
    if(typeof date == 'string') date = new Date(date);

    const today = new Date(parseDate(new Date())); 
    // 是今天
    if(date.getTime() > today.getTime()){
        return '今日';
    }else if(date.getFullYear() != today.getFullYear()){
        // 不是今年
        return parseDate(date);
    }else{
    // 是今年
        return getMonthDay(date);
    }
}
// 获取年月日
export const getYearDay = (date) => {
    if(!date) return '';
    if(typeof date == 'string') date = new Date(date);
    return  date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日';
}
export const calculateTimeDifference = (timeA, timeB) => {
    const dateA = new Date(timeA);
    const dateB = new Date(timeB);
    const differenceInMilliseconds = dateB - dateA;
    
    // 将毫秒转换为天
    const differenceInDays = Math.floor(differenceInMilliseconds / (1000 * 60 * 60 * 24));
    const differenceInHours = Math.floor((differenceInMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const differenceInMinutes = Math.floor((differenceInMilliseconds % (1000 * 60 * 60)) / (1000 * 60));

    if (differenceInDays >= 1) {
        return `${differenceInDays}天`;
    } else {
        return `${differenceInHours}小时${differenceInMinutes}分钟`;
    }
}
// 获取月日
export const getMonthDay = (date) => {
    if(!date) return '';
    if(typeof date == 'string') date = new Date(date);
    return (date.getMonth() + 1) + '月' + date.getDate() + '日';
}
// 获取年月日时分秒
export const getDateDay = (date) => {
    if(!date) return '';
    if(typeof date == 'string') date = new Date(date);
    return  date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日' + date.getHours() + ':' + date.getMinutes();
}
// 获取出生年代
export const getYears = (date) => {
    if(!date) return '';
    if(typeof date == 'string') date = new Date(date);
    const year = date.getFullYear() + '';
    if(year.length > 2){
        return year[year.length - 2] + getYearSuffix(year[year.length - 1]) + '后';
    }else{
        return getYearSuffix(year) + '后';
    }

    function getYearSuffix(last){
        if(last >= 5){
            return 5;
        } else{
            return 0;
        }
    }

}
// 获取星座
export const getConstellation = (date) => {
    if(!date) return '';
    if(typeof date == 'string') date = new Date(date);
    const list = [
        {
            start:'121',
            end:'219',
            constellation:'水瓶座'
        },
        {
            start:'220',
            end:'320',
            constellation:'双鱼座'
        },
        {
            start:'321',
            end:'420',
            constellation:'白羊座'
        },
        {
            start:'421',
            end:'521',
            constellation:'金牛座'
        },
        {
            start:'522',
            end:'621',
            constellation:'双子座'
        },
        {
            start:'622',
            end:'722',
            constellation:'巨蟹座'
        },
        {
            start:'723',
            end:'823',
            constellation:'狮子座'
        },
        {
            start:'824',
            end:'923',
            constellation:'处女座'
        },
        {
            start:'924',
            end:'1023',
            constellation:'天秤座'
        },
        {
            start:'1024',
            end:'1122',
            constellation:'天蝎座'
        }
    ]
    const day = date.getMonth() + 1 + '' + (date.getDate() + '').padStart(2,0);
    const len = list.length;
    let result = '魔羯座'
    for(let i = 0; i < len; i ++){
        let item = list[i];
        if(day > item.start && day < item.end){
            result = item.constellation;
            break;
        }
    }
    return result
}
// 获取年龄
export const getUserAge = (age) => {
    if(age != '保密'){
        age += '岁';
    }
    return age;
}
export const parseDate = (date,end) => {
    if(!date) return '';
    if(typeof date == 'string') date = new Date(date);
    if(end){
        return date.getFullYear() + '/' + (date.getMonth() + 1) + '/' + date.getDate();
    }else{
        return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日';
    }
} 
export const parseAllDate = (date) => {
    if(!date) return '';
    if(typeof date == 'string') date = new Date(date);
    return date.getFullYear() + '年' + (date.getMonth() + 1) + '月' + date.getDate() + '日' + date.getHours() + ':' + date.getMinutes();
}