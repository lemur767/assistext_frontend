#!/bin/bash

# Permission Issue Diagnostics Script
# Run this to understand what's causing the permission issues

echo "🔍 PERMISSION DIAGNOSTICS"
echo "========================="
echo ""

# Basic info
echo "📍 Current directory: $(pwd)"
echo "👤 Current user: $(whoami)"
echo "🆔 User ID: $(id)"
echo ""

# Check if we're in the right place
if [[ ! -f "package.json" ]]; then
    echo "❌ Not in a Node.js project directory"
    echo "💡 Please cd to your frontend directory first"
    exit 1
fi

echo "📊 PROJECT INFORMATION"
echo "======================"
PROJECT_NAME=$(grep '"name"' package.json | cut -d'"' -f4)
echo "Project: $PROJECT_NAME"
echo "Location: $(pwd)"
echo ""

echo "🔐 OWNERSHIP & PERMISSIONS"
echo "=========================="
echo "Directory ownership:"
ls -ld . 

echo ""
echo "Package.json ownership:"
ls -la package.json

echo ""
echo "Node modules ownership:"
if [[ -d "node_modules" ]]; then
    ls -ld node_modules
    echo ""
    echo "Node modules .bin ownership:"
    ls -ld node_modules/.bin 2>/dev/null || echo "node_modules/.bin not found"
    echo ""
    echo "Vite temp directories:"
    ls -la node_modules/ | grep -E "(\.vite|\.tmp)" || echo "No vite temp directories found"
else
    echo "❌ node_modules directory not found"
fi

echo ""
echo "Vite config file:"
ls -la vite.config.* 2>/dev/null || echo "No vite config found"

echo ""
echo "🗂️  PROBLEMATIC DIRECTORIES"
echo "==========================="

# Check for problematic directories
PROBLEM_DIRS=(
    "node_modules/.vite"
    "node_modules/.vite-temp" 
    "node_modules/.tmp"
    ".vite"
    "dist"
)

for dir in "${PROBLEM_DIRS[@]}"; do
    if [[ -d "$dir" ]]; then
        echo "📁 $dir:"
        ls -ld "$dir"
        # Check if we can write to it
        if [[ -w "$dir" ]]; then
            echo "   ✅ Writable"
        else
            echo "   ❌ Not writable"
        fi
    else
        echo "📁 $dir: Not found (good)"
    fi
done

echo ""
echo "🔧 PROCESS INFORMATION"
echo "======================"

# Check for running processes that might lock files
echo "Node.js processes:"
ps aux | grep node | grep -v grep || echo "No Node.js processes found"

echo ""
echo "PM2 processes:"
pm2 list 2>/dev/null || echo "PM2 not running or not installed"

echo ""
echo "💾 DISK SPACE"
echo "============="
df -h . | head -2

echo ""
echo "🔍 DIAGNOSIS RESULTS"
echo "==================="

# Determine the main issue
ISSUES=()
FIXES=()

# Check ownership issues
CURRENT_USER=$(whoami)
OWNER=$(stat -c '%U' .)
if [[ "$CURRENT_USER" != "$OWNER" ]]; then
    ISSUES+=("Ownership mismatch: directory owned by '$OWNER', running as '$CURRENT_USER'")
    FIXES+=("sudo chown -R $CURRENT_USER:$CURRENT_USER .")
fi

# Check write permissions
if [[ ! -w "." ]]; then
    ISSUES+=("Cannot write to current directory")
    FIXES+=("sudo chmod 755 .")
fi

# Check node_modules permissions
if [[ -d "node_modules" ]] && [[ ! -w "node_modules" ]]; then
    ISSUES+=("Cannot write to node_modules directory")
    FIXES+=("sudo chmod -R 755 node_modules")
fi

# Check for vite temp directories
for dir in "${PROBLEM_DIRS[@]}"; do
    if [[ -d "$dir" ]] && [[ ! -w "$dir" ]]; then
        ISSUES+=("Cannot write to $dir")
        FIXES+=("sudo rm -rf $dir")
    fi
done

# Report findings
if [[ ${#ISSUES[@]} -eq 0 ]]; then
    echo "✅ No obvious permission issues detected"
    echo ""
    echo "🤔 Other possible causes:"
    echo "  - Disk space full"
    echo "  - SELinux/AppArmor restrictions"
    echo "  - Running processes locking files"
    echo "  - Network filesystem issues"
else
    echo "❌ Found ${#ISSUES[@]} issue(s):"
    for issue in "${ISSUES[@]}"; do
        echo "  • $issue"
    done
    echo ""
    echo "🔧 Suggested fixes:"
    for fix in "${FIXES[@]}"; do
        echo "  • $fix"
    done
fi

echo ""
echo "🚀 QUICK FIX COMMANDS"
echo "===================="

cat << 'EOF'
# Try these commands in order:

# 1. Quick permission fix
sudo chown -R $USER:$USER .
sudo chmod -R 755 .
sudo rm -rf node_modules/.vite* node_modules/.tmp .vite dist

# 2. Clean reinstall
sudo rm -rf node_modules package-lock.json
npm install

# 3. Build test
npm run build

# 4. If still failing, use sudo (temporary fix)
sudo npm run build

# 5. Docker alternative (bulletproof)
sudo docker build -t assistext-frontend .
EOF

echo ""
echo "💡 RECOMMENDATIONS"
echo "=================="

if [[ "$CURRENT_USER" == "root" ]]; then
    echo "⚠️  Running as root - consider creating a dedicated user:"
    echo "   sudo useradd -r -s /bin/false assistext"
    echo "   sudo chown -R assistext:assistext /opt/assistext_frontend"
elif [[ "$PWD" == /opt/* ]]; then
    echo "📁 Using /opt directory - ensure proper ownership:"
    echo "   sudo chown -R $USER:$USER /opt/assistext_frontend"
fi

echo ""
echo "🔗 Need more help? Run the full fix script:"
echo "   curl -sSL [script-url] | sudo bash"
echo ""
echo "✅ Diagnostics complete!"

