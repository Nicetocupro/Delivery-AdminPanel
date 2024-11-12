<template>
    <p>123</p>
    <li v-for="item in applications" :key="item.id">
        {{ item.ID }} - {{ item.CreatedAt }}
    </li>
</template>
  
<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import instance from '../../http.js';

const route = useRoute()

var applications = ref([]) 

// 侦听路由的参数，以便再次获取数据
watch(() => route.params.page, fetchData, { immediate: true })

async function fetchData(page) {
    console.log("开始获取第"+page+"页数据")

    try {
        const response = await instance.get("/api/v1/admin/jwt/merchant-application/" + page);
        applications = response.data.data.Applications;
        console.log("信息");
        console.log(applications);
    } catch (error) {
        console.error("获取数据失败", error);
    }

}
</script>