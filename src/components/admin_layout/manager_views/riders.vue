<template>

    <DataTable :value="applications" tableStyle="min-width: 50rem" v-if="visible" paginator :rows="5" stateStorage="session" stateKey="dt-state-demo-session">
        <Column field="student_name" header="姓名"></Column>
        <Column field="student_no" header="学号"></Column>
        

        <Column header="校园卡" style="max-height: 3rem; max-width: 6rem;" >
            <template #body="slotProps">
                <Image :src="`https://www.xiaoqingyanxuan.top/api/v1/admin/application/image/${slotProps.data.student_card}`" 
                    style="width: 40px; height: 40px;" preview />
            </template>
        </Column>

        <Column header="审核状态">
            <template #body="{ data }">
                <p v-if="data.status==1" style="color:red">待审核</p>
                <p v-if="data.status==2" style="color:black">已通过</p>
                <p v-if="data.status==3" style="color:green">未通过</p>
            </template>
        </Column>


        <Column class="w-24 !text-end" header="通过审核">
            <template #body="{ data }">
                <Button icon="pi pi-check" @click="approve(data.id)" severity="secondary" rounded v-if="data.status!=2"></Button>
            </template>
        </Column>
        <Column class="w-24 !text-end" header="拒绝审核">
            <template #body="{ data }">
                <Button icon="pi pi-times" @click="disapprove(data.id)" severity="secondary" rounded v-if="data.status!=2&&data.status!=3"></Button>
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

    
</template>
  
<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import instance from '../../../http.js';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import router from '../../../router/router';

var route = useRoute()

var applications = ref([])
var visible = ref(false)
var session = ref()    

onMounted(fetchData);

async function fetchData() {

    try {
        visible.value = false
        const response = await instance.get("/admin/rider-application");
        applications = response.data.data.applications;
        visible.value = true
        console.log("信息");
        console.log(applications);
    } catch (error) {
        console.error("获取数据失败", error);
    }

}

async function approve(id){
    // /api/v1/admin/rider-application/{application_id}/approve

    console.log(id+'尝试申请通过');
    try {
        const response = await instance.put("/admin/rider-application/"+id+"/approve");
        console.log(response);
        alert("申请成功通过");
        fetchData();
    } catch (error) {
        console.error("获取数据失败", error);
    }
}

async function disapprove(id){
    // /api/v1/admin/rider-application/{application_id}/disapprove

    console.log(id+'尝试申请通过');
    try {
        const response = await instance.put("/admin/rider-application/"+id+"/disapprove");
        console.log(response);
        alert("成功拒绝申请");
        fetchData();
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