#!/bin/bash
# Quick rebuild and restart script for development/updates
# Use this when you just need to rebuild and restart without full setup

set -e

FRONTEND_DIR="/opt/assistext_frontend"
APP_NAME="assistext_frontend"

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}🔄 Quick Rebuild and Restart${NC}"

cd "$FRONTEND_DIR"

# Pull latest changes if git repo exists
if [[ -d ".git" ]]; then
    echo -e "${YELLOW}📥 Pulling latest changes from SSH repository...${NC}"
    
    # Ensure SSH URL is set
    current_url=$(git remote get-url origin)
    if [[ "$current_url" != "git@github.com:lemur767/assistext_frontend.git" ]]; then
        echo -e "${YELLOW}Updating remote URL to SSH...${NC}"
        git remote set-url origin git@github.com:lemur767/assistext_frontend.git
    fi
    
    # Pull with SSH
    GIT_SSH_COMMAND="ssh -o StrictHostKeyChecking=no" git pull origin main
fi

# Install any new dependencies
echo -e "${YELLOW}📦 Installing dependencies...${NC}"
npm ci --production=false

# Rebuild the application
echo -e "${YELLOW}🔨 Building application...${NC}"
npm run build

# Set permissions
echo -e "${YELLOW}🔐 Setting permissions...${NC}"
sudo chown -R www-data:www-data dist/

# Restart PM2
echo -e "${YELLOW}🔄 Restarting PM2...${NC}"
pm2 restart $APP_NAME

# Reload nginx
echo -e "${YELLOW}🌐 Reloading nginx...${NC}"
sudo nginx -t && sudo systemctl reload nginx

echo -e "${GREEN}✅ Rebuild and restart completed!${NC}"
echo -e "${BLUE}Status:${NC}"
pm2 status $APP_NAME
curl -s http://127.0.0.1:3000/health | jq . 2>/dev/null || curl -s http://127.0.0.1:3000/health
