// 路由鉴权
import router from '@/router/index';
import pinia from './stores/index';
import { ElMessage } from 'element-plus';
// 前置守卫 用于拦截访问和实现页面加载效果
router.beforeEach((to, from, next) => {
  next();
})
// 后置守卫 用于实现页面加载结束效果
router.afterEach((to, from) => {
    document.title = import.meta.env.VITE_APP_TITLE;
})