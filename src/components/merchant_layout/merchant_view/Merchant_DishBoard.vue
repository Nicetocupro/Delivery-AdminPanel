<script setup lang="ts">
    import Button from "primevue/button";
    import Column from "primevue/column";
    import DataTable, { DataTableRowClickEvent } from "primevue/datatable";
    import Dialog from "primevue/dialog";
    import { useToast } from "primevue/usetoast";
    import { computed, onMounted, ref, toValue, watch } from "vue";
    import instance from "../../../http.js";
    import router from "../../../router/router.js";
    import { useRoute } from 'vue-router'
    import { RadioButton } from "primevue";
    import { FileUploadSelectEvent } from 'primevue/fileupload'; // 引入正确的类型

    interface Dish{
        id: number;
        name: string;
        price: number;
        description: string;
        sort: number;
        created_at: number;
        updated_at: number;
    }

    // 获取传递的参数
    const props = defineProps<{restaurantID: number}>();
    const restaurantID = props.restaurantID;
    let dishes = ref<Dish[]>([]);
    let editDish = ref<Dish | null>(null);

    const toast = useToast();

    const dish_name = ref("");

    let create_vis = ref(false);
    let edit_vis = ref(false);

    const src = ref<File | null>(null);
    const imageUrl = ref<string | null>(null); // 用于存储转换后的 URL

    let newDish = ref({
        name: "",
        price: "",
        description: "",
        sort: ""
    });

    // 格式化日期
    const formatDate = (timestamp: number): string => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString() + " " + date.toLocaleTimeString();
    };

    const fetchDishes = async() => {
        try{
            const response = await instance.get(`/merchant/restaurant/${restaurantID}/dish`);

            if(response.data.ecode == 200){
                if(response.data && response.data.data.dishes){
                    console.log(response.data.data.dishes);
                    dishes.value = response.data.data.dishes;
                }
                else{
                    console.error("No dishes data found in response:", response.data);
                    dishes.value = [];
                }
            }
        } catch(error) {
            console.log("ERROR fetching dishes", error.data);
            dishes.value = [];
        }
        
    };

    const searchDishes = () =>{
        toast.add({
            severity: "info",
            summary: "查询完成",
            detail: `查询结果包含 ${filteredDishes.value.length} 条记录`,
            life: 3000,
        });
    };

    const filteredDishes = computed(() =>{
        if(!dish_name.value)
            return dishes.value;

        return dishes.value.filter((dish) => 
            dish.name.includes(dish_name.value)
        );
    });

    const deleteDish = async (dishID: number) => {
        try{
            const response = await instance.delete(`/merchant/dish/${dishID}`);

            if(response.data.ecode == 200){
                toast.add({
                    severity: "success",
                    summary: "删除成功",
                    detail: "该菜品已成功删除。",
                    life: 3000,
                });
                fetchDishes();
            }
            else{
                console.log(response.data);
                toast.add({
                    severity: "error",
                    summary: "删除失败",
                    detail: response.data.msg || "删除菜品时出现问题。",
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

    const onFileSelect = (event: FileUploadSelectEvent) => {
            const file = event.files[0]; // 获取文件数组中的第一个文件

            if (!file) {
                console.error("未选择文件");
                return;
            }

            // 将选中的文件对象存储到 src
            src.value = file;
            imageUrl.value = URL.createObjectURL(file);

            // 如果需要读取文件（例如显示预览），你可以使用 FileReader
            const reader = new FileReader();

            reader.onload = (e: ProgressEvent<FileReader>) => {
                if (e.target && e.target.result) {
                    // 在这里可以处理 Base64 字符串，如果你还需要它的话
                    const base64String = e.target.result.toString();
                    console.log("文件读取为Base64：", base64String);
                } else {
                    console.error("读取文件失败");
                }
            };

            reader.onerror = () => {
                console.error("文件读取失败");
            };

            reader.readAsDataURL(file); // 读取文件为 Base64 格式
        };

    const openCreateDialog = () => {
        newDish.value = {
            name: "",
            price: "",
            description: "",
            sort: ""
        };
        create_vis.value = true;
        src.value = null;
        imageUrl.value = null;
    };

    const createDish = async () => {
        let data = new FormData();

        data.append("name", newDish.value.name);
        data.append("description", newDish.value.description);
        data.append("sort", newDish.value.sort);
        const priceInCents = parseFloat(newDish.value.price) * 100;
        data.append("price", priceInCents.toString());  // 转换为字符串
        if (src.value && src.value instanceof File) {
            data.append("image", src.value); // 将 File 对象添加到 FormData
        } else {
            console.error("未选择有效的图片文件");
        }

        console.log(data);

        try{
            const response = await instance.post(`/merchant/restaurant/${restaurantID}/dish`, data);
            if (response.data.ecode === 200) {
                toast.add({
                    severity: "success",
                    summary: "创建成功",
                    detail: "新菜品已成功创建。",
                    life: 3000,
                });
                fetchDishes();
                create_vis.value=false;
            }
            else{
                console.log(response.data);
                toast.add({
                    severity: "error",
                    summary: "创建失败",
                    detail: response.data.msg || "创建新菜品时出现问题。",
                    life: 3000,
                });
            }
        } catch(error) {
            console.error("Error creating dish:", error);
            toast.add({
                severity: "error",
                summary: "创建失败",
                detail: "创建菜品时发生错误，请稍后再试。",
                life: 3000,
            });
        }
    };

    const updateDish = async () =>{
        if(editDish.value){
            console.log(editDish.value);
            let data = new FormData();
            data.append("name", editDish.value.name);
            data.append("description", editDish.value.description);
            data.append("sort", editDish.value.sort.toString());
            const priceInCents = parseFloat(newDish.value.price) * 100;
            data.append("price", priceInCents.toString());  // 转换为字符串
            if (src.value && src.value instanceof File) {
                data.append("image", src.value); // 将 File 对象添加到 FormData
            } else {
                console.error("未选择有效的图片文件");
            }

            try{
                const response = await instance.put(`/merchant/dish/${editDish.value?.id}`, data);
                if(response.data.ecode == 200){
                    toast.add({
                        severity: "success",
                        summary: "更新成功",
                        detail: "菜品信息已成功更新。",
                        life: 3000,
                    });
                    fetchDishes();
                    edit_vis.value = false;
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

    const openEditDialog = (dish: Dish) => {
        editDish.value = { ...dish };
        console.log(editDish.value.id);
        edit_vis.value = true;
    };

    onMounted(fetchDishes);
</script>

<template>
    <div>
        <Toast />

        <div class="action-bar">
            <!--查询输入框与按钮和返回按钮-->
            <div class="search-group">
                <input v-model="dish_name" placeholder="查询菜品名" class="input-field search-input"/>
                <Button label="查询" icon="pi pi-search" class="p-button-primary search-button" @click="searchDishes" />
                <Button label="新建菜品" icon="pi pi-plus" @click="openCreateDialog" class="p-button-success new-category-button" />
                <Button as="router-link" label="返回餐馆页" icon="pi pi-arrow-left" to="/merchant_home/Merchant_restaurant" severity="help" />
            </div>
        </div>

        <DataTable :value="filteredDishes" datakey="id" sortField="sort" :sortOrder="-1"
            responsiveLayout="scroll" paginator :rows="5" :rowsPerPageOptions="[5, 10, 20, 50]">
            <Column field="name" header="菜品名称" />
            <Column field="description" header="菜品描述" />
            <Column header="菜品照片">
                <template #body="slotProps">
                    <Image :src="`https://localhost/api/v1/merchant/dish/image/${slotProps.data.image}`" 
                        style="width: 50px; height: 40px;" preview />
                </template>
            </Column>
            <Column header="菜品价格">
                <template #body="slotProps">
                    {{ slotProps.data.price / 100 }}
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
            <Column field="sort" header="排序值" sortable />
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
            <Column header="操作">
                <template #body="slotProps">
                    <!--修改按钮-->
                    <Button icon="pi pi-pencil" severity="success" class="operation-button" @click="openEditDialog(slotProps.data)" />
                    <!--删除按钮-->
                    <Button icon="pi pi-trash" severity="danger" class="operation-button" @click="deleteDish(slotProps.data.id)" />
                    <!--口味添加-->
                    <Button icon="pi pi-plus" severity="success" class="operation-button" />
                    <!--口味删除-->
                    <Button icon="pi pi-minus" severity="danger" class="operation-button" /> 
                </template>
            </Column>
        
        </DataTable>

        <Dialog header="创建菜品" v-model:visible="create_vis">
            <div class="dialog-form">
                <div class="form-group">
                    <label for="name" class="tag-font">菜品名称</label>
                    <input v-model="newDish.name" id="name" type="text" class="input-field" />
                </div>
                <div class="form-group">
                    <label for="sort" class="tag-font">排序值</label>
                    <input v-model="newDish.sort" id="sort" type="number" class="input-field" />
                </div>
                <div class="form-group">
                    <label for="description" class="tag-font">描述</label>
                    <input
                        v-model="newDish.description"
                        id="description"
                        type="text"
                        class="input-field"
                    />
                </div>
                <div class="form-group">
                    <label for="price" class="tag-font">价格</label>
                    <input
                        v-model="newDish.price"
                        id="price"
                        type="number"
                        class="input-field"
                    />
                </div>
                <div class="form-group">
                    <label for="image" class="tag-font">菜品图片</label>
                    <FileUpload mode="basic" @select="onFileSelect" customUpload auto severity="secondary" class="p-button-outlined" />
                    <img v-if="imageUrl" :src="imageUrl" alt="Image" class="shadow-md rounded-xl w-full sm:w-64" />
                </div>
            </div>
            <template #footer>
                <Button label="取消" icon="pi pi-times" severity="success" @click="create_vis = false" />
                <Button label="保存" icon="pi pi-check" class="p-button-primary" @click="createDish()" />
            </template>
        </Dialog>

        <Dialog header="编辑菜品" v-model:visible="edit_vis" v-if="editDish">
            <div class="dialog-form">
                <div class="form-group">
                    <label for="name" class="tag-font">菜品名称</label>
                    <input v-model="editDish.name" id="name" type="text" class="input-field" />
                </div>
                <div class="form-group">
                    <label for="sort" class="tag-font">排序值</label>
                    <input v-model="editDish.sort" id="sort" type="number" class="input-field" />
                </div>
                <div class="form-group">
                    <label for="description" class="tag-font">描述</label>
                    <input
                        v-model="editDish.description"
                        id="description"
                        type="text"
                        class="input-field"
                    />
                </div>
                <div class="form-group">
                    <label for="price" class="tag-font">价格</label>
                    <input
                        v-model="editDish.price"
                        id="price"
                        type="number"
                        class="input-field"
                    />
                </div>
                <div class="form-group">
                    <label for="image" class="tag-font">菜品图片</label>
                    <FileUpload mode="basic" @select="onFileSelect" customUpload auto severity="secondary" class="p-button-outlined" />
                    <img v-if="imageUrl" :src="imageUrl" alt="Image" class="shadow-md rounded-xl w-full sm:w-64" />
                </div>
            </div>
            <template #footer>
                <Button label="取消" icon="pi pi-times" severity="success" @click="edit_vis = false" />
                <Button label="保存" icon="pi pi-check" class="p-button-primary" @click="updateDish()" />
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
    .input-field {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 5px;
        font-size: 1rem;
    }
    .operation-button{
        margin-right: 0.5rem;
    }
    .dialog-form {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        width: 500px;
    }
    .form-group{
        display: flex;
        flex-direction: column;
        margin-bottom: 1rem;
    }
    .tag-font{
        font-size: 1.1rem;
        font-weight: bold;
        margin-bottom: 1rem;
    }

</style>