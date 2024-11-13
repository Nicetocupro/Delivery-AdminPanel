<script setup>
    import router from '../../router/router';
    import AppTopBar from './AppTopBar.vue';
    import AppSideBar from './AppSideBar.vue';
    
</script>

<template>

    <div class="layout-wrapper">
        <AppTopBar></AppTopBar>
        <AppSideBar></AppSideBar>
        <div class="layout-main-container">
            <RouterView></RouterView>
        </div>
    </div>

</template>

<style scoped>
    .layout-wrapper {
        min-height: 100vh;
        display: flex;
    }
    .layout-main-container {
        position: fixed;
        width: calc(100vw - 25rem);
        height: calc(100vh - 8rem);
        z-index: 999;
        overflow-y: auto;
        user-select: none;
        top: 6rem;
        left: 23rem;
        background-color:rgba(34, 35, 35, 0.108);
        padding: 0.5rem 0.5rem;
    }
</style>

