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

// https://vitejs.dev/config/
export default defineConfig({
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
