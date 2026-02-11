import { defineConfig } from 'vite'
import preact from '@preact/preset-vite'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: '/sukima/',
  plugins: [
    preact(),
    tailwindcss(),
  ],
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: './src/test-setup.js',
    css: false,
    pool: 'threads',
  },
})
