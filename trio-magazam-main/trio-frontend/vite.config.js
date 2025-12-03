import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [
    tailwindcss(),
    react()
  ],

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },

  base: '/',

  build: {
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        assetFileNames: 'assets/[name]-[hash][extname]'
      }
    }
  },

  publicDir: 'public',

  server: {
    port: 3001,
    open: true,

    // 🔥 Buraya sənin göndərdiyin PROXY-ni əlavə etdim
    proxy: {
      '/api': {
        target: 'http://localhost:3010/',
        changeOrigin: true
      },
      '/crud': {
        target: 'http://localhost:3010/',
        changeOrigin: true
      }
    }
  }
})
