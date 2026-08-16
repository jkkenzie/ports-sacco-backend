import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

function parseEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {}
  }
  const out = {}
  for (const line of fs.readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) {
      continue
    }
    const eq = trimmed.indexOf('=')
    if (eq === -1) {
      continue
    }
    const key = trimmed.slice(0, eq).trim()
    let val = trimmed.slice(eq + 1).trim()
    if (
      (val.startsWith("'") && val.endsWith("'")) ||
      (val.startsWith('"') && val.endsWith('"'))
    ) {
      val = val.slice(1, -1)
    } else {
      val = val.replace(/\s*#.*$/, '').trim()
    }
    out[key] = val
  }
  return out
}

function resolveViteEnv(mode) {
  const local = loadEnv(mode, __dirname, '')
  const rootEnv = parseEnvFile(path.resolve(__dirname, '../../.env'))
  const webEnv = parseEnvFile(path.resolve(__dirname, '../.env'))

  const wpHomeRaw =
    local.VITE_WP_HOME || rootEnv.WP_HOME || webEnv.WP_HOME || local.WP_HOME || ''
  const wpHome = wpHomeRaw.replace(/\/$/, '')

  const appBase = local.VITE_BASE_PATH || '/'
  const normalizedBase = appBase === '/' ? '/' : `/${appBase.replace(/^\/+|\/+$/g, '')}/`

  return {
    VITE_BASE_PATH: normalizedBase,
    VITE_WP_HOME: wpHome,
    VITE_PUBLIC_URL:
      local.VITE_PUBLIC_URL || (wpHome ? `${wpHome}${normalizedBase === '/' ? '' : normalizedBase.replace(/\/$/, '')}` : ''),
    VITE_WP_API_BASE: local.VITE_WP_API_BASE || '',
    VITE_WP_FRESH_API: local.VITE_WP_FRESH_API || '',
    VITE_WP_REST_PATH: local.VITE_WP_REST_PATH || '/wp-json/chat/v1',
    VITE_WHATSAPP_NUMBER: local.VITE_WHATSAPP_NUMBER || '',
  }
}

function viteEnvDefine(viteEnv) {
  const define = {}
  for (const [key, value] of Object.entries(viteEnv)) {
    define[`import.meta.env.${key}`] = JSON.stringify(value)
  }
  return define
}

export default defineConfig(({ mode }) => {
  const viteEnv = resolveViteEnv(mode)
  const wpProxyTarget = viteEnv.VITE_WP_HOME || 'http://ports-sacco'

  return {
    plugins: [react()],
    define: viteEnvDefine(viteEnv),
    base: viteEnv.VITE_BASE_PATH,
    build: {
      outDir: 'dist',
      assetsDir: 'assets',
      assetsInlineLimit: 0,
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('react-router') || id.includes('@remix-run/router')) {
                return 'vendor-router'
              }
              if (id.includes('react') || id.includes('scheduler')) {
                return 'vendor-react'
              }
              if (id.includes('lucide-react') || id.includes('react-icons')) {
                return 'vendor-icons'
              }
              if (id.includes('embla-carousel')) {
                return 'vendor-carousel'
              }
              return undefined
            }

            if (id.includes('onboardingFormSpec')) {
              return 'onboarding-form-spec'
            }

            if (id.includes('/components/ContactForm/')) {
              return 'contact-form'
            }

            if (id.includes('/blocks/ContactFormBlock')) {
              return 'contact-form-block'
            }

            return undefined
          },
        },
      },
    },
    server: {
      host: '0.0.0.0',
      port: 3000,
      open: true,
      proxy: {
        '/wp-json': {
          target: wpProxyTarget,
          changeOrigin: true,
        },
      },
    },
    preview: {
      host: '0.0.0.0',
      port: 4173,
      open: true,
      proxy: {
        '/wp-json': {
          target: wpProxyTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
