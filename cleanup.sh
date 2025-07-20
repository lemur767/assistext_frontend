#!/bin/bash

# Frontend Cleanup Master Script
# Comprehensive cleanup for React/TypeScript frontend

set -e

echo "🎨 Starting Frontend Cleanup..."
echo "================================"

# Check if we're in the frontend directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Please run this script from your frontend root directory"
    echo "   (the directory containing package.json)"
    exit 1
fi

# Create backup
BACKUP_DIR="frontend_backup_$(date +%Y%m%d_%H%M%S)"
echo "📦 Creating backup at $BACKUP_DIR..."
mkdir -p "$BACKUP_DIR"
cp -r . "$BACKUP_DIR/" 2>/dev/null || true
echo "✅ Backup created"

# Function to run cleanup steps
run_cleanup_step() {
    local step_name="$1"
    local step_function="$2"
    
    echo ""
    echo "🔧 $step_name"
    echo "$(printf '=%.0s' {1..50})"
    
    if $step_function; then
        echo "✅ $step_name completed"
    else
        echo "❌ $step_name failed"
        exit 1
    fi
}

# Step 1: Remove Profile-Based Architecture
cleanup_profile_architecture() {
    echo "🗑️  Removing profile-based components..."
    
    # Remove profile-specific files
    rm -f src/components/dashboard/NewProfileModal.tsx 2>/dev/null || true
    rm -f src/components/dashboard/ProfileSelector.tsx 2>/dev/null || true
    rm -f src/pages/ProfileManagement.tsx 2>/dev/null || true
    rm -f src/api/profiles.ts 2>/dev/null || true
    rm -f src/types/profile.ts 2>/dev/null || true
    rm -rf src/components/profile/ 2>/dev/null || true
    
    echo "✅ Profile components removed"
    return 0
}

# Step 2: Clean Node.js Dependencies
cleanup_dependencies() {
    echo "📦 Cleaning dependencies..."
    
    # Remove node_modules and lock files
    rm -rf node_modules/ 2>/dev/null || true
    rm -f package-lock.json 2>/dev/null || true
    rm -f yarn.lock 2>/dev/null || true
    rm -f pnpm-lock.yaml 2>/dev/null || true
    
    # Clean npm cache
    npm cache clean --force 2>/dev/null || true
    
    echo "✅ Dependencies cleaned"
    return 0
}

# Step 3: Remove Build Artifacts
cleanup_build_artifacts() {
    echo "🏗️  Cleaning build artifacts..."
    
    # Remove build directories
    rm -rf dist/ 2>/dev/null || true
    rm -rf build/ 2>/dev/null || true
    rm -rf .next/ 2>/dev/null || true
    rm -rf out/ 2>/dev/null || true
    
    # Remove TypeScript build info
    rm -f tsconfig.tsbuildinfo 2>/dev/null || true
    rm -rf node_modules/.tmp/ 2>/dev/null || true
    
    # Remove Vite cache
    rm -rf node_modules/.vite/ 2>/dev/null || true
    rm -rf .vite/ 2>/dev/null || true
    
    echo "✅ Build artifacts cleaned"
    return 0
}

# Step 4: Clean Cache and Temporary Files
cleanup_cache_files() {
    echo "🗑️  Cleaning cache and temporary files..."
    
    # Remove editor and OS files
    find . -name ".DS_Store" -delete 2>/dev/null || true
    find . -name "Thumbs.db" -delete 2>/dev/null || true
    find . -name "*.swp" -delete 2>/dev/null || true
    find . -name "*.swo" -delete 2>/dev/null || true
    find . -name "*~" -delete 2>/dev/null || true
    
    # Remove IDE files
    rm -rf .vscode/.history/ 2>/dev/null || true
    rm -rf .idea/ 2>/dev/null || true
    
    # Remove log files
    find . -name "*.log" -delete 2>/dev/null || true
    rm -rf logs/ 2>/dev/null || true
    
    echo "✅ Cache files cleaned"
    return 0
}

# Step 5: Check for Unused Dependencies
check_unused_dependencies() {
    echo "🔍 Checking for unused dependencies..."
    
    if command -v npx &> /dev/null; then
        # Install and check unused dependencies
        if npx depcheck --json > depcheck_results.json 2>/dev/null; then
            echo "📊 Dependency check completed - see depcheck_results.json"
        else
            echo "⚠️  Could not run depcheck - install with: npm install -g depcheck"
        fi
    else
        echo "⚠️  npx not available"
    fi
    
    return 0
}

# Step 6: Update Package.json Scripts
optimize_package_scripts() {
    echo "📝 Optimizing package.json scripts..."
    
    # Create optimized scripts using Node.js
    node -e "
    const fs = require('fs');
    const packagePath = './package.json';
    
    if (fs.existsSync(packagePath)) {
        const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        
        // Optimize scripts
        const optimizedScripts = {
            'dev': 'vite',
            'build': 'tsc && vite build',
            'build:prod': 'NODE_ENV=production tsc && vite build --mode production',
            'preview': 'vite preview',
            'type-check': 'tsc --noEmit',
            'lint': 'eslint src --ext ts,tsx --report-unused-disable-directives --max-warnings 0',
            'lint:fix': 'eslint src --ext ts,tsx --fix',
            'format': 'prettier --write \"src/**/*.{ts,tsx,js,jsx,json,css,md}\"',
            'format:check': 'prettier --check \"src/**/*.{ts,tsx,js,jsx,json,css,md}\"',
            'clean': 'rm -rf dist node_modules/.vite',
            'analyze': 'npm run build && npx vite-bundle-analyzer dist'
        };
        
        pkg.scripts = { ...pkg.scripts, ...optimizedScripts };
        
        fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2));
        console.log('✅ Package scripts optimized');
    } else {
        console.log('❌ package.json not found');
        process.exit(1);
    }
    " || return 1
    
    return 0
}

# Step 7: Create Optimized Vite Config
create_optimized_vite_config() {
    echo "⚙️  Creating optimized Vite configuration..."
    
    cat > vite.config.ts << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@pages': resolve(__dirname, './src/pages'),
      '@hooks': resolve(__dirname, './src/hooks'),
      '@services': resolve(__dirname, './src/services'),
      '@types': resolve(__dirname, './src/types'),
      '@utils': resolve(__dirname, './src/utils'),
    },
  },
  build: {
    target: 'es2020',
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query'],
          ui: ['lucide-react'],
          forms: ['react-hook-form'],
          utils: ['axios', 'jwt-decode'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
  server: {
    port: 5173,
    host: true,
    open: false,
  },
  preview: {
    port: 4173,
    host: true,
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
    ],
  },
})
EOF
    
    echo "✅ Vite config optimized"
    return 0
}

# Step 8: Update TypeScript Configuration
optimize_typescript_config() {
    echo "🔧 Optimizing TypeScript configuration..."
    
    cat > tsconfig.json << 'EOF'
{
  "files": [],
  "references": [
    {
      "path": "./tsconfig.app.json"
    },
    {
      "path": "./tsconfig.node.json"
    }
  ],
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@pages/*": ["./src/pages/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@services/*": ["./src/services/*"],
      "@types/*": ["./src/types/*"],
      "@utils/*": ["./src/utils/*"]
    }
  }
}
EOF
    
    # Update tsconfig.app.json if it doesn't exist
    if [ ! -f "tsconfig.app.json" ]; then
        cat > tsconfig.app.json << 'EOF'
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "verbatimModuleSyntax": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true,
    
    /* Path mapping */
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@pages/*": ["./src/pages/*"],
      "@hooks/*": ["./src/hooks/*"],
      "@services/*": ["./src/services/*"],
      "@types/*": ["./src/types/*"],
      "@utils/*": ["./src/utils/*"]
    }
  },
  "include": ["src"]
}
EOF
    fi
    
    echo "✅ TypeScript config optimized"
    return 0
}

# Step 9: Update ESLint Configuration
optimize_eslint_config() {
    echo "🔍 Optimizing ESLint configuration..."
    
    cat > .eslintrc.cjs << 'EOF'
module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'vite.config.ts'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/no-explicit-any': 'warn',
    'prefer-const': 'error',
    'no-var': 'error',
  },
}
EOF
    
    echo "✅ ESLint config optimized"
    return 0
}

# Step 10: Update .gitignore
update_gitignore() {
    echo "📋 Updating .gitignore..."
    
    cat > .gitignore << 'EOF'
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

# Dependencies
node_modules
.pnp
.pnp.js

# Production builds
dist
dist-ssr
build
out
.next

# Environment variables
.env
.env.*
!.env.example

# Cache directories
.npm
.yarn
.pnpm-store
.eslintcache
.vite
.parcel-cache

# Runtime data
pids
*.pid
*.seed
*.pid.lock

# Coverage directory used by tools like istanbul
coverage
*.lcov

# Dependency directories
node_modules/
jspm_packages/

# TypeScript cache
*.tsbuildinfo

# Optional npm cache directory
.npm

# Optional eslint cache
.eslintcache

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variable files
.env
.env.development.local
.env.test.local
.env.production.local
.env.local

# Stores VSCode versions used for testing VSCode extensions
.vscode-test

# IDE files
.vscode/
.idea/
*.swp
*.swo
*~

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Backup files
*_backup_*
backup_*/

# Analysis files
bundle-analyzer-report.html
depcheck_results.json
EOF
    
    echo "✅ .gitignore updated"
    return 0
}

# Step 11: Fresh Dependencies Install
install_fresh_dependencies() {
    echo "📦 Installing fresh dependencies..."
    
    if npm install; then
        echo "✅ Dependencies installed successfully"
    else
        echo "❌ Dependency installation failed"
        return 1
    fi
    
    return 0
}

# Step 12: Validate Installation
validate_installation() {
    echo "🧪 Validating installation..."
    
    # Check if TypeScript compiles
    if npm run type-check; then
        echo "✅ TypeScript validation passed"
    else
        echo "❌ TypeScript validation failed"
        return 1
    fi
    
    # Check if build works
    if npm run build; then
        echo "✅ Build validation passed"
    else
        echo "❌ Build validation failed"
        return 1
    fi
    
    return 0
}

# Run all cleanup steps
run_cleanup_step "Profile Architecture Cleanup" cleanup_profile_architecture
run_cleanup_step "Dependencies Cleanup" cleanup_dependencies
run_cleanup_step "Build Artifacts Cleanup" cleanup_build_artifacts
run_cleanup_step "Cache Files Cleanup" cleanup_cache_files
run_cleanup_step "Package Scripts Optimization" optimize_package_scripts
run_cleanup_step "Vite Config Optimization" create_optimized_vite_config
run_cleanup_step "TypeScript Config Optimization" optimize_typescript_config
run_cleanup_step "ESLint Config Optimization" optimize_eslint_config
run_cleanup_step "Gitignore Update" update_gitignore
run_cleanup_step "Fresh Dependencies Install" install_fresh_dependencies
run_cleanup_step "Installation Validation" validate_installation

# Optional dependency check
check_unused_dependencies

# Final summary
echo ""
echo "🎉 FRONTEND CLEANUP COMPLETE!"
echo "============================="
echo ""
echo "📊 What was accomplished:"
echo "✅ Removed profile-based architecture"
echo "✅ Cleaned all cache and build files"
echo "✅ Optimized build configuration"
echo "✅ Updated TypeScript settings"
echo "✅ Streamlined package scripts"
echo "✅ Fresh dependency installation"
echo "✅ Validated compilation and build"
echo ""
echo "📄 Files to review:"
echo "  • depcheck_results.json (unused dependencies)"
echo "  • vite.config.ts (build optimization)"
echo "  • tsconfig.json (TypeScript paths)"
echo ""
echo "💾 Backup location: $BACKUP_DIR"
echo ""
echo "🚀 Next Steps:"
echo "1. Start development server: npm run dev"
echo "2. Test critical user flows"
echo "3. Review and remove unused dependencies"
echo "4. Update import paths to use new aliases"
echo "5. Test build: npm run build"
echo ""
echo "💡 Available commands:"
echo "  npm run dev          # Start development server"
echo "  npm run build        # Production build"
echo "  npm run type-check   # TypeScript validation"
echo "  npm run lint         # Code linting"
echo "  npm run format       # Code formatting"
echo "  npm run analyze      # Bundle analysis"
