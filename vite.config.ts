import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// El frontend llama al backend directamente con VITE_API_BASE_URL (ver .env.example).
export default defineConfig({
  plugins: [react()],
  server: { port: 5173 },
});
