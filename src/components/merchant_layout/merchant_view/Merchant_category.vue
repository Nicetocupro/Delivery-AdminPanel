<script setup lang="ts">
    import Button from "primevue/button";
    import Column from "primevue/column";
    import DataTable, { DataTableRowClickEvent } from "primevue/datatable";
    import Dialog from "primevue/dialog";
    import { useToast } from "primevue/usetoast";
    import { computed, onMounted, ref, toValue } from "vue";
    import instance from "../../../http.js";
    import router from "../../../router/router.js";
    import { MultiSelect, RadioButton } from "primevue";

    interface Category{
        id: number;
        name: string;
        status: number;
        type: number;
        created_at: number;
        updated_at: number;
        sort: number;
        dishes: Dish[]
    };

    interface Dish{
        id: number;
        name: string;
        price: number;
        description: string;
        sort: number;
        created_at: number;
        updated_at: number;
    };

    // 获取传递的参数
    const props = defineProps<{restaurantID: number}>();
    const restaurantID = props.restaurantID;

    let chosenCategory = ref();

    const toast = useToast();
    const category_name = ref("");
    let visible = ref(false); // 控制Dialog弹窗显示
    let editingCategory = ref<Category | null>(null); // 编辑餐厅对象
    let categories = ref<Category[]>([]); // 类列表

    let addDish = ref<Dish[] | null>(null);
    let deleteDish = ref<Dish[] | null>(null);
    const currentDish = ref<Dish[]>([]);

    const sumDishes = ref<Dish[]>([]);

    let add_dish_vis = ref(false);
    let delete_dish_vis = ref(false);

    const expandedRows = ref<Category[]>([]);

    // 格式化日期
    const formatDate = (timestamp: number): string => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    };

    let newCategory = ref({
        name: "",
        type: "1",
        sort: "",
        status: "1"
    });

    const fetchDishes = async() => {
        try{
            const response = await instance.get(`/merchant/restaurant/${restaurantID}/dish`);

            if(response.data.ecode == 200){
                if(response.data && response.data.data.dishes){
                    console.log(response.data.data.dishes);
                    sumDishes.value = response.data.data.dishes;
                }
                else{
                    console.error("No dishes data found in response:", response.data);
                    sumDishes.value = [];
                }
            }
        } catch(error) {
            console.log("ERROR fetching dishes", error.data);
            sumDishes.value = [];
        }
    };

    const fetchCategories = async() =>{
        try{
            const response = await instance.get(`/merchant/restaurant/${restaurantID}/categories`);

            if(response.data.ecode == 200){
                if(response.data && response.data.data.categories){
                    console.log(response.data.data.categories);
                    categories.value = response.data.data.categories;
                }
                else {
                    console.error("No categories data found in response:", response.data);
                    categories.value = [];
                }
            }
        } catch(error) {
            console.log("ERROR fetching categories", error.data);
            categories.value = [];
        }
    }

    // 定义过滤后的餐厅列表, 基于category_name进行动态更新
    const filteredCategory = computed(() => {
        if(!category_name.value)
            return categories.value;

        return categories.value.filter((category) => 
            category.name.includes(category_name.value)
        );
    });

    const searchCategories = () => {
        toast.add({
            severity: "info",
            summary: "查询完成",
            detail: `查询结果包含 ${filteredCategory.value.length} 条记录`,
            life: 3000,
        });
    };

    const createCategory = async () => {
        let data = new FormData();
        data.append("name", newCategory.value.name);
        data.append("type", newCategory.value.type);
        data.append("sort", newCategory.value.sort);
        data.append("status", newCategory.value.status);

        console.log(data);

        try{
            const response = await instance.post(`/merchant/restaurant/${restaurantID}/category`, data);
            if (response.data.ecode === 200) {
                toast.add({
                    severity: "success",
                    summary: "创建成功",
                    detail: "新品类已成功创建。",
                    life: 3000,
                });
                fetchCategories();
                visible.value=false;
            }
            else{
                console.log(response.data);
                toast.add({
                    severity: "error",
                    summary: "创建失败",
                    detail: response.data.msg || "创建新品类时出现问题。",
                    life: 3000,
                });
            }
        } catch(error) {
            console.error("Error creating category:", error);
            toast.add({
                severity: "error",
                summary: "创建失败",
                detail: "创建品类时发生错误，请稍后再试。",
                life: 3000,
            });
        }
    };

    const deleteCategory = async (categoryID: number) => {
        try{
            const response = await instance.delete(`/merchant/category/${categoryID}`);

            if(response.data.ecode == 200){
                toast.add({
                    severity: "success",
                    summary: "删除成功",
                    detail: "品类已成功删除。",
                    life: 3000,
                });
                fetchCategories();
            }
            else{
                console.log(response.data);
                toast.add({
                    severity: "error",
                    summary: "删除失败",
                    detail: response.data.msg || "删除品类时出现问题。",
                    life: 3000,
                });
            }
        } catch(error) {
            console.error("Error deleting category:", error);
            toast.add({
                severity: "error",
                summary: "删除失败",
                detail: "删除品类时发生错误，请稍后再试。",
                life: 3000,
            });
        }
    };

    const updateCategory = async () =>{
        if(editingCategory.value){
            console.log(editingCategory.value);
            let data = new FormData();
            data.append("name", editingCategory.value.name);
            data.append("type", editingCategory.value.type.toString());
            data.append("sort", editingCategory.value.sort.toString());
            data.append("status", editingCategory.value.status.toString());

            try{
                console.log(data.values);
                const response = await instance.put(`/merchant/category/${editingCategory.value?.id}`, data);

                if(response.data.ecode == 200){
                    toast.add({
                        severity: "success",
                        summary: "更新成功",
                        detail: "品类信息已成功更新。",
                        life: 3000,
                    });
                    fetchCategories();
                    visible.value = false;
                } else {
                    toast.add({
                        severity: "error",
                        summary: "更新失败",
                        detail: response.data.msg || "更新信息时出现问题。",
                        life: 3000,
                    });
                }
            } catch(error) {
                console.error("Error updating category:", error);
                toast.add({
                    severity: "error",
                    summary: "更新失败",
                    detail: "更新信息时发生错误，请稍后再试。",
                    life: 3000,
                });
            }
        }
    };

    const openCreateDialog = () => {
        editingCategory.value = null;
        newCategory.value = {
            name: "",
            type: "0",
            sort: "",
            status: "1"
        };
        visible.value = true;
    };

    const openEditDialog = (category: Category) => {
        editingCategory.value = { ...category };
        console.log(editingCategory.value.id);
        visible.value = true;
    };

    const setExpandedRow = ($event: DataTableRowClickEvent) => {
        // 判断当前行是否已展开
        const isExpanded = expandedRows.value.some((row: Category) => row.id === $event.data.id);

        if (isExpanded) {
            // 如果当前行已展开，则折叠它
            expandedRows.value = expandedRows.value.filter((row: Category) => row.id !== $event.data.id);
        } else {
            // 如果当前行未展开，则展开它
            expandedRows.value = [...expandedRows.value, $event.data];
        }
    };

    const openAddDishDialog = (categoryID : number) => {
        chosenCategory.value = categoryID;

        addDish.value = null;
        
        add_dish_vis.value = true;
    };

    const openDeleteDishDialog = (category : Category) => {
        chosenCategory.value = category.id;

        deleteDish.value = null;

        currentDish.value = [...category.dishes]

        delete_dish_vis.value = true;
    }

    const addDishes = async () => {
        if(addDish.value){
            console.log(addDish.value);
            let data = new FormData();
            const ids = addDish.value ? addDish.value.map(dish => dish.id) : [];
            for(var i = 0; i < ids.length; i++){
                data.append("dishes", ids[i].toString());
            }
            console.log(data);
            try{
                const response  = await instance.post(`/merchant/category/${chosenCategory.value}/dishes/add`, data);
                if(response.data.ecode == 200){
                    toast.add({
                        severity: "success",
                        summary: "更新成功",
                        detail: "菜品信息已成功更新。",
                        life: 3000,
                    });
                    fetchCategories();
                    add_dish_vis.value = false;
                } else {
                    toast.add({
                        severity: "error",
                        summary: "更新失败",
                        detail: response.data.msg || "更新信息时出现问题。",
                        life: 3000,
                    });
                }
            } catch(error) {
                console.error("Error updating dish:", error);
                toast.add({
                    severity: "error",
                    summary: "更新失败",
                    detail: "更新信息时发生错误，请稍后再试。",
                    life: 3000,
                });
            }
        }
    };

    const deleteDishes = async () => {
        if(deleteDish.value){
            console.log(deleteDish.value);
            let data = new FormData();
            const ids = deleteDish.value ? deleteDish.value.map(dish => dish.id) : [];
            for(var i = 0; i < ids.length; i++){
                data.append("dishes", ids[i].toString());
            }

            try{
                const response  = await instance.post(`/merchant/category/${chosenCategory.value}/dishes/delete`, data);
                if(response.data.ecode == 200){
                    toast.add({
                        severity: "success",
                        summary: "更新成功",
                        detail: "菜品信息已成功更新。",
                        life: 3000,
                    });
                    fetchCategories();
                    delete_dish_vis.value = false;
                } else {
                    toast.add({
                        severity: "error",
                        summary: "更新失败",
                        detail: response.data.msg || "更新信息时出现问题。",
                        life: 3000,
                    });
                }
            } catch(error) {
                console.error("Error updating dish:", error);
                toast.add({
                    severity: "error",
                    summary: "更新失败",
                    detail: "更新信息时发生错误，请稍后再试。",
                    life: 3000,
                });
            }
        }
    };

    onMounted(fetchCategories);
    onMounted(fetchDishes);
</script>

<template>
    <div>
        <Toast />

        <div class="action-bar">
            <!--查询输入框与按钮和返回按钮-->
            <div class="search-group">
                <input v-model="category_name" placeholder="查询品类名" class="input-field search-input"/>
                <Button label="查询" icon="pi pi-search" class="p-button-primary search-button" @click="searchCategories" />
                <Button label="新建品类" icon="pi pi-plus" @click="openCreateDialog" class="p-button-success new-category-button" />
                <Button as="router-link" label="返回餐馆页" icon="pi pi-arrow-left" to="/merchant_home/Merchant_restaurant" severity="help" />
            </div>
        </div>

        <DataTable :value="filteredCategory" datakey="id" sortField="sort" :sortOrder="-1" responsiveLayout="scroll" v-model:expandedRows="expandedRows">
            <Column expander style="width: 5rem" />
            <Column field="name" header="品类名称" />
            <Column field="type" header="类型">
                <template #body="slotProps">
                    {{ slotProps.data.type === 1 ? '菜品' : '套餐' }}
                </template>
            </Column>
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
            <Column field="sort" header="排序值" sortable/>
            <Column header="品类状态">
                <template #body="slotProps">
                    {{slotProps.data.status === 2 ? 'ON' : 'OFF'}}
                </template>
            </Column>
            

            <Column header="操作">
                <template #body="slotProps">
                    <!--修改按钮-->
                    <Button icon="pi pi-pencil" severity="success" class="operation-button" @click="openEditDialog(slotProps.data)" />
                    <!--删除按钮-->
                    <Button icon="pi pi-trash" severity="danger" class="operation-button" @click="deleteCategory(slotProps.data.id)" />
                    <!--添加菜-->
                    <Button icon="pi pi-plus" severity="success" class="operation-button" @click="openAddDishDialog(slotProps.data.id)" />
                    <!--s删除菜-->
                    <Button icon="pi pi-minus" severity="danger" class="operation-button" @click="openDeleteDishDialog(slotProps.data)"/>
                </template>
            </Column>
            <template #expansion="slotProps">
                <div class="p-4">
                    <h5>菜品列表</h5>
                    <DataTable :value="slotProps.data.dishes" datakey="id" sortField="sort" :sortOrder="-1" responsiveLayout="scroll">
                        <Column field="name" header="菜品名称" />
                        <Column header="照片" style="max-height: 3rem; max-width: 6rem;" >
                            <template #body="slotProps">
                                <Image :src="`https://localhost/api/v1/merchant/dish/image/${slotProps.data.image}`" 
                                    style="width: 40px; height: 40px;" preview />
                            </template>
                        </Column>
                        <Column header="菜品价格">
                            <template #body="slotProps">
                                {{ slotProps.data.price / 100 }}
                            </template>
                        </Column>
                        <Column field="description" header="菜品描述" />
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
                        <Column header="排序值" field="sort" />
                        <Column header="口味">
                            <template #body="slotProps">
                                <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                                    <Tag 
                                        v-for="(flavor, index) in slotProps.data.flavors"
                                        :key="index"
                                        :value="flavor.name"
                                        style="margin-bottom: 4px;"
                                    />
                                </div>
                            </template>
                        </Column>
                    </DataTable>
                </div>
            </template>
        </DataTable>

        <Dialog header="创建/编辑品类" v-model:visible="visible">
            <div class="dialog-form">
                <div v-if="editingCategory">
                    <div class="form-group">
                        <label for="name" class="tag-font">品类名称</label>
                        <input v-model="editingCategory.name" id="name" type="text" class="input-field" />
                    </div>
                    <label for="type" class="tag-font">类型</label>
                    <div class="radio-group">
                        <RadioButton inputId="菜品" name="dish" :value="1" v-model="editingCategory.type" class="radio-item"/>
                        <label for="dish">菜品</label>
                        <RadioButton inputId="套餐" name="package" :value="2" v-model="editingCategory.type" class="radio-item" />
                        <label for="package">套餐</label>
                    </div>
                    <div class="form-group">
                        <label for="sort" class="tag-font">排序值</label>
                        <input v-model="editingCategory.sort" id="sort" type="number" class="input-field" />
                    </div>
                    <label for="type" class="tag-font">品类状态</label>
                    <div class="radio-group">
                        <RadioButton inputId="启用" name="on" :value="2" v-model="editingCategory.status" class="radio-item"/>
                        <label for="on">启用</label>
                        <RadioButton inputId="关闭" name="off" :value="1" v-model="editingCategory.status" class="radio-item" />
                        <label for="off">关闭</label>
                    </div>
                </div>
                <div v-else>
                    <div class="form-group">
                        <label for="name" class="tag-font">品类名称</label>
                        <input v-model="newCategory.name" id="name" type="text" class="input-field" />
                    </div>
                    <label for="type" class="tag-font">类型</label>
                    <div class="radio-group">
                        <RadioButton inputId="菜品" name="dish" :value="1" v-model="newCategory.type" class="radio-item"/>
                        <label for="dish">菜品</label>
                        <RadioButton inputId="套餐" name="package" :value="2" v-model="newCategory.type" class="radio-item" />
                        <label for="package">套餐</label>
                    </div>
                    <div class="form-group">
                        <label for="sort" class="tag-font">排序值</label>
                        <input v-model="newCategory.sort" id="sort" type="number" class="input-field" />
                    </div>
                </div>
            </div>
            <template #footer>
                <Button label="取消" icon="pi pi-times" severity="success" @click="visible = false" />
                <Button label="保存" icon="pi pi-check" class="p-button-primary" @click="editingCategory ? updateCategory() : createCategory()" />
            </template>
        </Dialog>

        <Dialog header="添加菜品" v-model:visible="add_dish_vis">
            <div class="dialog-form">
                <MultiSelect v-model="addDish" :options="sumDishes" optionLabel="name" filter placeholder="选择菜品"
                    class="w-full md:w-80" /> 
            </div>
            <template #footer>
                <Button label="取消" icon="pi pi-times" severity="success" @click="add_dish_vis = false" />
                <Button label="保存" icon="pi pi-check" class="p-button-primary" @click="addDishes" />
            </template>
        </Dialog>

        <Dialog header="删除菜品" v-model:visible="delete_dish_vis">
            <div class="dialog-form">
                <MultiSelect v-model="deleteDish" :options="currentDish" optionLabel="name" filter placeholder="选择菜品"
                    class="w-full md:w-80" /> 
            </div>
            <template #footer>
                <Button label="取消" icon="pi pi-times" severity="success" @click="delete_dish_vis = false" />
                <Button label="保存" icon="pi pi-check" class="p-button-primary" @click="deleteDishes" />
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