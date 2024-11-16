<script setup lang="ts">
import Button from "primevue/button";
import Column from "primevue/column";
import DataTable from "primevue/datatable";
import Dialog from "primevue/dialog";
import { useToast } from "primevue/usetoast"; // 引入 useToast
import { computed, onMounted, ref } from "vue";
import instance from "../../../http.js"; // 假设这是你的 HTTP 实例
import router from "../../../router/router.js";

interface Restaurant {
  id: number;
  restaurant_name: string;
  address: string;
  description: string;
  minimum_delivery_amount: number;
  rating: number;
  created_at: number;
  updated_at: number;
  status: number;
}

// 获取 Toast 实例
const toast = useToast();

let visible = ref(false); // 控制Dialog弹窗显示
let editingRestaurant = ref<Restaurant | null>(null); // 编辑餐厅对象
let restaurants = ref<Restaurant[]>([]); // 餐厅列表
let searchQuery = ref(""); // 查询输入框的值

// 新建餐厅表单数据
let newRestaurant = ref({
  restaurant_name: "",
  address: "",
  description: "",
  minimum_delivery_amount: 0,
});

// 格式化日期
const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString() + " " + date.toLocaleTimeString();
};

const GetRestaurantStatus = async (restaurantId: number): Promise<number> => {
  try {
    const response = await instance.get(
      `merchant/restaurant/${restaurantId}/status`
    );
    if (response.data.ecode === 200) {
      console.log(response.data);
      return response.data.data.status;
    } else {
      console.error("Unexpected response format:", response.data);
      return -1; // 返回 -1 表示响应格式不符合预期
    }
  } catch (error) {
    console.error("Error fetching restaurant status:", error);
    return -1;
  }
};

// 获取餐厅列表
const fetchRestaurants = async () => {
  try {
    const response = await instance.get("merchant/restaurants");
    if (response.data && response.data.data.restaurants) {
      // 将值赋给 restaurants
      restaurants.value = response.data.data.restaurants;

      restaurants.value.forEach((restaurant) => {
        // 将分处理成元
        restaurant.minimum_delivery_amount = parseFloat(
          (restaurant.minimum_delivery_amount / 100).toFixed(2)
        );
        // 将 restaurant 的状态赋初值
        GetRestaurantStatus(restaurant.id)
          .then((status) => {
            restaurant.status = status;
          })
          .catch((error) => {
            console.error("Failed to get restaurant status:", error);
          });
      });
    } else {
      console.error("No restaurants data found in response:", response.data);
      restaurants.value = [];
    }
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    restaurants.value = [];
  }
};

// 创建餐厅
const createRestaurant = async () => {
  let data = new FormData();
  data.append("restaurant_name", newRestaurant.value.restaurant_name);
  data.append("address", newRestaurant.value.address);
  data.append("description", newRestaurant.value.description);
  // 将 minimum_delivery_amount 转换为字符串
  data.append(
    "minimum_delivery_amount",
    (newRestaurant.value.minimum_delivery_amount * 100).toString()
  );
  console.log(data);
  try {
    const response = await instance.post("merchant/restaurant", data);
    if (response.data.ecode === 200) {
      toast.add({
        severity: "success",
        summary: "创建成功",
        detail: "餐厅已成功创建。",
        life: 3000,
      });
      fetchRestaurants();
      visible.value = false;
    } else {
      console.log(response.data);
      toast.add({
        severity: "error",
        summary: "创建失败",
        detail: response.data.msg || "创建餐厅时出现问题。",
        life: 3000,
      });
    }
  } catch (error) {
    console.error("Error creating restaurant:", error);
    toast.add({
      severity: "error",
      summary: "创建失败",
      detail: "创建餐厅时发生错误，请稍后再试。",
      life: 3000,
    });
  }
};

// 删除餐厅
const deleteRestaurant = async (restaurantId: number) => {
  try {
    const response = await instance.delete(
      `merchant/restaurant/${restaurantId}`
    );

    if (response.data.ecode === 200) {
      toast.add({
        severity: "success",
        summary: "删除成功",
        detail: "餐厅已成功删除。",
        life: 3000,
      });
      fetchRestaurants(); // 重新加载餐厅列表
    } else {
      toast.add({
        severity: "error",
        summary: "删除失败",
        detail: response.data.msg || "删除餐厅时出现问题。",
        life: 3000,
      });
    }
  } catch (error) {
    console.error("Error deleting restaurant:", error);
    toast.add({
      severity: "error",
      summary: "删除失败",
      detail: "删除餐厅时发生错误，请稍后再试。",
      life: 3000,
    });
  }
};

// 修改餐厅
const updateRestaurant = async () => {
  if (editingRestaurant.value) {
    let data = new FormData();
    data.append("restaurant_name", editingRestaurant.value.restaurant_name);
    data.append("address", editingRestaurant.value.address);
    data.append("description", editingRestaurant.value.description);
    data.append(
      "minimum_delivery_amount",
      (editingRestaurant.value.minimum_delivery_amount * 100).toString()
    );

    try {
      const response = await instance.put(
        `merchant/restaurant/${editingRestaurant.value.id}`,
        data
      );

      if (response.data.ecode === 200) {
        toast.add({
          severity: "success",
          summary: "更新成功",
          detail: "餐厅信息已成功更新。",
          life: 3000,
        });
        fetchRestaurants(); // 重新加载餐厅列表
        visible.value = false; // 关闭弹窗
      } else {
        toast.add({
          severity: "error",
          summary: "更新失败",
          detail: response.data.msg || "更新餐厅信息时出现问题。",
          life: 3000,
        });
      }
    } catch (error) {
      console.error("Error updating restaurant:", error);
      toast.add({
        severity: "error",
        summary: "更新失败",
        detail: "更新餐厅信息时发生错误，请稍后再试。",
        life: 3000,
      });
    }
  }
};

// 进入餐厅的函数
const enterRestaurant = (restaurantId: number) => {
  console.log("进入餐厅:", restaurantId);
  router.push(`/restaurant/${restaurantId}`);
};

// 定义过滤后的餐厅列表，基于 searchQuery 动态更新
const filteredRestaurants = computed(() => {
  if (!searchQuery.value) {
    return restaurants.value;
  }
  // 过滤餐厅列表，仅返回包含查询关键字的餐厅
  return restaurants.value.filter((restaurant) =>
    restaurant.restaurant_name.includes(searchQuery.value)
  );
});

const searchRestaurants = () => {
  // 因为 filteredRestaurants 是计算属性，查询逻辑在这里已经生效
  toast.add({
    severity: "info",
    summary: "查询完成",
    detail: `查询结果包含 ${filteredRestaurants.value.length} 条记录`,
    life: 3000,
  });
};

const toggleRestaurantStatus = async (restaurant) => {
  // 如果状态是 -1，则不可更改，直接返回
  if (restaurant.status === -1) {
    toast.add({
      severity: "warn",
      summary: "操作无效",
      detail: "此餐厅状态不可更改。",
      life: 3000,
    });
    return;
  }

  try {
    // 更新状态的 API 请求
    const response = await instance.put(
      `merchant/restaurant/${restaurant.id}/status/${restaurant.status}`
    );

    if (response.data.ecode === 200) {
      console.log(response);
      // 更新状态成功后，更新本地状态
      restaurant.status = await GetRestaurantStatus(restaurant.id);
      toast.add({
        severity: "success",
        summary: restaurant.status === 1 ? "餐厅已开启" : "餐厅已关闭",
        detail: `餐厅状态已设置为${restaurant.status === 1 ? "开启" : "关闭"}`,
        life: 3000,
      });
    } else {
      toast.add({
        severity: "error",
        summary: "操作失败",
        detail: response.data.msg || "设置餐厅状态时出现问题。",
        life: 3000,
      });
    }
  } catch (error) {
    console.error("Error toggling restaurant status:", error);
    toast.add({
      severity: "error",
      summary: "操作失败",
      detail: "设置餐厅状态时发生错误，请稍后再试。",
      life: 3000,
    });
  }
};

// 打开创建餐厅弹窗
const openCreateDialog = () => {
  editingRestaurant.value = null;
  newRestaurant.value = {
    restaurant_name: "",
    address: "",
    description: "",
    minimum_delivery_amount: 0,
  };
  visible.value = true;
};

// 打开编辑餐厅弹窗
const openEditDialog = (restaurant: Restaurant) => {
  editingRestaurant.value = { ...restaurant };
  visible.value = true;
};

// 页面加载时获取餐厅列表
onMounted(fetchRestaurants);
</script>


<template>
  <div>
    <!-- 添加 Toast 组件以展示消息 -->
    <Toast />

    <div class="action-bar">
      <!-- 查询输入框和查询按钮 -->
      <div class="search-group">
        <input
          v-model="searchQuery"
          placeholder="查询餐厅名称"
          class="input-field search-input"
        />
        <Button
          label="查询"
          icon="pi pi-search"
          class="p-button-primary search-button"
          @click="searchRestaurants"
        />
      </div>

      <!-- 新建餐厅按钮 -->
      <Button
        label="新建餐厅"
        icon="pi pi-plus"
        @click="openCreateDialog"
        class="p-button-success new-restaurant-button"
      />
    </div>

    <DataTable
      :value="filteredRestaurants"
      dataKey="id"
      responsiveLayout="scroll"
    >
      <Column field="restaurant_name" header="餐厅名称" />
      <Column field="address" header="地址" />
      <Column field="description" header="描述" />
      <Column field="minimum_delivery_amount" header="最低配送金额（元）" />
      <Column field="rating" header="评分" />
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

      <!-- 使用 template 插槽来自定义操作列的内容 -->
      <Column header="操作">
        <template #body="slotProps">
          <!-- 开关餐厅按钮 -->
          <Button
            :label="
              slotProps.data.status === 1
                ? '关闭餐厅'
                : slotProps.data.status === 0
                ? '开启餐厅'
                : '不可更改'
            "
            :icon="
              slotProps.data.status === 1
                ? 'pi pi-times'
                : slotProps.data.status === 0
                ? 'pi pi-check'
                : 'pi pi-ban'
            "
            class="p-button-text"
            :class="
              slotProps.data.status === 1
                ? 'p-button-danger'
                : slotProps.data.status === 0
                ? 'p-button-success'
                : 'p-button-secondary'
            "
            :disabled="slotProps.data.status === -1"
            @click="() => toggleRestaurantStatus(slotProps.data)"
          />
          <Button
            icon="pi pi-pencil"
            class="p-button-text"
            @click="() => openEditDialog(slotProps.data)"
          />
          <Button
            icon="pi pi-trash"
            class="p-button-text p-button-danger"
            @click="() => deleteRestaurant(slotProps.data.id)"
          />
          <Button
            label="进入餐厅"
            icon="pi pi-sign-in"
            class="p-button-text p-button-info"
            @click="() => enterRestaurant(slotProps.data.id)"
          />
        </template>
      </Column>
    </DataTable>
    <Dialog header="创建/编辑餐厅" v-model:visible="visible">
      <div class="dialog-form">
        <div v-if="editingRestaurant">
          <label for="restaurant_name">餐厅名称</label>
          <input
            v-model="editingRestaurant.restaurant_name"
            id="restaurant_name"
            type="text"
            class="input-field"
          />

          <label for="address">地址</label>
          <input
            v-model="editingRestaurant.address"
            id="address"
            type="text"
            class="input-field"
          />

          <label for="description">描述</label>
          <input
            v-model="editingRestaurant.description"
            id="description"
            type="text"
            class="input-field"
          />

          <label for="minimum_delivery_amount">最低配送金额</label>
          <input
            v-model="editingRestaurant.minimum_delivery_amount"
            id="minimum_delivery_amount"
            type="number"
            class="input-field"
          />
        </div>

        <div v-else>
          <label for="restaurant_name">餐厅名称</label>
          <input
            v-model="newRestaurant.restaurant_name"
            id="restaurant_name"
            type="text"
            class="input-field"
          />

          <label for="address">地址</label>
          <input
            v-model="newRestaurant.address"
            id="address"
            type="text"
            class="input-field"
          />

          <label for="description">描述</label>
          <input
            v-model="newRestaurant.description"
            id="description"
            type="text"
            class="input-field"
          />

          <label for="minimum_delivery_amount">最低配送金额</label>
          <input
            v-model="newRestaurant.minimum_delivery_amount"
            id="minimum_delivery_amount"
            type="number"
            class="input-field"
          />
        </div>
      </div>
      <template #footer>
        <Button
          label="取消"
          icon="pi pi-times"
          class="p-button-text"
          @click="visible = false"
        />
        <Button
          label="保存"
          icon="pi pi-check"
          class="p-button-primary"
          @click="editingRestaurant ? updateRestaurant() : createRestaurant()"
        />
      </template>
    </Dialog>
  </div>
</template>

<style scoped>
.action-bar {
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
.new-restaurant-button {
  height: 100%;
  padding: 0.5rem 1rem;
}

.p-button-success {
  background-color: #28a745;
  border: none;
}

.dialog-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.input-field {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 1rem;
}

.mb-3 {
  margin-bottom: 1rem;
}

.p-datatable {
  margin-top: 1rem;
}

.p-datatable .p-datatable-header {
  font-weight: bold;
  font-size: 1.2rem;
  text-align: left;
}

.p-datatable .p-column-title {
  font-weight: 500;
}

.p-button {
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 5px;
}

.p-button-primary {
  background-color: #007ad9;
  border: none;
}

.p-button-danger {
  color: #f44336;
}

.p-dialog .p-dialog-header {
  font-weight: bold;
  font-size: 1.5rem;
}

.p-dialog .p-dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
}

.p-dialog .p-dialog-content {
  padding-top: 0.5rem;
}

.p-dialog .input-field {
  margin-top: 0.5rem;
}
</style>
