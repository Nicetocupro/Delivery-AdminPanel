<template>

    <DataTable :value="merchants" tableStyle="min-width: 50rem" v-if="visible">
        <Column field="account" header="账号"></Column>
        
        <Column field="phone_number" header="电话"></Column>
        <Column field="merchant_name" header="商家姓名"></Column>
        <Column field="merchant_application_id" header="申请ID"></Column>


        <Column header="状态">
            <template #body="{ data }">
                <p v-if="data.status==0" style="color:red">已禁用</p>
                <p v-if="data.status==1" style="color:green">已启用</p>
            </template>
        </Column>


        <Column class="w-24 !text-end" header="启用">
            <template #body="{ data }">
                <Button icon="pi pi-check" @click="enable(data.id)" severity="secondary" rounded></Button>
            </template>
        </Column>
        <Column class="w-24 !text-end" header="禁用">
            <template #body="{ data }">
                <Button icon="pi pi-times" @click="disable(data.id)" severity="secondary" rounded></Button>
            </template>
        </Column>

        <Column header="创建时间">
            <template #body="{ data }">
            {{ formatDate(data.created_at) }}
            </template>
        </Column>

        <Column header="更新时间">
            <template #body="{ data }">
            {{ formatDate(data.updated_at) }}
            </template>
        </Column>

    </DataTable>

    <Dialog v-model:visible="vis" modal header="商家证书" :style="{ width: '75rem' }">
        <img :src="imagesrc" alt="License Image">
    </Dialog>

    <router-link :to="'/admin_home/applications/'+(Number(route.params.page)-1)">
        <Button>上一页</Button>
    </router-link>
    <router-link :to="'/admin_home/applications/'+(Number(route.params.page)+1)">
        <Button>下一页</Button>
    </router-link>

</template>
  
<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import instance from '../../../http.js';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import router from '../../../router/router';

var route = useRoute()

var merchants = ref([])
var image = ref()
var imagesrc = ref()
var vis = ref(false)
var visible = ref(false)    

// 侦听路由的参数，以便再次获取数据
watch(() => route.params.page, fetchData, { immediate: true })

async function fetchData(page) {
    console.log("开始获取第"+page+"页数据")

    try {
        visible.value = false
        const response = await instance.get("/admin/merchants/" + page);
        merchants = response.data.data.merchants;
        visible.value = true
        console.log("信息");
        console.log(merchants);
    } catch (error) {
        console.error("获取数据失败", error);
        router.push('/admin_home')
    }

}

function arrayBufferToBase64(buffer) {
    console.log('Buffer type:', typeof buffer); // 调试信息：输出 buffer 的类型
    let binary = '';
    const bytes = new Uint8Array(buffer);
    const len = bytes.byteLength;
    console.log("len:", len); // 调试信息：输出字节数组的长度
    for (let i = 0; i < len; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return window.btoa(binary);
}

async function getimage(license){
    console.log(license);
    image = await instance.get("/admin/merchant-application/license/"+license,{
        responseType: 'arraybuffer'
    });
    const imageData = image.data;
    imagesrc =`data:image/png;base64,${arrayBufferToBase64(imageData)}`;
    console.log(imagesrc);
    vis.value = true
}

async function enable(id){
    //dev-cn.your-api-server.com/api/v1/admin/merchant/{merchant_id}/enable
    console.log(id+'尝试启用');
    try {
        const response = await instance.post("/admin/merchant/"+id+"/enable");
        console.log(response);
        alert("启用成功");
        fetchData(route.params.page)
    } catch (error) {
        console.error("获取数据失败", error);
    }
}

async function disable(id){
    //dev-cn.your-api-server.com/api/v1/admin/merchant/{merchant_id}/disable
    try {
        const response = await instance.post("/admin/merchant/"+id+"/disable");
        console.log(response);
        alert("成功禁用");
        fetchData(route.params.page)
    } catch (error) {
        console.error("获取数据失败", error);
    }
}

// 格式化日期
const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString() + " " + date.toLocaleTimeString();
};


</script>