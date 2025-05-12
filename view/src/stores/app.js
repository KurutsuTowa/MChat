import { defineStore } from "pinia";
import { ref } from "vue";
// 存储应用数据的仓库
const useAppStore = defineStore('app',() => {
    loadTheme();
    // 窗口菜单栏的显示
    const showTitleBar = ref(false);
    // 加载界面的显示
    const globalLoadding = ref(false);
    // 服务器地址
    const server = import.meta.env.VITE_APP_BASE_URL + ':' +  import.meta.env.VITE_APP_BASE_PORT;
    // 获取服务器图片
    const getServerImage = (image) => server + import.meta.env.VITE_APP_SERVER_IMAGE + image;
    // 获取服务器文件
    const getServerFile = (file) => server + import.meta.env.VITE_APP_SERVER_FILE + file;
    // 获取服务器表情
    const getServerEmoji = (emoji) => server + import.meta.env.VITE_APP_SERVER_EMOJI + emoji;
    // 获取服务器贴纸
    const getServerSticker = (sticker) => server + import.meta.env.VITE_APP_SERVER_STICKER + sticker;
    // 获取服务器媒体
    const getServerMedia = (media) => server + import.meta.env.VITE_APP_SERVER_MEDIA + media;
    // 下载文件
    const openFile = (file) => window.open(server + import.meta.env.VITE_APP_SERVER_FILE + file);
    function saveTheme () {
        console.log(document.body.getAttribute('style'))
        localStorage.setItem('theme',document.body.getAttribute('style'));
    }
    function loadTheme () {
        if(localStorage.theme) document.body.style = localStorage.theme
    }
    function resetTheme(){
        document.body.style = localStorage.theme = '';

    }
    return {
        showTitleBar,
        globalLoadding,
        server,
        getServerImage,
        getServerFile,
        getServerEmoji,
        getServerSticker,
        getServerMedia,
        openFile,
        saveTheme,
        loadTheme,
        resetTheme
    }
})
export default useAppStore;