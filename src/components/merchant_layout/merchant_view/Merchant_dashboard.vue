<script setup lang="ts">
    import { Card } from 'primevue';
    import { computed, onMounted, ref } from "vue";
    import instance from '../../../http';

    const restaurant_count = ref(0);

    onMounted(()=>{
        get_RestaurantCount();
    });

    const get_RestaurantCount = async () => {
        try{
            const response = await instance.get('/merchant/restaurants');
            if(response.data.ecode == 200){
                console.log(response.data)
                restaurant_count.value = response.data.data.restaurants.length;
            }
        } catch(error) {alert(error.message);}
    }
</script>

<template>
    <Card class="custom-card">
        <template #content>
            <div class="custom-card-header">
                <div class="header-left">
                    <span class="restaurant-label">Current total number of restaurants</span>
                    <div class="restaurant-count">{{restaurant_count}}</div>
                </div>
            <div class="icon-container">
                <i class="pi pi-shopping-cart custom-icon"></i>
            </div>
        </div>
        </template>
        <template #footer>
          <div class="custom-card-footer">
                <div class="footer-content">
                    <span class="footer-text">Under your management</span>
                </div>
            </div>
        </template>
      </Card>
</template>

<style scoped>
/* 卡片容器样式 */
.custom-card {
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background: #ffffff;
  padding: 1.5rem;
  font-family: 'Roboto', sans-serif;
}

/* 卡片头部样式 */
.custom-card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 左侧文字 */
.header-left {
  display: flex;
  flex-direction: column;
}

/* "Orders" 标签样式 */
.restaurant-label {
  font-size: 1.75rem;
  font-style: italic;
  color: #616161; /* 颜色调整为更中性的灰色 */
  font-weight: 500;
  margin-bottom: 1rem;
}

/* 订单数量样式 */
.restaurant-count {
  font-size: 2.5rem; /* 增大订单数量字体，突出重点 */
  font-weight: 700;
  color: #263238; /* 更深的灰色，更具层次感 */
}

/* 右侧图标容器 */
.icon-container {
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(33, 150, 243, 0.1);
  border-radius: 50%;
  width: 3rem;
  height: 3rem;
}

.custom-icon {
  color: #2196f3;
  font-size: 1.75rem;
}

/* 底部内容样式 */
.custom-card-footer {
  display: flex;
  justify-content: center;
}

.footer-content {
    display: flex;
    flex-direction: column;
}

.footer-text {
  font-size: 1.35rem;
  color: #2196f3;
  font-weight: 600;
  margin-right: 0.5rem;
}
</style>