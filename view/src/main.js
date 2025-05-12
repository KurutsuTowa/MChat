import './assets/main.css'
import 'element-plus/dist/index.css'
import 'animate.css'
import '/custom_libs/magic-master/dist/magic.min.css';
import '@arco-design/web-vue/dist/arco.css';
import 'plyr/dist/plyr.css'; // 引入 Plyr 的样式
import ElementPlus from 'element-plus'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { zhCn } from 'element-plus/es/locales.mjs'
import App from './App.vue'
import ArcoVue from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
import router from './router'
import pinia from './stores'
const app = createApp(App)
app.use(createPinia())
app.use(router)
// app.use(pinia)
app.use(ArcoVue);
app.use(ArcoVueIcon);
app.use(ElementPlus,{
    locale:zhCn
})
import './permission';
app.mount('#app')