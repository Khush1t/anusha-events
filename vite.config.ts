import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Served from https://khush1t.github.io/anusha-events/
export default defineConfig({ base: '/anusha-events/', plugins: [react()] })
