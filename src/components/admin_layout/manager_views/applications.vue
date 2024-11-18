<template>

    <DataTable :value="applications" tableStyle="min-width: 50rem" v-if="visible">
        <Column field="name" header="商家名称"></Column>
        
        <Column field="phone_number" header="电话"></Column>
        <Column field="email" header="邮箱"></Column>



        <Column header="审核状态">
            <template #body="{ data }">
                <p v-if="data.status==1" style="color:red">已拒绝</p>
                <p v-if="data.status==2" style="color:black">未审核</p>
                <p v-if="data.status==3" style="color:green">已通过</p>
            </template>
        </Column>

        <Column header="邮件状态">
            <template #body="{ data }">
                <p v-if="data.email_status==0" style="color:cyan">未发送</p>
                <p v-if="data.email_status==1" style="color:green">已发送</p>
                <p v-if="data.email_status==2" style="color:red">发送错误</p>
            </template>
        </Column>


        <Column class="w-24 !text-end" header="通过审核">
            <template #body="{ data }">
                <Button icon="pi pi-check" @click="approve(data.id)" severity="secondary" rounded v-if="data.status!=3"></Button>
            </template>
        </Column>
        <Column class="w-24 !text-end" header="拒绝审核">
            <template #body="{ data }">
                <Button icon="pi pi-times" @click="disapprove(data.id)" severity="secondary" rounded v-if="data.status!=1"></Button>
            </template>
        </Column>
        <Column class="w-24 !text-end" header="商家证书">
            <template #body="{ data }">
                <Button icon="pi pi-search" @click="getimage(data.license)" severity="secondary" rounded></Button>
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

        <Column field="description" header="描述信息"></Column>
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

var applications = ref([])
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
        const response = await instance.get("/admin/merchant-application/" + page);
        applications = response.data.data.applications;
        visible.value = true
        console.log("信息");
        console.log(applications);
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

async function approve(id){
    // /admin/merchant-application/{application_id}/approve

    console.log(id+'尝试申请通过');
    try {
        const response = await instance.put("/admin/merchant-application/"+id+"/approve");
        console.log(response);
        alert("申请成功通过");
        fetchData(route.params.page)
    } catch (error) {
        console.error("获取数据失败", error);
    }
}

async function disapprove(id){
    // /admin/merchant-application/{application_id}/disapprove

    console.log(id+'尝试申请通过');
    try {
        const response = await instance.put("/admin/merchant-application/"+id+"/disapprove");
        console.log(response);
        alert("成功拒绝申请");
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