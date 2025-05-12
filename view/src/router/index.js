import { createRouter, createWebHashHistory } from 'vue-router'
// 登录注册界面
import AuthView from '@/views/auth/AuthView.vue';
// 框架
import LayoutView from '@/views/layout/LayoutView.vue';
// 首页
import HomeView from '@/views/layout/home/HomeView.vue';
// 聊天
import ChatView from '@/views/layout/chat/ChatView.vue';
// 联系
import ContactView from '@/views/layout/contact/ContactView.vue';
// 用户空间
import UserSpace from '@/views/layout/contact/UserSpace.vue';
// 群聊空间
import GroupSpace from '@/views/layout/contact/GroupSpace.vue';
// 对话窗口
import ChatWindow from '@/views/layout/chat/ChatWindow.vue';
// 调色板
import ThemeView from '@/views/layout/theme/ThemeView.vue';
const router = createRouter({
  history: createWebHashHistory(),
  routes:[
    {
      path:'/',
      redirect:'/auth',
    },
    {
      path:'/auth',
      component:AuthView,
      children:[
      ]
    },
    {
      path:'/layout',
      component:LayoutView,
      redirect:'/layout/chat',
      children:[
        {
          path:'chat',
          component:ChatView,
          children:[
            {
              path:'room',
              component:ChatWindow,
            }
          ]
        },
        {
          path:'contact',
          component:ContactView,
          children:[
            {
              path:'user/space',
              component:UserSpace,
            },
            {
              path:'group/space',
              component:GroupSpace,
            }
          ]
        },
        {
          path:'theme',
          component:ThemeView,
        }
      ]
    }
  ]
})
export default router
