import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  root: './',  // Ensure this is set to the project root
  build: {
    rollupOptions: {
      input: './public/index.html', // Point to the HTML entry file in the public folder
    },
  },
});
