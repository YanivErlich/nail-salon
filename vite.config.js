import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['perky-deviancy-endeared.ngrok-free.dev'],
  },
})
