/// <reference types="vite/client" />


// src/vite-env.d.ts - Environment variable type definitions

interface ImportMetaEnv {
  // API Configuration
  readonly VITE_API_URL: string
  
  // SignalWire Configuration
  readonly VITE_SIGNALWIRE_PROJECT_ID: string
  readonly VITE_SIGNALWIRE_SPACE_URL: string
  readonly VITE_SIGNALWIRE_PUBLIC_KEY: string
  
  // Stripe Configuration
  readonly VITE_STRIPE_PUBLIC_KEY: string
  
  // App Configuration
  readonly VITE_APP_NAME: string
  readonly VITE_APP_VERSION: string
  readonly VITE_APP_ENVIRONMENT: string
  
  // Feature Flags
  readonly VITE_ENABLE_ANALYTICS: string
  readonly VITE_ENABLE_BILLING: string
  readonly VITE_ENABLE_DEBUG: string
  
  // WebSocket Configuration
  readonly VITE_WS_URL: string
  
  // Vite built-in variables
  readonly MODE: string
  readonly BASE_URL: string
  readonly PROD: boolean
  readonly DEV: boolean
  readonly SSR: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// Global type augmentations
declare global {
  const __APP_VERSION__: string
  const __BUILD_TIME__: string
}