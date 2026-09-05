import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

type ProcessEnv = Record<string, string | undefined>

const environment = (globalThis as typeof globalThis & { process?: { env?: ProcessEnv } }).process?.env ?? {}
const isVercel = environment.VERCEL === '1' || environment.VERCEL === 'true'
const isGitHubActions = environment.GITHUB_ACTIONS === 'true'

export default defineConfig({
  // Vercel serves the app from the domain root, while GitHub Pages serves it
  // from the repository subdirectory. Relative paths keep local development
  // portable without changing the public document and asset content.
  base: isVercel ? '/' : isGitHubActions ? '/ers-motion-web/' : './',
  plugins: [react()],
  server: { port: 5600 },
})
