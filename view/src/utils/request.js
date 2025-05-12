import axios from 'axios';
import useUserStore from '@/stores/user';
// 对axios进行二次封装，实现拦截器
let request = axios.create({
    baseURL: import.meta.env.VITE_APP_BASE_URL + ":"  + import.meta.env.VITE_APP_BASE_PORT,
    timeout:5000
})
// 请求拦截器
request.interceptors.request.use(config => {
    const userStore = useUserStore();
    // 在每次发起请求时，携带token
    if(userStore.token){
        config.headers.authorization = userStore.token;
    }
    return config;
})
// 响应拦截器
request.interceptors.response.use(({ data }) => {
    return data;
}
// , error => {
//     let message;
//     let status;
//     if(error.request){
//         status = error.request.status;
//         switch(status){
//             case 0:
//                 message = '网络连接超时';
//                 break;
//             default :
//                 message = '网络出现问题';
//                 break;
//         }
//     }
//     return {
//         code:201,
//         msg:message
//     }
// }
)
export default request;