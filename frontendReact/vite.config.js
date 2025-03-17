import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['c601-2601-647-4b00-eb00-3c31-561d-af62-b1c0.ngrok-free.app'], // Allow this host
  },
})