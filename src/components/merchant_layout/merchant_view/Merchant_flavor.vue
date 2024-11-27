<script setup lang="ts">
    import Button from "primevue/button";
    import Column from "primevue/column";
    import DataTable, { DataTableRowClickEvent } from "primevue/datatable";
    import Dialog from "primevue/dialog";
    import { useToast } from "primevue/usetoast";
    import { computed, onMounted, ref, toValue } from "vue";
    import instance from "../../../http.js";
    import { RadioButton } from "primevue";

    // 格式化日期
    const formatDate = (timestamp: number): string => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    };

    interface Flavor{
        created_at: number;
        id: number;
        name: string;
        restauran_id: number;
        updated_at: number;
    };

    // 获取传递的参数
    const props = defineProps<{restaurantID: number}>();
    const restaurantID = props.restaurantID;

    const toast = useToast();
    const flavor_name = ref("");
    let visible = ref(false); // 控制Dialog弹窗显示
    let vis = ref(false); // 控制Dialog弹窗2显示

    let flavors = ref<Flavor[]>([]); // 餐厅列表
    let name = ref("");
    let old_id=ref();

    const fetchFlavors = async() =>{
        try{
            const response = await instance.get(`/merchant/restaurant/${restaurantID}/flavors`);

            if(response.data.ecode == 200){
                if(response.data && response.data.data.flavors){
                    flavors.value = response.data.data.flavors;
                }
                else {
                    console.error("No categories data found in response:", response.data);
                    flavors.value = [];
                }
            }
        } catch(error) {
            console.log("ERROR fetching categories", error.data);
            flavors.value = [];
        }
    }

    // 定义过滤后的餐厅列表, 基于category_name进行动态更新
    const filteredFlavors = computed(() => {
        if(!flavor_name.value)
            return flavors.value;

        return flavors.value.filter((flavor) => 
            flavor.name.includes(flavor_name.value)
        );
    });

    const searchFlavors = () => {
        toast.add({
            severity: "info",
            summary: "查询完成",
            detail: `查询结果包含 ${filteredFlavors.value.length} 条记录`,
            life: 3000,
        });
    };

    const createFlavor = async () => {
        console.log("创建新口味:",name.value);
        try{
            const response = await instance.post(`/merchant/restaurant/${restaurantID}/flavor/${name.value}`);
            if (response.data.ecode === 200) {
                toast.add({
                    severity: "success",
                    summary: "创建成功",
                    detail: "新口味已成功创建。",
                    life: 3000,
                });
                fetchFlavors();
                visible.value=false;
            }
            else{
                console.log(response.data);
                toast.add({
                    severity: "error",
                    summary: "创建失败",
                    detail: response.data.msg || "创建新口味时出现问题。",
                    life: 3000,
                });
            }
        } catch(error) {
            console.error("创建新口味时出现问题", error);
            toast.add({
                severity: "error",
                summary: "创建失败",
                detail: "创建新口味时出现问题，请稍后再试。",
                life: 3000,
            });
        }
    };

    const deleteFlavor = async (flavor_id:number) => {
        try{
            const response = await instance.delete(`/merchant/flavor/${flavor_id}`);
            if (response.data.ecode === 200) {
                toast.add({
                    severity: "success",
                    summary: "创建成功",
                    detail: "口味删除成功",
                    life: 3000,
                });
                fetchFlavors();
                visible.value=false;
            }
            else{
                console.log(response.data);
                toast.add({
                    severity: "error",
                    summary: "删除失败",
                    detail: response.data.msg || "删除口味时出现问题。",
                    life: 3000,
                });
            }
        } catch(error) {
            console.error("删除口味时出现问题", error);
            toast.add({
                severity: "error",
                summary: "删除失败",
                detail: "删除口味时出现问题，请稍后再试。",
                life: 3000,
            });
        }
    };

    const upgradeFlavor = async (flavor_id:number) => {
        try{
            const response = await instance.put(`/merchant/flavor/${flavor_id}/name/${name.value}`);
            if (response.data.ecode === 200) {
                toast.add({
                    severity: "success",
                    summary: "修改成功",
                    detail: "口味修改成功",
                    life: 3000,
                });
                fetchFlavors();
                visible.value=false;
            }
            else{
                console.log(response.data);
                toast.add({
                    severity: "error",
                    summary: "修改失败",
                    detail: response.data.msg || "修改口味时出现问题。",
                    life: 3000,
                });
            }
        } catch(error) {
            console.error("修改口味时出现问题", error);
            toast.add({
                severity: "error",
                summary: "修改失败",
                detail: "修改口味时出现问题，请稍后再试。",
                life: 3000,
            });
        }
    };

    const openCreateDialog = () => {
        name.value="";
        visible.value = true;
    };

    onMounted(fetchFlavors);
</script>

<template>
    <div>
        <Toast />

        <div class="action-bar">
            <!--查询输入框与查询按钮-->
            <div class="search-group">
                <input v-model="flavor_name" placeholder="查询口味名" class="input-field search-input"/>
                <Button label="查询" icon="pi pi-search" class="p-button-primary search-button" @click="searchFlavors" />
                <Button label="新建口味" icon="pi pi-plus" @click="openCreateDialog" class="p-button-success new-category-button" />
            </div>
        </div>

        <DataTable :value="filteredFlavors" datakey="id" sortField="sort" :sortOrder="-1" responsiveLayout="scroll">
        
            <Column field="name" header="口味" />
            <Column header="创建时间">
                <template #body="slotProps">
                {{ formatDate(slotProps.data.created_at) }}
                </template>
            </Column>
            <Column header="更新时间">
                <template #body="slotProps">
                {{ formatDate(slotProps.data.updated_at) }}
                </template>
            </Column>

            <Column header="操作">
                <template #body="slotProps">
                    <Button icon="pi pi-pen-to-square" severity="secondary" class="operation-button" @click="vis=true;old_id=slotProps.data.id" />
                    <!--删除按钮-->
                    <Button icon="pi pi-trash" severity="danger" class="operation-button" @click="deleteFlavor(slotProps.data.id)" />
                    
                </template>
            </Column>
        </DataTable>

        <Dialog header="创建口味" v-model:visible="visible">
            <div class="dialog-form">
                <div class="form-group">
                    <label for="name" class="tag-font">口味名称</label>
                    <input v-model="name" id="name" type="text" class="input-field" />
                </div>
            </div>
            <template #footer>
                <Button label="取消" icon="pi pi-times" severity="success" @click="visible = false" />
                <Button label="保存" icon="pi pi-check" class="p-button-primary" @click="createFlavor()" />
            </template>
        </Dialog>

        <Dialog header="更新口味" v-model:visible="vis">
            <div class="dialog-form">
                <div class="form-group">
                    <label for="name" class="tag-font">口味名称</label>
                    <input v-model="name" id="name" type="text" class="input-field" />
                </div>
            </div>
            <template #footer>
                <Button label="取消" icon="pi pi-times" severity="success" @click="visible = false" />
                <Button label="保存" icon="pi pi-check" class="p-button-primary" @click="upgradeFlavor(old_id)" />
            </template>
        </Dialog>
    </div>
</template>

<style scoped>
    .action-bar{
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
        gap: 0.5rem;
    }
    .search-group {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex-grow: 1;
    }
    .search-input {
        flex-grow: 1;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 5px;
    }
    .search-button,
    .new-category-button {
        height: 100%;
        padding: 0.5rem 1rem;
    }
    .p-button-success {
        background-color: #28a745;
        border: none;
    }
    .p-button-primary {
        background-color: #007ad9;
        border: none;
    }
    .dialog-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 500px;
    }
    .tag-font{
        font-size: 1.1rem;
        font-weight: bold;
        margin-bottom: 1rem;
    }
    .input-field {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 5px;
        font-size: 1rem;
    }
    .form-group{
        display: flex;
        flex-direction: column;
        margin-bottom: 1rem;
    }
    .radio-group{
        display: flex;
        flex-direction: row;
        margin-top: 1rem;
        margin-bottom: 1rem;
        gap: 1rem;
    }
    .radio-item{
        display: flex;
        flex-direction: row;
    }
    .radio-item label {
        margin-top: 4px;
        color: #333;
        font-size: 14px;
        text-align: center;
    }
    .operation-button{
        margin-right: 0.5rem;
    }
</style>