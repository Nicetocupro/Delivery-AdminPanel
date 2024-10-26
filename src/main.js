import { createApp } from "vue";
import PrimeVue from "primevue/config";
import App from './components/Login.vue'

import Aura from '@primevue/themes/aura';

import 'primeicons/primeicons.css';

const app = createApp(App);

app.use(PrimeVue, {
    theme: {
        preset: Aura
    }
});

app.mount('#app');
