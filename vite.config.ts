import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue()
  ],
  define:{'process.env':{}},
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
      "/pass": {
        target: "http://10.167.23.81:9900/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/pass/, '')
      },
      "^/sap": {
        target: "https://cipec.unity.fujitsu.com.au:44332/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/sap/, '')
      },
      "^/fxshome": {
        target: "http://www.fxs.cn.fujitsu.com/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/fxshome/, '')
      },
      "^/hopeRedmine": { 
        target: "http://164.69.117.197/tidd/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/hopeRedmine/, '') 
      }
    },
  },
})
