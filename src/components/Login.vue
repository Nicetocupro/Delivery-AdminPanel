<script setup lang="ts">
import Button from "primevue/button"; // 按钮组件需要引入
import IftaLabel from "primevue/iftalabel";
import InputText from "primevue/inputtext";
import RadioButton from "primevue/radiobutton";
import { ref } from "vue";
import instance from "../http.js";
import router from "../router/router";

// 定义响应式变量
const Account = ref("");
const password = ref("");
const identity = ref("admin");

// 校验函数：根据身份验证账号和密码长度
const validateForm = () => {
  if (identity.value === "admin") {
    return (
      Account.value.length >= 10 &&
      Account.value.length <= 30 &&
      password.value.length >= 15 &&
      password.value.length <= 30
    );
  } else {
    return (
      Account.value.length >= 6 &&
      Account.value.length <= 30 &&
      password.value.length >= 8 &&
      password.value.length <= 30
    );
  }
};

// 登录函数
async function try_login() {
  if (!validateForm()) {
    alert("账号或密码长度不符合要求");
    return;
  }

  let data = new FormData();
  data.append("account", Account.value);
  data.append("password", password.value);
  data.append("identity", identity.value); // 添加身份参数

  try {
    const apiPath =
      identity.value === "admin"
        ? "/admin/login"
        : "/merchant/login";
    const response = await instance.post(apiPath, data);


    if (response.status === 200) {
      if (response.data.msg === "ok") {
        console.log("登录成功");
        if (identity.value === "admin") {
          router.push("/admin_Home");
        } else if (identity.value === "merchant") {
          router.push("/merchant_Home");
        }
      } else {
        console.log("登录失败");
        alert(response.data.msg);
      }
    } else {
      console.log("响应错误");
      alert(response.data.msg);
    }
  } catch (error) {
    alert(error.message);
  }
}
</script>

<template>
  <div class="container">
    <div class="screen">
      <div class="screen__content">
        <form class="login">
          <h3 class="login_header">管理员登录</h3>

          <div class="login__field">
            <IftaLabel>
              <i class="pi pi-user icon"></i>
              <InputText id="Account" class="login__input" v-model="Account" />
              <label for="Account">Account</label>
            </IftaLabel>
          </div>
          <div class="login__field">
            <IftaLabel>
              <i class="pi pi-lock icon"></i>
              <InputText
                id="Password"
                type="password"
                class="login__input"
                v-model="password"
                toggleMask
              />
              <label for="Password">Password</label>
            </IftaLabel>
          </div>

          <div class="radio-group">
            <div class="radio-item">
              <RadioButton
                id="admin"
                v-model="identity"
                value="admin"
                class="custom-radio"
                variant="filled"
              />
              <label for="admin" class="radio-label">Administrator</label>
            </div>
            <div class="radio-item">
              <RadioButton
                id="merchant"
                v-model="identity"
                value="merchant"
                class="custom-radio"
                variant="filled"
              />
              <label for="merchant" class="radio-label">Merchant</label>
            </div>
          </div>

          <Button
            class="button login__submit"
            @click="try_login"
            :disabled="!validateForm"
          >
            <span class="button__text">登录</span>
          </Button>
        </form>
      </div>

      <div class="screen__background">
        <span
          class="screen__background__shape screen__background__shape4"
        ></span>
        <span
          class="screen__background__shape screen__background__shape3"
        ></span>
        <span
          class="screen__background__shape screen__background__shape2"
        ></span>
        <span
          class="screen__background__shape screen__background__shape1"
        ></span>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "../assets/login.css";
</style>
