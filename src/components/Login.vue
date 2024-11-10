<script setup lang="ts">
import IftaLabel from 'primevue/iftalabel';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import router from '../router/router';
import instance from '../http.js';
import {ref} from 'vue'

const Account=ref("");
const password=ref("");
async function try_login(){

    if(Account.value.length > 30 || Account.value.length<10){
        alert("账号长度错误");
        return;
    }
    if(password.value.length > 30 || password.value.length<15){
        alert("密码长度错误");
        return;
    }

    let data = new FormData();
    data.append('account',Account.value);
    data.append('password',password.value);
    try {
        const response = await instance.post(`/admin/login`, data);
        if (response.status === 200) {
            if(response.data.msg === "ok"){
                console.log("login success");
                router.push('/Home');
            }else{
                console.log("login failed");
                alert(response.data.msg);
            }
        } else {
            console.log("response.status!=200");
            alert(response.data.msg);
        }
    } catch (error) {alert(error.message);}
}
</script>

<template>
    <div class="container">
        <div class="screen">
            <div class="screen__content">
                <form class="login">
                    <h3 class="login_header">Admin Panel</h3>
                    
                    <div class="login__field">
                        <IftaLabel>
                            <i class="pi pi-user icon"></i>
                            <InputText id="Account" class="login__input" v-model="Account"/>
                            <label for="Account">Account</label>
                        </IftaLabel>
                    </div>
                    <div class="login__field">
                        <IftaLabel>
                            <i class="pi pi-lock icon"></i>
                            <InputText id="Password" type="password" class="login__input" v-model="password" toggleMask/>
                            <label for="Password">Password</label>
                        </IftaLabel>
                    </div>
                    <Button class="button login__submit" @click="try_login">
                        <span class="button__text">Log In Now</span>
                    </Button>
                </form>
            </div>
            <div class="screen__background">
                <span class="screen__background__shape screen__background__shape4"></span>
                <span class="screen__background__shape screen__background__shape3"></span>		
                <span class="screen__background__shape screen__background__shape2"></span>
                <span class="screen__background__shape screen__background__shape1"></span>
            </div>		
        </div>
    </div>
</template>

<style scoped>
    @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;500;600&display=swap');

    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;	
        /*TODO:下面的字体放开会导致icon不显示 */
        /* font-family:  "Poppins",sans-serif;  */
    }

    .container {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 100vh;
        overflow: hidden;
        background: linear-gradient(90deg, #C7C5F4, #776BCC);
    }

    .screen {
        background: linear-gradient(90deg, #5D54A4, #7C78B8);		
        position: relative;	
        height: 600px;
        width: 360px;	
        box-shadow: 0px 0px 24px #5C5696;
    }

    .screen__content {
        z-index: 1;
        position: relative;	
        height: 100%;
    }

    .login_header{
        font-size: 30px;
        color: #6C63AC;
    }

    .screen__background {		
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 0;
        -webkit-clip-path: inset(0 0 0 0);
        clip-path: inset(0 0 0 0);
    }

    .screen__background__shape {
        transform: rotate(45deg);
        position: absolute;
    }

    .screen__background__shape1 {
        height: 520px;
        width: 520px;
        background: #FFF;	
        top: -50px;
        right: 120px;	
        border-radius: 0 72px 0 0;
    }

    .screen__background__shape2 {
        height: 220px;
        width: 220px;
        background: #6C63AC;	
        top: -172px;
        right: 0;	
        border-radius: 32px;
    }

    .screen__background__shape3 {
        height: 540px;
        width: 190px;
        background: linear-gradient(270deg, #5D54A4, #6A679E);
        top: -24px;
        right: 0;	
        border-radius: 32px;
    }

    .screen__background__shape4 {
        height: 400px;
        width: 200px;
        background: #7E7BB9;	
        top: 420px;
        right: 50px;	
        border-radius: 60px;
    }

    .icon{
        font-size: 20px;
        color: #6A679E;
        padding-right: 10px;
        transform: translateY(40%);
    }

    .login {
        width: 320px;
        padding: 30px;
        padding-top: 156px;
    }

    .login__field {
        font-size: 16px;
        font-weight: bold;
        padding: 20px 0px;	
        position: relative;
    }

    .login__input {
        border: none;
        border-bottom: 2px solid #D1D1D4;
        background: none;
        padding: 10px;
        padding-left: 10px;
        font-weight: 700;
        width: 75%;
        transition: .2s;
        color: #696969;
    }

    .login__input:active,
    .login__input:focus,
    .login__input:hover {
        outline: none;
        border-bottom-color: #6A679E;
    }

    .login__submit {
        background: #fff;
        font-size: 14px;
        margin-top: 30px;
        padding: 16px 20px;
        border-radius: 26px;
        border: 1px solid #D4D3E8;
        text-transform: uppercase;
        font-weight: 700;
        display: flex;
        align-items: center;
        width: 100%;
        color: #4C489D;
        box-shadow: 0px 2px 2px #5C5696;
        cursor: pointer;
        transition: .2s;
    }

    .login__submit:active,
    .login__submit:focus,
    .login__submit:hover {
        border-color: #6A679E;
        outline: none;
    }

    .button__icon {
        font-size: 24px;
        margin-left: auto;
        color: #7875B5;
    }
</style>