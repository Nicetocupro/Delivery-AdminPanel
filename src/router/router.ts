import {createRouter,createWebHistory} from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import instance from '../http.js';

const routes=[
    {
        path:'/login/admin',
        component:Login
    },
    {
        path:'/Home',
        component:Home
    }
]

const router = createRouter({
    history:createWebHistory(),
    routes,
})

router.beforeEach(async(to, from, next) => {

    console.log('进入导航守卫');

    if(to.path === '/login/admin' ){
        next();
        return;
    }


    try {
        const response = await instance.get("/api/v1/admin/jwt/login-status");
        console.log(response.status);
        console.log('instance get结束');
    
        if (response.status !== 200) {
          next('/login/admin');
        } else {
          next(); // 继续导航
        }
      } catch (error) {
        console.error('请求失败:', error);
        next('/login/admin'); // 导航到登录页面
      }
});

export default router;