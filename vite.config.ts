import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
// @ts-expect-error Vite plugin is plain ESM without types
import { contentApiPlugin } from './plugins/contentApiPlugin.mjs'

export default defineConfig({
  plugins: [react(), tailwindcss(), contentApiPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@data': path.resolve(__dirname, './data'),
    },
  },
  server: {
    fs: {
      allow: ['.'],
    },
  },
})
