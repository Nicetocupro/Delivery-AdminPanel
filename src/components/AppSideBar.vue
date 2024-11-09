<script setup lang="ts">
    import Menu from 'primevue/menu'
    import {ref} from 'vue'
    import instance from '../http.js';
    import router from '../router/router.js'
    import Button from 'primevue/button';
    import Dialog from 'primevue/dialog';


    let visible = ref(false);

    const items=ref([
        {label:'Home',icon:'pi pi-home'},
        {label:'Personal', icon:'pi pi-user'},
        {label:'Contact',icon:'pi pi-envelope'},
        {label:'About',icon:'pi pi-info-circle'},
        {label:'Contact',icon:'pi pi-envelope'},
    ])

    
</script>

<template>

    <div class="layout_sidebar">
        <Menu :model="items" class="w-full"></Menu>
    </div>

</template>



<style scoped>
@import "../assets/sidebar.css";
</style>

