import { createApp } from "vue";
import App from './App.vue';

import Aura from '@primevue/themes/aura';
import PrimeVue from "primevue/config";

import 'primeicons/primeicons.css';
import ToastService from "primevue/toastservice"; // 引入 ToastService
import router from './router/router';


createApp(App).use(PrimeVue, { theme: { preset: Aura } })
    .use(router)
    .use(ToastService)
    .mount('#app');
