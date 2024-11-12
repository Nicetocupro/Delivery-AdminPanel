import {createRouter,createWebHistory} from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/admin_layout/Home.vue'
import instance from '../http.js';

const routes=[
    {
        path:'/login',
        component:Login
    },
    {
        path:'/admin_home',
        component:Home,
        children:[
            {
                path:'',
                component:()=>import('../components/admin_layout/manager_views/index.vue')
            },
            {
                path:'change_password',
                component:()=>import('../components/admin_layout/manager_views/change_password.vue')
            },
            {
                path:'create_merchants',
                component:()=>import('../components/admin_layout/manager_views/create_merchants.vue')
            },
            {
                path:'delete_merchants',
                component:()=>import('../components/admin_layout/manager_views/delete_merchants.vue')
            },
            {
                path:'applications/:page',
                component:()=>import('../components/admin_layout/manager_views/applications.vue')
            },
        ]
    },
    
]

const router = createRouter({
    history:createWebHistory(),
    routes,
})

router.beforeEach(async(to, from, next) => {

    console.log('进入导航守卫');

    // next();
    // return;

    if(to.path === '/login' ){
        next();
        return;
    }


    try {
        const response = await instance.get("/api/v1/admin/jwt/login-status");
        console.log(response.status);
        console.log('instance get结束');
    
        if (response.status !== 200) {
          next('/login');
        } else {
          next(); // 继续导航
        }
      } catch (error) {
        console.error('请求失败:', error);
        next('/login'); // 导航到登录页面
      }
});

export default router;