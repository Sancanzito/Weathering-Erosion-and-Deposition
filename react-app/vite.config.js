import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // GitHub Pages serves the project site under /Weathering-Erosion-and-Deposition/
  base: '/Weathering-Erosion-and-Deposition/',
})
