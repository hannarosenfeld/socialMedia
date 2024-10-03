import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  plugins: [
    react(),
  ],
  css: {
    postcss: {
      plugins: [tailwindcss(), autoprefixer()],
    },
  },
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
  },
  resolve: {
    alias: {
      '@': '/src', // Set up an alias for easier imports
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'; // Creates a separate vendor chunk for dependencies
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Adjust the chunk size limit if necessary
  },
});
