#!/bin/bash

# =============================================================================
# Frontend Build and PM2 Deployment Script
# =============================================================================
# This script handles the complete build and deployment process for your
# AssisText frontend using PM2 and your existing ecosystem configuration
# =============================================================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration - Update these paths as needed
FRONTEND_DIR="/opt/assistext_frontend"  # Your frontend directory
APP_NAME="assistext_frontend"           # PM2 app name from your ecosystem config
PORT="3000"                            # Port from your ecosystem config

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# =============================================================================
# STEP 1: BUILD THE APPLICATION
# =============================================================================

build_application() {
    print_status "Building React application..."
    
    # Navigate to your frontend directory
    cd "${FRONTEND_DIR}"
    
    # Install dependencies (if package.json changed)
    print_status "Installing dependencies..."
    npm ci --production=false
    
    # Install terser for production builds (if needed)
    npm install --save-dev terser || true
    
    # Build the application
    print_status "Running production build..."
    npm run build
    
    # Check if build was successful
    if [ ! -f "dist/index.html" ]; then
        print_error "Build failed - no index.html found in dist/"
        exit 1
    fi
    
    print_success "Build completed successfully"
}

# =============================================================================
# STEP 2: PREPARE DEPLOYMENT FILES
# =============================================================================

prepare_deployment() {
    print_status "Preparing deployment files..."
    
    cd "${FRONTEND_DIR}"
    
    # Copy server files to dist directory
    print_status "Copying server files to dist..."
    cp server.js dist/ 2>/dev/null || print_warning "server.js not found"
    cp ecosystem.config.cjs dist/ 2>/dev/null || print_warning "ecosystem.config.cjs not found"
    cp package*.json dist/ 2>/dev/null || print_warning "package.json not found"
    
    # Navigate to dist and install production dependencies
    cd dist
    
    # Install only production dependencies in dist folder
    print_status "Installing production dependencies in dist..."
    npm ci --only=production 2>/dev/null || npm install --only=production 2>/dev/null || true
    
    # Set proper permissions
    print_status "Setting proper permissions..."
    sudo chown -R $(whoami):$(id -gn) "${FRONTEND_DIR}"
    
    print_success "Deployment files prepared"
}

# =============================================================================
# STEP 3: MANAGE PM2 PROCESS
# =============================================================================

manage_pm2_process() {
    print_status "Managing PM2 process..."
    
    # Navigate to dist directory where ecosystem config is
    cd "${FRONTEND_DIR}/dist"
    
    # Check if ecosystem config exists
    if [ ! -f "ecosystem.config.cjs" ]; then
        print_error "ecosystem.config.cjs not found in dist directory"
        print_status "Creating default ecosystem config..."
        create_default_ecosystem_config
    fi
    
    # Check if PM2 process exists
    if pm2 describe "${APP_NAME}" > /dev/null 2>&1; then
        print_status "PM2 process '${APP_NAME}' exists, restarting..."
        pm2 restart "${APP_NAME}"
    else
        print_status "PM2 process '${APP_NAME}' not found, starting new process..."
        pm2 start ecosystem.config.cjs
    fi
    
    # Save PM2 configuration
    pm2 save
    
    print_success "PM2 process managed successfully"
}

# =============================================================================
# STEP 4: CREATE DEFAULT ECOSYSTEM CONFIG (if needed)
# =============================================================================

create_default_ecosystem_config() {
    cat > ecosystem.config.cjs << EOF
module.exports = {
  apps: [{
    name: '${APP_NAME}',
    script: 'server.js',
    cwd: '${FRONTEND_DIR}/dist',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: ${PORT}
    },
    log_file: '/var/log/assistext/frontend-combined.log',
    out_file: '/var/log/assistext/frontend-out.log',
    error_file: '/var/log/assistext/frontend-error.log',
    time: true,
    autorestart: true,
    max_restarts: 5,
    restart_delay: 1000,
    max_memory_restart: '500M'
  }]
};
EOF
    print_success "Default ecosystem config created"
}

# =============================================================================
# STEP 5: HEALTH CHECK
# =============================================================================

health_check() {
    print_status "Running health checks..."
    
    # Wait a moment for the process to start
    sleep 5
    
    # Check PM2 status
    if pm2 status "${APP_NAME}" | grep -q "online"; then
        print_success "PM2 process is online"
    else
        print_error "PM2 process failed to start"
        pm2 logs "${APP_NAME}" --lines 20
        exit 1
    fi
    
    # Check application health endpoint
    print_status "Checking application health..."
    for i in {1..10}; do
        if curl -s "http://localhost:${PORT}/health" > /dev/null; then
            print_success "Application health check passed"
            break
        else
            if [ $i -eq 10 ]; then
                print_warning "Application health check failed, but process is running"
                print_status "You can check logs with: pm2 logs ${APP_NAME}"
            else
                print_status "Waiting for application to start... (attempt $i/10)"
                sleep 2
            fi
        fi
    done
}

# =============================================================================
# STEP 6: SHOW STATUS AND LOGS
# =============================================================================

show_status() {
    print_status "Deployment Summary"
    echo ""
    echo "PM2 Process Status:"
    pm2 status "${APP_NAME}"
    echo ""
    echo "Application URL: http://localhost:${PORT}"
    echo "Health Check: http://localhost:${PORT}/health"
    echo ""
    echo "Useful PM2 Commands:"
    echo "  pm2 status              - Show all processes"
    echo "  pm2 logs ${APP_NAME}    - Show logs"
    echo "  pm2 restart ${APP_NAME} - Restart process"
    echo "  pm2 stop ${APP_NAME}    - Stop process"
    echo "  pm2 delete ${APP_NAME}  - Delete process"
    echo ""
}

# =============================================================================
# MAIN EXECUTION
# =============================================================================

main() {
    print_status "Starting Frontend Build and Deployment"
    print_status "======================================"
    
    # Check if we're in the right directory
    if [ ! -d "${FRONTEND_DIR}" ]; then
        print_error "Frontend directory ${FRONTEND_DIR} not found"
        exit 1
    fi
    
    # Run deployment steps
    build_application
    prepare_deployment
    manage_pm2_process
    health_check
    show_status
    
    print_success "======================================"
    print_success "Frontend deployment completed successfully!"
    print_success "======================================"
}

# Run main function
main "$@"
