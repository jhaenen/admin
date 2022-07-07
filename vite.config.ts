import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { resolve } from 'path'

function resolveDir(relativePath: string) {
  return resolve(__dirname, relativePath);
}

// https://vitejs.dev/config/
export default defineConfig(({command, mode}) => {
  return {
    build: {
      rollupOptions: {
        input: {
          main: resolveDir('index.html'),
          'login.html': resolveDir('login.html'),
        },
      }
    },
    plugins: [svelte()],
    resolve: {
      alias: {
        '@': resolveDir('./src'),
      },
    },
    base: (command === 'build') ? '/admin/html/' : '/',
  }
})

