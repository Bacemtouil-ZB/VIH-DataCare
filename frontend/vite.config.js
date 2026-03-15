import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',  // Permet l'accès depuis l'extérieur du conteneur Docker
    port: 5173,        // Assure-toi que c'est le bon port
  },
})