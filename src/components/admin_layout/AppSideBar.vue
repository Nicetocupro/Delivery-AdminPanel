<script setup>
    import Menu from 'primevue/menu'
    import {ref} from 'vue'

    let base = '/admin_home'

    const items=ref([
        {label:'Home'         ,icon:'pi pi-home',url:base+'/index'},
        {label:'修改密码或登出',icon:'pi pi-user',url:base+'/change_password'},
        
        {
            label:'管理商家',
            items:[
                {label:'审核请求',icon:'pi pi-plus' ,url:base+'/applications/1'},
                {label:'商家列表',icon:'pi pi-plus' ,url:base+'/merchants/1'},
            ]
        }
    ])

    
</script>

<template>

    <div class="layout_sidebar">
        <Menu :model="items" class="w-full"></Menu>
    </div>

</template>



<style scoped>
@import "../../assets/sidebar.css";
</style>

