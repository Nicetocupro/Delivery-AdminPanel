<script setup lang="ts">
import IftaLabel from 'primevue/iftalabel';
import InputText from 'primevue/inputtext';
import RadioButton from 'primevue/radiobutton';
import router from '../router/router';
import instance from '../http.js';
import {ref} from 'vue'

const Account=ref("");
const password=ref("");

let identity=ref("");

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
    if(identity.value == "admin")
    {
        try {
            const response = await instance.post(`/admin/login`, data);
            if (response.status === 200) {
                if(response.data.msg === "ok"){
                    console.log("login success");
                    router.push('/admin_home');
                }else{
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
                    <div class="radio-group">
                        <div class="radio-item">
                            <RadioButton id="admin" v-model="identity" value="admin" class="custom-radio" variant="filled"/>
                            <label for="admin" class="radio-label">Administrator</label>
                        </div>
                        <div class="radio-item">
                            <RadioButton id="merchant" v-model="identity" value="merchant" class="custom-radio" variant="filled"/>
                            <label for="merchant" class="radio-label">Merchant</label>
                        </div>
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
   @import '../assets/login.css';
</style>