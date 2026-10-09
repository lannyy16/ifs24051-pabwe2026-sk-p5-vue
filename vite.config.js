
import { loadEnv } from 'vite'
import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

// Konfigurasi Vite + Tailwind CSS v4 + Vitest (coverage v8, threshold 100%)
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const port = Number(env.APP_PORT) || 5173

  return {
    plugins: [vue(), tailwindcss()],
    build: { sourcemap: true },
    server: { port },
    preview: { port },
    define: {
      DELCOM_BASEURL: JSON.stringify(
        env.VITE_DELCOM_BASEURL || 'https://open-api.delcom.org/api/v1',
      ),
    },
    test: {
      environment: 'jsdom',
      globals: true,
      css: false,
      setupFiles: ['./src/setupTests.js'],
      include: ['src/**/*.test.js'],
      coverage: {
        provider: 'v8',
        include: ['src/**/*.{js,vue}'],
        exclude: [
          'src/main.js',
          'src/setupTests.js',
          'src/test-utils.js',
          'src/**/*.test.js',
        ],
        reporter: ['text', 'html', 'lcov'],
        reportsDirectory: './coverage',
        thresholds: {
          lines: 100,
          functions: 100,
          branches: 100,
          statements: 100,
        },
      },
    },
  }
})