import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from "tailwindcss";


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), ],
  esbuild: {
    jsxInject: `import React from 'react'`,
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
