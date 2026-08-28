import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  // Relative assets make the same build work locally and under
  // https://owlcoder.github.io/ers-motion-web/ without hard-coded host paths.
  base: './',
  plugins: [react()],
  server: { port: 5600 },
})
