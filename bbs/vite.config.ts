/// <reference types="node" />
import react from '@vitejs/plugin-react'
import { visualizer } from 'rollup-plugin-visualizer'
import { URL, fileURLToPath } from 'url'
import { defineConfig } from 'vite'
import viteCompression from 'vite-plugin-compression'

const staticProxies = {}

if (process.env['UESTC_BBS_IMGPROXY_SERVER']) {
  staticProxies['/thumb'] = {
    target: process.env['UESTC_BBS_IMGPROXY_SERVER'],
    rewrite: (path) => path.replace(/^\/thumb/, ''),
  }
}
if (process.env['UESTC_BBS_DATA_SERVER']) {
  staticProxies['/data'] = {
    target: process.env['UESTC_BBS_DATA_SERVER'],
    changeOrigin: true,
  }
}
if (process.env['UESTC_BBS_STAGING']) {
  staticProxies['/dev'] = {
    target: 'https://bbs.uestc.edu.cn/',
    changeOrigin: true,
    rewrite: (path) => path.replace(/^\/dev\/star/, '_star'),
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: (id) => {
          if (
            id.includes('commonjsHelpers.js') ||
            id.includes('node_modules/react/') ||
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/react-router') ||
            id.includes('node_modules/@remix-run')
          ) {
            return 'vendor-react'
          }
          if (id.includes('node_modules/@mui/')) {
            return 'vendor-mui'
          }
        },
      },
    },
  },
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
    viteCompression(),
    visualizer(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 7564,
    proxy: {
      '/dev': {
        target:
          process.env['UESTC_BBS_BACKEND_SERVER'] ||
          'http://222.197.183.89:65342',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/dev/, ''),
      },
      ...staticProxies,
    },
  },
})
