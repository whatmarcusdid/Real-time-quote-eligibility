import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Build-time base path. For GitHub Pages under /Real-time-quote-eligibility/:
//   BASE_PATH=/Real-time-quote-eligibility/ npm run build
export default defineConfig({
  base: process.env.BASE_PATH ?? '/',
  plugins: [react(), tailwindcss()],
})
