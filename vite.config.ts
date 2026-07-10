import { resolve } from 'node:path'
import { defineConfig } from 'vite'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: format => format === 'es' ? 'index.js' : 'index.cjs',
    },
    rollupOptions: {
      external: [],
    },
    sourcemap: true,
    target: 'esnext',
    outDir: 'lib',
    emptyOutDir: true,
  },
})
