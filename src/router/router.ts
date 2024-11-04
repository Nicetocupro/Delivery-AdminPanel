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
    },
    {
        path:'/',
        redirect:'/login/admin'
    }
]

const router = createRouter({
    history:createWebHistory(),
    routes,
})

router.beforeEach(async(to, from, next) => {
    const response = await instance.get("/api/v1/admin/jwt/login-status");
    let isAuthenticated = (response.data.code === 200) && (response.data.msg === "ok");

    // 用户未登录且试图访问非登录页面时，重定向到登录页
    if (!isAuthenticated && to.path !== '/login/admin') {
        next('/login/admin');
    } 
    // 已登录用户访问登录页面时，重定向到主页
    else if (isAuthenticated && to.path === '/login/admin') {
        next('/Home');
    } 
    // 否则，正常放行
    else {
        next();
    }
});

export default router;