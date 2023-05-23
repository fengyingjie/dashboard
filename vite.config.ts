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
      "^/getDataAPI": {
        target: "http://127.0.0.1:5500/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/getDataAPI/, '')
      },
    },
  },
})
