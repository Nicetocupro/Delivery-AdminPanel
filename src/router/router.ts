import {createRouter,createWebHistory} from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'

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

export default router;