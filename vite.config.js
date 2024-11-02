import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite';
import {PrimeVueResolver} from '@primevue/auto-import-resolver';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: "0.0.0.0",
    watch: {
      usePolling: true,
    },
  },
  plugins: [
    vue(),
    Components({
      resolvers: [
        PrimeVueResolver()
      ]
    })]
})