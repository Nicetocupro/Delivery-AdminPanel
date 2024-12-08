<template>

    <DataTable :value="orders" tableStyle="min-width: 50rem" v-if="visible" stateStorage="session">
        <Column field="id" header="评论id"></Column>
        <Column field="customer_name" header="评论人"></Column>
        
        <Column field="phone_number" header="电话"></Column>
        

        <Column header="状态">
            <template #body="{ data }">
                <p v-if="data.status==0" style="color:red">未支付</p>
                <p v-if="data.status==1" style="color:black">等待抢单</p>
                <p v-if="data.status==2" style="color:blue">待骑手取餐</p>
                <p v-if="data.status==3" style="color:green">等待送达</p>
                <p v-if="data.status==4" style="color:green">已送达</p>
                <p v-if="data.status==5" style="color:brown">订单被取消</p>
            </template>
        </Column>

        

        <Column class="w-24 !text-end" header="修改状态">
            <template #body="{ data }">
                <Select v-model="selects[data.id]" :options="opts" optionLabel="name" placeholder="选择状态" class="w-full md:w-56" />
                <Button @click="change(data.id,selects[data.id].code)" severity="secondary" rounded>确定修改</Button>
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

        <Column header="支付时间">
            <template #body="{ data }">
                {{ data.payment_time==0?'未支付':formatDate(data.payment_time) }}
            </template>
        </Column>

    </DataTable>

    <router-link :to="'/admin_home/orders/'+(Number(route.params.page)-1)" v-if="Number(route.params.page)>1">
        <Button>上一页</Button>
    </router-link>
    <router-link :to="'/admin_home/orders/'+(Number(route.params.page)+1)">
        <Button>下一页</Button>
    </router-link>

</template>
  
<script setup>
import { onMounted, ref ,watch } from 'vue'
import { useRoute } from 'vue-router'
import instance from '../../../http.js';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import router from '../../../router/router';

var route = useRoute()
var session =ref()
var orders = ref([])
var visible = ref(false)
var selects = ref({})
const opts = ref([
    { name: '未支付', code: 0 },
    { name: '等待抢单', code: 1 },
    { name: '待骑手取餐', code: 2 },
    { name: '等待送达', code: 3 },
    { name: '已送达', code: 4 },
    { name: '订单被取消', code: 5 }
]);

// 侦听路由的参数，以便再次获取数据
watch(() => route.params.page, fetchData, { immediate: true })

async function fetchData(page) {

    try {
        visible.value = false
        const response = await instance.get("/admin/order/"+page);
        orders = response.data.data.orders;
        visible.value = true
        console.log("信息");
        console.log(orders);
    } catch (error) {
        console.error("获取数据失败", error);
    }

}

async function change(id,status){
    console.log(id+'尝试修改'+status);
    try {
        const response = await instance.put("/admin/order/"+id+"/status/"+status);
        console.log(response);
        fetchData(route.params.page);
    } catch (error) {
        console.error("失败", error);
    }
}

// 格式化日期
const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString() + " " + date.toLocaleTimeString();
};


</script>