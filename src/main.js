import { createApp } from "vue";
import App from './App.vue'

import Aura from '@primevue/themes/aura';
import PrimeVue from "primevue/config";

import 'primeicons/primeicons.css';
import router from './router/router'


createApp(App).use(PrimeVue, {theme: {preset: Aura}})
              .use(router)
              .mount('#app');
