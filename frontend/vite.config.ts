import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import path from 'path';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({tsDecorators: true})],
  resolve: {
    alias: {
       '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    host: '0.0.0.0', // Слушать на всех доступных IP
    port: 8083, // Порт, на котором будет запущен сервер
  },
})
