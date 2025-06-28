import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig(({ command, mode }) => {
  const isProduction = mode === 'production'
  
  return {
    plugins: [react()],
    
build: {
      outDir: 'dist',
      sourcemap: false,
      minify: false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            router: ['react-router-dom'],
            icons: ['lucide-react'],
          }
        }
      },
      terserOptions: {
        compress: {
          drop_console: isProduction,
          drop_debugger: isProduction,
        },
      },
    },
    
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
        '@components': path.resolve(__dirname, './src/components'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@hooks': path.resolve(__dirname, './src/hooks'),
        '@services': path.resolve(__dirname, './src/services'),
        '@api': path.resolve(__dirname, './src/api'),
        '@types': path.resolve(__dirname, './src/types'),
      }
    },
    
    server: {
      port: 3000,
      host: true,
      proxy: isProduction ? undefined : {
        '/api': {
          target: 'https://backend.assitext.ca',
          changeOrigin: true,
          secure: true,
        }
      }
    },
    
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0'),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    },
    
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react-router-dom',
        'lucide-react'
      ]
    }
  }
})