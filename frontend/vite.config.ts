import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Vi tillader de lokale domæner, vi bruger til test
    allowedHosts: [
      'returnwiz.local',
      'app.returnwiz.local',
      'myshop.returnwiz.local'
    ]
  }
})