#!/bin/bash
# GitHub Integration Deployment Script
# This script integrates with your existing GitHub Actions workflow
# Place this on your server and call it from GitHub Actions

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Configuration
FRONTEND_DIR="/opt/assistext_frontend"
APP_NAME="assistext_frontend"
BRANCH="${1:-main}"  # Allow branch to be passed as argument
BUILD_ID="${2:-$(date +%Y%m%d_%H%M%S)}"  # Build ID for tracking

echo -e "${BLUE}🚀 GitHub Integration Deployment${NC}"
echo -e "${BLUE}Branch: $BRANCH${NC}"
echo -e "${BLUE}Build ID: $BUILD_ID${NC}"

# Function to log with timestamp
log() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')] $1${NC}"
}

# Step 1: Navigate to frontend directory
log "📁 Navigating to frontend directory..."
cd "$FRONTEND_DIR"

# Step 2: Git operations
log "📥 Fetching latest code..."
git fetch origin
git checkout $BRANCH
git reset --hard origin/$BRANCH

# Get commit info for logging
COMMIT_HASH=$(git rev-parse --short HEAD)
COMMIT_MSG=$(git log -1 --pretty=%B | head -1)
log "📝 Deploying commit: $COMMIT_HASH - $COMMIT_MSG"

# Step 3: Create deployment log
DEPLOY_LOG="/var/log/assistext/deployment.log"
sudo mkdir -p /var/log/assistext
echo "[$(date +'%Y-%m-%d %H:%M:%S')] Starting deployment - Build: $BUILD_ID, Commit: $COMMIT_HASH" | sudo tee -a $DEPLOY_LOG

# Step 4: Install dependencies
log "📦 Installing dependencies..."
npm ci --production=false

# Install terser for production builds
npm install --save-dev terser

# Step 5: Create production environment
log "⚙️ Creating production environment..."
cat > .env.production << 'EOF'
VITE_API_URL=https://assitext.ca/api
VITE_WS_URL=wss://assitext.ca
VITE_APP_NAME=AssisText
VITE_APP_ENV=production
VITE_BACKEND_URL=https://backend.assitext.ca
EOF

# Step 6: Build application
log "🔨 Building production application..."
npm run build

if [[ ! -f "dist/index.html" ]]; then
    echo -e "${RED}❌ Build failed - no index.html found${NC}"
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] Deployment FAILED - Build error" | sudo tee -a $DEPLOY_LOG
    exit 1
fi

# Step 7: Copy server files to dist directory
log "📋 Copying server files..."
cp server.js dist/ 2>/dev/null || true
cp ecosystem.config.cjs dist/ 2>/dev/null || true
cp package*.json dist/ 2>/dev/null || true

# Step 8: Install production dependencies in dist
log "📦 Installing production dependencies in dist..."
cd dist
npm ci --only=production 2>/dev/null || true
cd ..

# Step 9: Set proper permissions
log "🔐 Setting permissions..."
sudo chown -R www-data:www-data dist/
sudo chmod -R 755 dist/

# Step 10: Health check before restart
log "🏥 Running pre-deployment health check..."
if pm2 describe $APP_NAME > /dev/null 2>&1; then
    # App exists, check if it's running
    if pm2 status $APP_NAME | grep -q "online"; then
        log "✅ Application currently running"
    else
        log "⚠️ Application exists but not running"
    fi
else
    log "ℹ️ Application not found in PM2, will create new process"
fi

# Step 11: Deploy with PM2
log "🚀 Deploying with PM2..."

# Create ecosystem config if it doesn't exist
if [[ ! -f "ecosystem.config.cjs" ]]; then
    log "📝 Creating PM2 ecosystem config..."
    cat > ecosystem.config.cjs << 'EOF'
module.exports = {
  apps: [{
    name: 'assistext_frontend',
    script: 'server.js',
    cwd: '/opt/assistext_frontend',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
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
fi

# Restart or start PM2 process
if pm2 describe $APP_NAME > /dev/null 2>&1; then
    log "🔄 Restarting existing PM2 process..."
    pm2 restart $APP_NAME
else
    log "🆕 Starting new PM2 process..."
    pm2 start ecosystem.config.cjs
fi

# Save PM2 configuration
pm2 save

# Step 12: Health check after deployment
log "🏥 Running post-deployment health check..."
sleep 5  # Wait for app to start

# Check PM2 status
if pm2 status $APP_NAME | grep -q "online"; then
    log "✅ PM2 process is online"
else
    log "❌ PM2 process failed to start"
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] Deployment FAILED - PM2 start error" | sudo tee -a $DEPLOY_LOG
    exit 1
fi

# Check application health
if curl -f http://127.0.0.1:3000/health > /dev/null 2>&1; then
    log "✅ Application health check passed"
else
    log "⚠️ Application health check failed, but continuing..."
fi

# Step 13: Restart nginx
log "🌐 Reloading nginx..."
sudo nginx -t
if [[ $? -eq 0 ]]; then
    sudo systemctl reload nginx
    log "✅ Nginx reloaded successfully"
else
    log "❌ Nginx configuration error"
    echo "[$(date +'%Y-%m-%d %H:%M:%S')] Deployment WARNING - Nginx config error" | sudo tee -a $DEPLOY_LOG
fi

# Step 14: Final verification
log "🔍 Final verification..."

# Check if site is accessible
if curl -f https://assitext.ca/health > /dev/null 2>&1; then
    log "✅ Site is accessible via HTTPS"
    SITE_STATUS="✅ ACCESSIBLE"
else
    log "⚠️ Site not accessible via HTTPS (might be DNS/SSL issue)"
    SITE_STATUS="⚠️ NOT ACCESSIBLE"
fi

# Step 15: Deployment summary
echo
echo -e "${GREEN}==========================================${NC}"
echo -e "${GREEN}     DEPLOYMENT COMPLETED${NC}"
echo -e "${GREEN}==========================================${NC}"
echo
echo -e "${BLUE}📊 Deployment Summary:${NC}"
echo -e "   Build ID: $BUILD_ID"
echo -e "   Commit: $COMMIT_HASH"
echo -e "   Branch: $BRANCH"
echo -e "   Timestamp: $(date)"
echo -e "   Site Status: $SITE_STATUS"
echo
echo -e "${BLUE}🔍 Application Status:${NC}"
pm2 status $APP_NAME

echo
echo -e "${BLUE}📈 Resource Usage:${NC}"
pm2 show $APP_NAME | grep -E "(cpu|memory|restart|uptime)" || true

# Log successful deployment
echo "[$(date +'%Y-%m-%d %H:%M:%S')] Deployment SUCCESS - Build: $BUILD_ID, Commit: $COMMIT_HASH" | sudo tee -a $DEPLOY_LOG

echo
echo -e "${GREEN}🎉 Deployment completed successfully!${NC}"
echo -e "${BLUE}🔗 URLs:${NC}"
echo -e "   Frontend: https://assitext.ca"
echo -e "   Health: https://assitext.ca/health"
echo -e "   Logs: pm2 logs $APP_NAME"

# Optional: Show recent logs
read -t 10 -p "Show recent logs? (y/n - auto 'n' in 10s): " show_logs || show_logs="n"
if [[ $show_logs == "y" ]]; then
    pm2 logs $APP_NAME --lines 20
fi
