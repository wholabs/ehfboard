import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['@tldraw/tldraw', '@tldraw/state', '@tldraw/utils', '@tldraw/tlschema', '@tldraw/editor', '@tldraw/store', '@tldraw/validate'],
  },
  build: {
    commonjsOptions: {
      include: [/@tldraw/, /node_modules/],
    },
  },
})
