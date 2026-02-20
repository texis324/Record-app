import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // スマホ等外部デバイスからのアクセスを許可
    port: 5173,
    allowedHosts: ['80addbfaa8d9e9.lhr.life']
  }
})
