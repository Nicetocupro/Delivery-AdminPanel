<script setup lang="ts">
    import Menu from 'primevue/menu'
    import {ref} from 'vue'
    import instance from '../http.js';
    import router from '../router/router.js'
    const items=ref([
        {label:'Home',icon:'pi pi-home'},
        {label:'About',icon:'pi pi-info-circle'},
        {label:'Contact',icon:'pi pi-envelope'},
        {label:'修改密码',icon:'pi pi-home'},
        {label:'About',icon:'pi pi-info-circle'},
        {label:'Contact',icon:'pi pi-envelope'},
        {label:'Home',icon:'pi pi-home'},
        {label:'About',icon:'pi pi-info-circle'},
        {label:'Contact',icon:'pi pi-envelope'},
        {label:'Home',icon:'pi pi-home'},
        {label:'About',icon:'pi pi-info-circle'},
        {label:'Contact',icon:'pi pi-envelope'},
        {label:'Home',icon:'pi pi-home'},
        {label:'About',icon:'pi pi-info-circle'},
        {label:'Contact',icon:'pi pi-envelope'},
        {label:'Home',icon:'pi pi-home'},
        {label:'About',icon:'pi pi-info-circle'},
        {label:'Contact',icon:'pi pi-envelope'},
        {label:'Home',icon:'pi pi-home'},
        {label:'About',icon:'pi pi-info-circle'},
        {label:'Contact',icon:'pi pi-envelope'},
        {label:'Home',icon:'pi pi-home'},
        {label:'About',icon:'pi pi-info-circle'},
        {label:'Contact',icon:'pi pi-envelope'},
        {label:'Home',icon:'pi pi-home'},
        {label:'About',icon:'pi pi-info-circle'},
        {label:'Contact',icon:'pi pi-envelope'},
        {label:'Home',icon:'pi pi-home'},
        {label:'About',icon:'pi pi-info-circle'},
        {label:'Contact',icon:'pi pi-envelope'},
    ])
    async function logout(){
        window.localStorage.setItem("access_token","");
        try {
            const response = await instance.post(`/admin/logout`);
            if (response.data.code === 200) {
                if(response.data.msg === "ok"){
                    window.localStorage.setItem("access_token","");
                }else{
                    alert(response.data.msg);
                }
            } else {
                alert(response.data.msg);
            }
        } catch (error) {alert(error.message);}
        router.push('/');
    }
</script>

<template>
    <div class="layout_sidebar">
        <Menu :model="items" class="w-full"></Menu>
    </div>
    <div class="content">
        <Button class="button login__submit" @click="logout">
            <span class="button__text">Logout</span>
        </Button>
    </div>
</template>

<style scoped>
    .layout_sidebar{
        display:inline-block;
        height:100%;
        width:18rem;
    }
    .content{
        margin:10px;
        display:inline-block;
    }
</style>