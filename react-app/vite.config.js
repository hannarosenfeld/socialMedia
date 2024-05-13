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
    port: 3333,
    strictPort: true,
    cors: true,
    proxy: {
      "/api/": {
      target: "http://127.0.0.1:5000/api/",
      changeOrigin: true,
      secure: false,
      rewrite: (path) => path.replace(/^\/api/, ""),
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
}});
