import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'

import { tanstackStart } from '@tanstack/react-start/plugin/vite'

import viteReact from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { cloudflare } from '@cloudflare/vite-plugin'

export default defineConfig(({ command }) => ({
  resolve: { tsconfigPaths: true },
  plugins: [
    devtools(),
    // Cloudflare plugin only needed for local dev (emulates Workers runtime)
    ...(command === 'serve' ? [cloudflare({ viteEnvironment: { name: 'ssr' } })] : []),
    tailwindcss(),
    tanstackStart({
      // Use Vercel preset for production builds, Cloudflare for local dev
      ...(command === 'build' ? { server: { preset: 'vercel' } } : {}),
    }),
    viteReact(),
  ],
}))
