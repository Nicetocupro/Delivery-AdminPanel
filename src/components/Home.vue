<script setup lang="ts">
    import Menu from 'primevue/menu'
    import {ref} from 'vue'
    import instance from '../http.js';
    import router from '../router/router.js'
    import Button from 'primevue/button';
    import Dialog from 'primevue/dialog';


    let visible = ref(false);

    const items=ref([
        {label:'Home',icon:'pi pi-home'},
        {label:'Personal', icon:'pi pi-user'},
        {label:'Contact',icon:'pi pi-envelope'},
        {label:'About',icon:'pi pi-info-circle'},
        {label:'Contact',icon:'pi pi-envelope'},
    ])

    async function logout(){
        try {
            const response = await instance.post(`/admin/logout`);
            if (response.data.code === 200) {
                if(response.data.msg === "ok"){
                    ;
                }else{
                    alert(response.data.msg);
                }
            } else {
                alert(response.data.msg);
            }
        } catch (error) {alert(error.message);}
        router.push('/');
    }

    const pwdModel = ref({
        new_pwd: '',
        con_pwd: ''
    })

    async function change_pwd(){
        if(pwdModel.value.new_pwd != pwdModel.value.con_pwd)
            alert("两次密码输入不一致，请重新输入");
        else
        {
            let data = new FormData();
            data.append("password", pwdModel.value.new_pwd);

            try{
                const response = await instance.put('/api/v1/admin/jwt/change-password', data);
                if (response.data.code === 200) {
                    if(response.data.msg === "ok"){
                        alert("修改密码成功");
                        router.push('/');
                    }
                    else{
                        alert(response.data.msg);
                    }
                } else {
                    alert(response.data.msg);
                }
            } catch (error) {alert(error.message);}
        }
    }
</script>

<template>
    <div class="layout_sidebar">
        <Menu :model="items" class="w-full"></Menu>
    </div>

    
    <div class="content">
        <Button class="button login__submit" @click="logout">
            <span class="button__text">Logout</span>
        </Button>
    </div>

    <Button label="Change Password" icon="pi pi-user" @click="visible = true"/>
    <Dialog v-model:visible="visible" class="custom-dialog">
        <template #container="{ closeCallback }">
            <div class="dialog-container">
                <div class="input-group">
                    <label for="new_pwd" class="label">New Password</label>
                    <InputText id="new_pwd" type="password" class="input-text" v-model="pwdModel.new_pwd"/>
                </div>
                <div class="input-group">
                    <label for="con_pwd" class="label">Confirm New Password</label>
                    <InputText id="con_pwd" type="password" class="input-text" v-model="pwdModel.con_pwd"/>
                </div>
                <div class="button-group">
                    <Button label="Cancel" @click="closeCallback" class="button cancel-button" />
                    <Button label="Submit" @click="change_pwd" class="button sign-in-button" />
                </div>
            </div>
        </template>
    </Dialog>
</template>



<style scoped>
    .layout_sidebar{
        display:inline-block;
        height:100%;
        width:18rem;
        margin:10px;
    }
    .content{
        margin:10px;
        display:inline-block;
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
        background-image: linear-gradient(90deg, #C7C5F4, #776BCC);;
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
        color: #776BCC; /* 浅灰色文本 */
        background-color: #ffffff;
    }
    .sign-in-button {
        color: #776BCC; /* 浅灰色文本 */
        background-color: #ffffff;
    }
</style>