import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from "@tailwindcss/vite";
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // <-- this maps @/ to src/
    },
  },
  server: {
    proxy: {
      '/api': {
        target:
          'https://wpl3zc6bcpsz4goscnvcz62ipm0pwsxf.lambda-url.us-east-1.on.aws',
        changeOrigin: true,
      },
    },
  },
});
