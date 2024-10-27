<script setup lang="ts">
    import Menu from 'primevue/menu'
    import {ref} from 'vue'
    import instance from '../http.js';
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
    function logout(){
        ;
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