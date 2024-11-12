<template>

    <DataTable :value="applications" tableStyle="min-width: 50rem" v-model:visible="visible">
        <Column field="id" header="id"></Column>
        <Column field="name" header="name"></Column>
        <Column field="description" header="description"></Column>
        <Column field="phone_number" header="phone_number"></Column>
        <Column class="w-24 !text-end" header="通过审核">
            <template #body="{ data }">
                <Button icon="pi pi-check" @click="selectRow(data)" severity="secondary" rounded></Button>
            </template>
        </Column>
        <Column class="w-24 !text-end" header="拒绝审核">
            <template #body="{ data }">
                <Button icon="pi pi-times" @click="selectRow(data)" severity="secondary" rounded></Button>
            </template>
        </Column>
        <Column class="w-24 !text-end" header="点击查看商家证书">
            <template #body="{ data }">
                <Button icon="pi pi-search" @click="getimage(data.license)" severity="secondary" rounded></Button>
            </template>
        </Column>
    </DataTable>

    <Dialog v-model:visible="vis" modal header="商家证书" :style="{ width: '75rem' }">
        <img :src="imagesrc" alt="License Image">
    </Dialog>

</template>
  
<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import instance from '../../../http.js';
import router from '../../../router/router.ts';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';

const route = useRoute()

var applications = ref([])
var visible = ref(false)
var image = ref()
var imagesrc = ref()
var vis = ref(false)

// 侦听路由的参数，以便再次获取数据
watch(() => route.params.page, fetchData, { immediate: true })

async function fetchData(page) {
    console.log("开始获取第"+page+"页数据")

    try {
        const response = await instance.get("/api/v1/admin/merchant-application/" + page);
        applications = response.data.data.applications;
        console.log("信息");
        console.log(applications);
        visible.value = true
    } catch (error) {
        console.error("获取数据失败", error);
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
    image = await instance.get("api/v1/admin/merchant-application/license/"+license,{
        responseType: 'arraybuffer'
    });
    const imageData = image.data;
    imagesrc =`data:image/png;base64,${arrayBufferToBase64(imageData)}`;
    console.log(imagesrc);
    vis.value = true
}

</script>