<script setup lang="ts">
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import { ref } from "vue";
import instance from "../../../http.js";
import router from "../../../router/router.js";

let visible = ref(false);

const pwdModel = ref({
  new_pwd: "",
  con_pwd: "",
});

async function logout() {
  const response = await instance.post(`merchant/logout`);
  if (response.status === 200) {
    if (response.data.msg === "ok") {
      router.push("/login");
    } else {
      alert(response.data.msg);
    }
  } else {
    alert(response.data.msg);
  }
}

async function change_pwd() {
  if (pwdModel.value.new_pwd.length > 30 || pwdModel.value.new_pwd.length < 8) {
    alert("密码长度错误");
    return;
  }

  if (pwdModel.value.new_pwd != pwdModel.value.con_pwd)
    alert("两次密码输入不一致，请重新输入");
  else {
    let data = new FormData();
    data.append("password", pwdModel.value.new_pwd);

    try {
      const response = await instance.put("/merchant/change-password", data);
      if (response.status === 200) {
        if (response.data.msg === "ok") {
          alert("修改密码成功");
          router.push("/login");
        } else {
          alert(response.data.msg);
        }
      } else {
        alert(response.data.msg);
      }
    } catch (error) {
      alert(error.message);
    }
  }
}
</script>

<template>
  <div class="centered-button-container">
    <Button label="Change Password" icon="pi pi-user" @click="visible = true" />
    <Button label="Logout" icon="pi pi-ban" @click="logout" />
  </div>

  <Dialog v-model:visible="visible" class="custom-dialog">
    <template #container="{ closeCallback }">
      <div class="dialog-container">
        <div class="input-group">
          <label for="new_pwd" class="label">New Password</label>
          <InputText
            id="new_pwd"
            type="password"
            class="input-text"
            v-model="pwdModel.new_pwd"
          />
        </div>
        <div class="input-group">
          <label for="con_pwd" class="label">Confirm New Password</label>
          <InputText
            id="con_pwd"
            type="password"
            class="input-text"
            v-model="pwdModel.con_pwd"
          />
        </div>
        <div class="button-group">
          <Button
            label="Cancel"
            @click="closeCallback"
            class="button cancel-button"
          />
          <Button
            label="Submit"
            @click="change_pwd"
            class="button sign-in-button"
          />
        </div>
      </div>
    </template>
  </Dialog>
</template>

<style scoped>
/* Centered button container */
.centered-button-container {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 2rem;
}

/* Existing dialog styles */
.content {
  margin: 10px;
  display: inline-block;
}

.custom-dialog .p-dialog-content {
  border: none;
  background-color: rgba(0, 0, 0, 0.8); /* 半透明黑色背景 */
}
.custom-dialog .p-dialog-mask {
  backdrop-filter: blur(4px);
}

/* Dialog 容器样式 */
.dialog-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  padding: 2rem;
  border-radius: 1rem;
  background-image: linear-gradient(90deg, #c7c5f4, #776bcc);
}

/* 输入框组样式 */
.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* 标签样式 */
.label {
  color: #e0e0e0; /* 浅灰色文本 */
  font-weight: 600;
}

/* 输入框样式 */
.input-text {
  background-color: rgba(255, 255, 255, 0.2); /* 浅色半透明背景 */
  border: none;
  padding: 1rem;
  color: #e0e0e0; /* 浅灰色文本 */
  width: 20rem;
}

/* 按钮组样式 */
.button-group {
  display: flex;
  gap: 1rem;
}

/* 通用按钮样式 */
.button {
  padding: 1rem;
  width: 100%;
  color: #e0e0e0; /* 浅灰色文本 */
  border: 1px solid rgba(255, 255, 255, 0.3); /* 浅色边框 */
  transition: background-color 0.3s ease;
}

/* 按钮悬停效果 */
.button:hover {
  background-color: rgba(255, 255, 255, 0.1); /* 浅色半透明悬停背景 */
}

/* 特定按钮样式 */
.cancel-button {
  color: #776bcc; /* 浅灰色文本 */
  background-color: #ffffff;
}
.sign-in-button {
  color: #776bcc; /* 浅灰色文本 */
  background-color: #ffffff;
}
</style>
