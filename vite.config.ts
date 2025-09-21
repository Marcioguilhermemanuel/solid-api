import { defineConfig } from 'vitest/config'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig({
    plugins: [tsconfigPaths()],
    resolve: {
        alias: {
            '@': '/src',
            '@lib': '/src/lib'
        }
    }
})