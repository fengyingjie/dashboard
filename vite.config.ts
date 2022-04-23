import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue()
  ],
  server: {
    host: '0.0.0.0',
    proxy: {
      "^/mockapi": {
        target: "http://10.32.38.100:3000/",
        changeOrigin: true,
      },
      "/redmineapi": {
        target: "https://www.redmine.org/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/redmineapi/, '')
      },
      "/counter": {
        target: "http://localhost:8080/counter",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/counter/, '')
      },
    },
  },
})
