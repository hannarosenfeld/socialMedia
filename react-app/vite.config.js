import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from "tailwindcss";


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), ],
  esbuild: {
    jsxInject: `import React from 'react'`,
  },
  server: {
    host: true,
    // port: 5000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': '/src', // Set up an alias for easier imports
    },
    css: {
      postcss: {
        plugins: [tailwindcss()],
      },
    },
    },
});
