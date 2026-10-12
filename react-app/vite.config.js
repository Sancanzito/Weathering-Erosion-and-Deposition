import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Offline version (npm run dev:offline): served from the root on a fixed port.
  // Default / build: GitHub Pages serves the project site under
  // /Weathering-Erosion-and-Deposition/
  if (mode === 'offline') {
    return {
      plugins: [react()],
      server: {
        port: 5173,
        strictPort: true, // Forces Vite to stay on port 5173 instead of incrementing
      },
    }
  }
  return {
    plugins: [react()],
    base: '/Weathering-Erosion-and-Deposition/',
  }
})
