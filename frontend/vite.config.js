import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ command }) => {
    return {
        plugins: [react()],
        base: command === 'build' ? '/static/' : '/',
        build: {
            outDir: path.resolve(__dirname, '../backend/frontend_build'),
            emptyOutDir: true,
        },
        server: {
            port: 5173,
            proxy: {
                '/api': {
                    target: 'http://localhost:8000',
                    changeOrigin: true,
                }
            }
        }
    }
})
