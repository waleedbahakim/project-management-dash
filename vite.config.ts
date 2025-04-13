import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-components': ['@headlessui/react', '@heroicons/react', 'framer-motion'],
          'three-vendor': ['three', '@react-three/fiber', '@react-three/drei'],
          'state-utils': ['zustand', 'clsx', 'date-fns', 'uuid'],
        },
      },
    },
  },
})
