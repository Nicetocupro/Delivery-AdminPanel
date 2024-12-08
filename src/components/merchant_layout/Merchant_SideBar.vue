<script setup>
import Menu from "primevue/menu";
import { ref } from "vue";

let base = "/#/merchant_home";

const items = ref([
  { label: "Home", icon: "pi pi-home", url: base },
  {
    label: "我的餐厅",
    icon: "pi pi-fw pi-shopping-cart",
    url: base + "/Merchant_restaurant",
  },
  {
    label: "个人信息",
    icon: "pi pi-user",
    url: base + "/change_merchant_password",
  },
]);
</script>

<template>
  <div class="layout_sidebar">
    <Menu :model="items" class="w-full"></Menu>
  </div>
</template>



<style scoped>
@import "../../assets/sidebar.css";
</style>

