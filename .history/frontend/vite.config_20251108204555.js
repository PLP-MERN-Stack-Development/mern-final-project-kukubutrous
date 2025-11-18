import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    cors: true,
  },
});

export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brandGreen: '#22c55e',
        brandPink: '#ff4da6'
      }
    }
  },
  plugins: []
}