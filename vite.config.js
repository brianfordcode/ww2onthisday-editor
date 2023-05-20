// vite.config.js

import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

const path = require("path")

// https://vitejs.dev/config/

const config = defineConfig({

  plugins: [vue()],
  resolve: {
    extensions: [
        ".mjs",
        ".js",
        ".ts",
        ".jsx",
        ".tsx",
        ".json",
        ".vue",
        ".scss"
      ],
    alias: {
        "@": path.resolve(__dirname, "./src")
    },
  },
})

export default config

