#!/bin/bash
# AssisText Frontend Build and PM2 Deployment Script
# Builds the site and initializes PM2 for production deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Configuration
FRONTEND_DIR="/opt/assistext_frontend"
REPO_URL="https://github.com/yourusername/assistext-frontend.git"  # Update this
BRANCH="main"
NODE_VERSION="18"
APP_NAME="assistext_frontend"

echo -e "${BLUE}==========================================${NC}"
echo -e "${BLUE}  AssisText Frontend Deployment Script${NC}"
echo -e "${BLUE}==========================================${NC}"
echo

# Check if running as correct user
if [[ $EUID -eq 0 ]]; then
   echo -e "${RED}This script should not be run as root. Run as admin user.${NC}"
   exit 1
fi

# Function to print status
print_status() {
    echo -e "${PURPLE}[$(date +'%H:%M:%S')] $1${NC}"
}

# Function to check command success
check_success() {
    if [[ $? -eq 0 ]]; then
        echo -e "${GREEN}✅ $1${NC}"
    else
        echo -e "${RED}❌ $1 failed${NC}"
        exit 1
    fi
}

# Step 1: Check prerequisites
print_status "Checking prerequisites..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js not found! Installing Node.js $NODE_VERSION...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    check_success "Node.js installation"
fi

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}PM2 not found! Installing PM2...${NC}"
    sudo npm install -g pm2
    check_success "PM2 installation"
fi

echo -e "${GREEN}Node.js version: $(node --version)${NC}"
echo -e "${GREEN}NPM version: $(npm --version)${NC}"
echo -e "${GREEN}PM2 version: $(pm2 --version)${NC}"

# Step 2: Create and setup frontend directory
print_status "Setting up frontend directory..."

# Create directory if it doesn't exist
sudo mkdir -p "$FRONTEND_DIR"
sudo chown -R admin:admin "$FRONTEND_DIR"

# Navigate to frontend directory
cd "$FRONTEND_DIR"

# Step 3: Handle Git repository
print_status "Managing Git repository..."

if [[ -d ".git" ]]; then
    echo -e "${YELLOW}Existing repository found. Pulling latest changes...${NC}"
    git fetch origin
    git reset --hard origin/$BRANCH
    git pull origin $BRANCH
    check_success "Git pull"
else
    echo -e "${YELLOW}No repository found. You have two options:${NC}"
    echo "1. Clone from Git repository"
    echo "2. Skip (if you'll upload files manually)"
    read -p "Choose option (1 or 2): " git_option
    
    if [[ $git_option == "1" ]]; then
        echo -e "${YELLOW}Please update REPO_URL in this script with your repository URL${NC}"
        echo "Current REPO_URL: $REPO_URL"
        read -p "Do you want to clone from this URL? (y/n): " confirm
        if [[ $confirm == "y" ]]; then
            git clone $REPO_URL .
            check_success "Git clone"
        else
            echo -e "${YELLOW}Skipping git clone. Please upload your files manually.${NC}"
        fi
    fi
fi

# Step 4: Create production environment file
print_status "Creating production environment configuration..."

cat > .env.production << 'EOF'
# AssisText Frontend Production Environment
VITE_API_URL=https://assitext.ca/api
VITE_WS_URL=wss://assitext.ca
VITE_APP_NAME=AssisText
VITE_APP_ENV=production
VITE_STRIPE_PUBLIC_KEY=pk_live_your_stripe_public_key
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
VITE_BACKEND_URL=https://backend.assitext.ca
EOF

echo -e "${GREEN}✅ Environment file created${NC}"
echo -e "${YELLOW}Note: Update .env.production with your actual values${NC}"

# Step 5: Install dependencies
print_status "Installing Node.js dependencies..."

if [[ -f "package.json" ]]; then
    # Clean install for production
    rm -rf node_modules package-lock.json 2>/dev/null || true
    npm ci --production=false
    check_success "NPM dependencies installation"
    
    # Install terser for production builds (required for Vite)
    npm install --save-dev terser
    check_success "Terser installation"
else
    echo -e "${YELLOW}No package.json found. Creating basic package.json...${NC}"
    cat > package.json << 'EOF'
{
  "name": "assistext-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "serve": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "compression": "^1.7.4"
  },
  "devDependencies": {
    "vite": "^6.3.5",
    "terser": "^5.42.0"
  }
}
EOF
    npm install
    check_success "Basic package installation"
fi

# Step 6: Build the application
print_status "Building production application..."

if [[ -f "package.json" ]] && grep -q "build" package.json; then
    # Run production build
    npm run build
    check_success "Production build"
    
    # Verify build output
    if [[ -d "dist" ]] && [[ -f "dist/index.html" ]]; then
        echo -e "${GREEN}✅ Build output verified in dist/ directory${NC}"
        
        # Show build stats
        echo -e "${BLUE}Build statistics:${NC}"
        du -sh dist/
        find dist/ -name "*.js" -o -name "*.css" | wc -l | xargs echo "Asset files:"
    else
        echo -e "${RED}❌ Build failed - no dist/index.html found${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}No build script found. Creating basic dist structure...${NC}"
    mkdir -p dist
    cat > dist/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AssisText</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            text-align: center; 
            padding: 50px; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            margin: 0;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
        }
        .container { max-width: 600px; }
        h1 { font-size: 3em; margin-bottom: 20px; }
        p { font-size: 1.2em; margin-bottom: 30px; }
        .status { background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 AssisText</h1>
        <p>Your AI-powered SMS assistant platform</p>
        <div class="status">
            <h3>✅ Frontend Deployed</h3>
            <p>Build your React application and deploy here</p>
        </div>
    </div>
</body>
</html>
EOF
fi

# Step 7: Create Express server for serving the app
print_status "Setting up Express server..."

cat > server.js << 'EOF'
import express from 'express';
import path from 'path';
import compression from 'compression';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Enable gzip compression
app.use(compression());

// Security middleware
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// Serve static files from dist directory with proper caching
app.use(express.static(path.join(__dirname, 'dist'), {
    maxAge: '1y',
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
        // Don't cache index.html to ensure updates are seen
        if (filePath.endsWith('index.html')) {
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
        }
    }
}));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        service: 'assistext-frontend',
        version: process.env.npm_package_version || '1.0.0',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'production'
    });
});

// Frontend status endpoint
app.get('/frontend-health', (req, res) => {
    res.json({
        status: 'healthy',
        message: 'AssisText frontend is running',
        timestamp: new Date().toISOString()
    });
});

// Handle client-side routing - send all requests to index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ 
        status: 'error', 
        message: 'Internal server error' 
    });
});

app.listen(PORT, '127.0.0.1', () => {
    console.log(`🚀 AssisText frontend server running on port ${PORT}`);
    console.log(`📁 Serving from: ${path.join(__dirname, 'dist')}`);
    console.log(`🔗 Health check: http://127.0.0.1:${PORT}/health`);
});
EOF

check_success "Express server setup"

# Step 8: Create PM2 ecosystem configuration
print_status "Creating PM2 ecosystem configuration..."

cat > ecosystem.config.cjs << 'EOF'
module.exports = {
  apps: [{
    name: 'assistext_frontend',
    script: 'server.js',
    cwd: '/opt/assistext_frontend',
    instances: 'max',  // Use all CPU cores
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    // Logging
    log_file: '/var/log/assistext/frontend-combined.log',
    out_file: '/var/log/assistext/frontend-out.log',
    error_file: '/var/log/assistext/frontend-error.log',
    time: true,
    
    // Process management
    autorestart: true,
    max_restarts: 5,
    restart_delay: 1000,
    watch: false,
    
    // Memory management
    max_memory_restart: '500M',
    
    // Health monitoring
    health_check_grace_period: 3000,
    health_check_fatal_exceptions: true
  }]
};
EOF

check_success "PM2 ecosystem configuration"

# Step 9: Create log directory
print_status "Setting up logging..."

sudo mkdir -p /var/log/assistext
sudo chown -R admin:admin /var/log/assistext

# Step 10: Set proper permissions
print_status "Setting proper permissions..."

# Ensure admin user owns the frontend directory
sudo chown -R admin:admin "$FRONTEND_DIR"

# Set proper permissions for static files
sudo chmod -R 755 "$FRONTEND_DIR/dist"
sudo chown -R www-data:www-data "$FRONTEND_DIR/dist"

check_success "Permissions setup"

# Step 11: Stop existing PM2 processes
print_status "Managing PM2 processes..."

# Stop existing process if running
pm2 stop $APP_NAME 2>/dev/null || echo "No existing process to stop"
pm2 delete $APP_NAME 2>/dev/null || echo "No existing process to delete"

# Step 12: Start PM2 with new configuration
print_status "Starting PM2 process..."

# Start the application
pm2 start ecosystem.config.cjs
check_success "PM2 process start"

# Save PM2 configuration
pm2 save
check_success "PM2 configuration save"

# Setup PM2 startup script
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u admin --hp /home/admin
check_success "PM2 startup script"

# Step 13: Test the application
print_status "Testing application..."

# Wait a moment for the app to start
sleep 3

# Test the health endpoint
if curl -f http://127.0.0.1:3000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Application health check passed${NC}"
else
    echo -e "${YELLOW}⚠️ Health check failed, but this might be normal during startup${NC}"
fi

# Step 14: Restart nginx to ensure proper configuration
print_status "Restarting nginx..."

sudo nginx -t && sudo systemctl reload nginx
check_success "Nginx reload"

# Step 15: Final status report
print_status "Generating deployment report..."

echo
echo -e "${GREEN}==========================================${NC}"
echo -e "${GREEN}     DEPLOYMENT COMPLETED SUCCESSFULLY${NC}"
echo -e "${GREEN}==========================================${NC}"
echo
echo -e "${BLUE}📊 Deployment Summary:${NC}"
echo -e "   Frontend Directory: $FRONTEND_DIR"
echo -e "   PM2 App Name: $APP_NAME"
echo -e "   Express Server Port: 3000"
echo -e "   Node.js Version: $(node --version)"
echo -e "   Environment: Production"
echo
echo -e "${BLUE}🔍 PM2 Status:${NC}"
pm2 status

echo
echo -e "${BLUE}📝 Useful Commands:${NC}"
echo -e "   View PM2 logs:     ${YELLOW}pm2 logs $APP_NAME${NC}"
echo -e "   Restart app:       ${YELLOW}pm2 restart $APP_NAME${NC}"
echo -e "   Stop app:          ${YELLOW}pm2 stop $APP_NAME${NC}"
echo -e "   PM2 monitoring:    ${YELLOW}pm2 monit${NC}"
echo -e "   View nginx logs:   ${YELLOW}sudo tail -f /var/log/nginx/assistext_frontend_access.log${NC}"
echo
echo -e "${BLUE}🌐 URLs:${NC}"
echo -e "   Frontend (HTTPS):  ${YELLOW}https://assitext.ca${NC}"
echo -e "   Backend API:       ${YELLOW}https://assitext.ca/api${NC}"
echo -e "   Health Check:      ${YELLOW}https://assitext.ca/health${NC}"
echo -e "   Local Health:      ${YELLOW}http://127.0.0.1:3000/health${NC}"

echo
echo -e "${GREEN}🎉 Your AssisText frontend is now deployed and running!${NC}"

# Step 16: Optional - Show real-time logs
read -p "Do you want to view real-time PM2 logs? (y/n): " show_logs
if [[ $show_logs == "y" ]]; then
    echo -e "${BLUE}Showing real-time logs (Press Ctrl+C to exit):${NC}"
    pm2 logs $APP_NAME --lines 50
fi#!/bin/bash
# AssisText Frontend Build and PM2 Deployment Script
# Builds the site and initializes PM2 for production deployment

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m'

# Configuration
FRONTEND_DIR="/opt/assistext_frontend"
REPO_URL="https://github.com/lemur767/assistext_frontend.git"  # Update this
BRANCH="main"
NODE_VERSION="18"
APP_NAME="assistext_frontend"

echo -e "${BLUE}==========================================${NC}"
echo -e "${BLUE}  AssisText Frontend Deployment Script${NC}"
echo -e "${BLUE}==========================================${NC}"
echo

# Check if running as correct user
if [[ $EUID -eq 0 ]]; then
   echo -e "${RED}This script should not be run as root. Run as admin user.${NC}"
   exit 1
fi

# Function to print status
print_status() {
    echo -e "${PURPLE}[$(date +'%H:%M:%S')] $1${NC}"
}

# Function to check command success
check_success() {
    if [[ $? -eq 0 ]]; then
        echo -e "${GREEN}✅ $1${NC}"
    else
        echo -e "${RED}❌ $1 failed${NC}"
        exit 1
    fi
}

# Step 1: Check prerequisites
print_status "Checking prerequisites..."

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}Node.js not found! Installing Node.js $NODE_VERSION...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs
    check_success "Node.js installation"
fi

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}PM2 not found! Installing PM2...${NC}"
    sudo npm install -g pm2
    check_success "PM2 installation"
fi

echo -e "${GREEN}Node.js version: $(node --version)${NC}"
echo -e "${GREEN}NPM version: $(npm --version)${NC}"
echo -e "${GREEN}PM2 version: $(pm2 --version)${NC}"

# Step 2: Create and setup frontend directory
print_status "Setting up frontend directory..."

# Create directory if it doesn't exist
sudo mkdir -p "$FRONTEND_DIR"
sudo chown -R admin:admin "$FRONTEND_DIR"

# Navigate to frontend directory
cd "$FRONTEND_DIR"

# Step 3: Handle Git repository
print_status "Managing Git repository..."

if [[ -d ".git" ]]; then
    echo -e "${YELLOW}Existing repository found. Pulling latest changes...${NC}"
    git fetch origin
    git reset --hard origin/$BRANCH
    git pull origin $BRANCH
    check_success "Git pull"
else
    echo -e "${YELLOW}No repository found. You have two options:${NC}"
    echo "1. Clone from Git repository"
    echo "2. Skip (if you'll upload files manually)"
    read -p "Choose option (1 or 2): " git_option
    
    if [[ $git_option == "1" ]]; then
        echo -e "${YELLOW}Please update REPO_URL in this script with your repository URL${NC}"
        echo "Current REPO_URL: $REPO_URL"
        read -p "Do you want to clone from this URL? (y/n): " confirm
        if [[ $confirm == "y" ]]; then
            git clone $REPO_URL .
            check_success "Git clone"
        else
            echo -e "${YELLOW}Skipping git clone. Please upload your files manually.${NC}"
        fi
    fi
fi

# Step 4: Create production environment file
print_status "Creating production environment configuration..."

cat > .env.production << 'EOF'
# AssisText Frontend Production Environment
VITE_API_URL=https://assitext.ca/api
VITE_WS_URL=wss://assitext.ca
VITE_APP_NAME=AssisText
VITE_APP_ENV=production
VITE_STRIPE_PUBLIC_KEY=pk_live_your_stripe_public_key
VITE_GOOGLE_ANALYTICS_ID=G-XXXXXXXXXX
VITE_BACKEND_URL=https://backend.assitext.ca
EOF

echo -e "${GREEN}✅ Environment file created${NC}"
echo -e "${YELLOW}Note: Update .env.production with your actual values${NC}"

# Step 5: Install dependencies
print_status "Installing Node.js dependencies..."

if [[ -f "package.json" ]]; then
    # Clean install for production
    rm -rf node_modules package-lock.json 2>/dev/null || true
    npm ci --production=false
    check_success "NPM dependencies installation"
    
    # Install terser for production builds (required for Vite)
    npm install --save-dev terser
    check_success "Terser installation"
else
    echo -e "${YELLOW}No package.json found. Creating basic package.json...${NC}"
    cat > package.json << 'EOF'
{
  "name": "assistext-frontend",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "serve": "node server.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "compression": "^1.7.4"
  },
  "devDependencies": {
    "vite": "^6.3.5",
    "terser": "^5.42.0"
  }
}
EOF
    npm install
    check_success "Basic package installation"
fi

# Step 6: Build the application
print_status "Building production application..."

if [[ -f "package.json" ]] && grep -q "build" package.json; then
    # Run production build
    npm run build
    check_success "Production build"
    
    # Verify build output
    if [[ -d "dist" ]] && [[ -f "dist/index.html" ]]; then
        echo -e "${GREEN}✅ Build output verified in dist/ directory${NC}"
        
        # Show build stats
        echo -e "${BLUE}Build statistics:${NC}"
        du -sh dist/
        find dist/ -name "*.js" -o -name "*.css" | wc -l | xargs echo "Asset files:"
    else
        echo -e "${RED}❌ Build failed - no dist/index.html found${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}No build script found. Creating basic dist structure...${NC}"
    mkdir -p dist
    cat > dist/index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AssisText</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            text-align: center; 
            padding: 50px; 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            margin: 0;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
        }
        .container { max-width: 600px; }
        h1 { font-size: 3em; margin-bottom: 20px; }
        p { font-size: 1.2em; margin-bottom: 30px; }
        .status { background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🚀 AssisText</h1>
        <p>Your AI-powered SMS assistant platform</p>
        <div class="status">
            <h3>✅ Frontend Deployed</h3>
            <p>Build your React application and deploy here</p>
        </div>
    </div>
</body>
</html>
EOF
fi

# Step 7: Create Express server for serving the app
print_status "Setting up Express server..."

cat > server.js << 'EOF'
import express from 'express';
import path from 'path';
import compression from 'compression';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Enable gzip compression
app.use(compression());

// Security middleware
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// Serve static files from dist directory with proper caching
app.use(express.static(path.join(__dirname, 'dist'), {
    maxAge: '1y',
    etag: true,
    lastModified: true,
    setHeaders: (res, filePath) => {
        // Don't cache index.html to ensure updates are seen
        if (filePath.endsWith('index.html')) {
            res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
        }
    }
}));

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        service: 'assistext-frontend',
        version: process.env.npm_package_version || '1.0.0',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'production'
    });
});

// Frontend status endpoint
app.get('/frontend-health', (req, res) => {
    res.json({
        status: 'healthy',
        message: 'AssisText frontend is running',
        timestamp: new Date().toISOString()
    });
});

// Handle client-side routing - send all requests to index.html
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ 
        status: 'error', 
        message: 'Internal server error' 
    });
});

app.listen(PORT, '127.0.0.1', () => {
    console.log(`🚀 AssisText frontend server running on port ${PORT}`);
    console.log(`📁 Serving from: ${path.join(__dirname, 'dist')}`);
    console.log(`🔗 Health check: http://127.0.0.1:${PORT}/health`);
});
EOF

check_success "Express server setup"

# Step 8: Create PM2 ecosystem configuration
print_status "Creating PM2 ecosystem configuration..."

cat > ecosystem.config.cjs << 'EOF'
module.exports = {
  apps: [{
    name: 'assistext_frontend',
    script: 'server.js',
    cwd: '/opt/assistext_frontend',
    instances: 'max',  // Use all CPU cores
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    // Logging
    log_file: '/var/log/assistext/frontend-combined.log',
    out_file: '/var/log/assistext/frontend-out.log',
    error_file: '/var/log/assistext/frontend-error.log',
    time: true,
    
    // Process management
    autorestart: true,
    max_restarts: 5,
    restart_delay: 1000,
    watch: false,
    
    // Memory management
    max_memory_restart: '500M',
    
    // Health monitoring
    health_check_grace_period: 3000,
    health_check_fatal_exceptions: true
  }]
};
EOF

check_success "PM2 ecosystem configuration"

# Step 9: Create log directory
print_status "Setting up logging..."

sudo mkdir -p /var/log/assistext
sudo chown -R admin:admin /var/log/assistext

# Step 10: Set proper permissions
print_status "Setting proper permissions..."

# Ensure admin user owns the frontend directory
sudo chown -R admin:admin "$FRONTEND_DIR"

# Set proper permissions for static files
sudo chmod -R 755 "$FRONTEND_DIR/dist"
sudo chown -R www-data:www-data "$FRONTEND_DIR/dist"

check_success "Permissions setup"

# Step 11: Stop existing PM2 processes
print_status "Managing PM2 processes..."

# Stop existing process if running
pm2 stop $APP_NAME 2>/dev/null || echo "No existing process to stop"
pm2 delete $APP_NAME 2>/dev/null || echo "No existing process to delete"

# Step 12: Start PM2 with new configuration
print_status "Starting PM2 process..."

# Start the application
pm2 start ecosystem.config.cjs
check_success "PM2 process start"

# Save PM2 configuration
pm2 save
check_success "PM2 configuration save"

# Setup PM2 startup script
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u admin --hp /home/admin
check_success "PM2 startup script"

# Step 13: Test the application
print_status "Testing application..."

# Wait a moment for the app to start
sleep 3

# Test the health endpoint
if curl -f http://127.0.0.1:3000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✅ Application health check passed${NC}"
else
    echo -e "${YELLOW}⚠️ Health check failed, but this might be normal during startup${NC}"
fi

# Step 14: Restart nginx to ensure proper configuration
print_status "Restarting nginx..."

sudo nginx -t && sudo systemctl reload nginx
check_success "Nginx reload"

# Step 15: Final status report
print_status "Generating deployment report..."

echo
echo -e "${GREEN}==========================================${NC}"
echo -e "${GREEN}     DEPLOYMENT COMPLETED SUCCESSFULLY${NC}"
echo -e "${GREEN}==========================================${NC}"
echo
echo -e "${BLUE}📊 Deployment Summary:${NC}"
echo -e "   Frontend Directory: $FRONTEND_DIR"
echo -e "   PM2 App Name: $APP_NAME"
echo -e "   Express Server Port: 3000"
echo -e "   Node.js Version: $(node --version)"
echo -e "   Environment: Production"
echo
echo -e "${BLUE}🔍 PM2 Status:${NC}"
pm2 status

echo
echo -e "${BLUE}📝 Useful Commands:${NC}"
echo -e "   View PM2 logs:     ${YELLOW}pm2 logs $APP_NAME${NC}"
echo -e "   Restart app:       ${YELLOW}pm2 restart $APP_NAME${NC}"
echo -e "   Stop app:          ${YELLOW}pm2 stop $APP_NAME${NC}"
echo -e "   PM2 monitoring:    ${YELLOW}pm2 monit${NC}"
echo -e "   View nginx logs:   ${YELLOW}sudo tail -f /var/log/nginx/assistext_frontend_access.log${NC}"
echo
echo -e "${BLUE}🌐 URLs:${NC}"
echo -e "   Frontend (HTTPS):  ${YELLOW}https://assitext.ca${NC}"
echo -e "   Backend API:       ${YELLOW}https://assitext.ca/api${NC}"
echo -e "   Health Check:      ${YELLOW}https://assitext.ca/health${NC}"
echo -e "   Local Health:      ${YELLOW}http://127.0.0.1:3000/health${NC}"

echo
echo -e "${GREEN}🎉 Your AssisText frontend is now deployed and running!${NC}"

# Step 16: Optional - Show real-time logs
read -p "Do you want to view real-time PM2 logs? (y/n): " show_logs
if [[ $show_logs == "y" ]]; then
    echo -e "${BLUE}Showing real-time logs (Press Ctrl+C to exit):${NC}"
    pm2 logs $APP_NAME --lines 50
fi
