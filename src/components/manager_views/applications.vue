<template>
    <li v-for="item in applications" :key="item.id">
        
        商家ID: {{ item.ID }} 创建于: {{ item.CreatedAt }}
        描述: {{ item.Description }} EMAIL: {{ item.Email }}
        联系方式: {{ item.PhoneNumber }}
        负责人姓名: {{ item.Name }}

        

        <button @click="approve(item.ID)">同意申请</button>
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
        console.log(applications[0]);
    } catch (error) {
        console.error("获取数据失败", error);
    }

}
</script>