import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 5137,
    proxy: {
      "/member": "http://localhost:8080",
      "/oauth2": "http://localhost:8080",
      "/rest_login": "http://localhost:8080",
      "/profile": "http://localhost:8080"
    }
  },
})
