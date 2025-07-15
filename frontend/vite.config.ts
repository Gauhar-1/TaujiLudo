import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  "base": "/",
  server: {
    host: "0.0.0.0",         // ✅ Listen on all IPs (LAN access)
    port: 5173,              // ✅ Use the same port
  },
})
