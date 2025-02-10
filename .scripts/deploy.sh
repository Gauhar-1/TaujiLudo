#!/bin/bash
set -e

echo "Deployment started..."

# Clean untracked files and symbolic links
echo "Cleaning untracked files..."
git clean -fdX || { echo "Error cleaning untracked files"; exit 1; }

# Stash local changes if there are any
echo "Stashing local changes..."
git stash -u || echo "No local changes to stash"

# Pull the latest version of the app
echo "Pulling the latest version of the app..."
git pull origin main || { echo "Error pulling the latest version"; exit 1; }
echo "New changes copied to server!"

# Frontend setup
cd ./frontend/

rm -rf node_modules package-lock.json pnpm-lock.yaml yarn.lock

echo "Installing Dependencies..."
pnpm install || { echo "Error installing frontend dependencies"; exit 1; }

echo "Creating Production Build..."
pnpm run build || { echo "Error creating production build"; exit 1; }

echo "Restarting nginx..."
sudo systemctl restart nginx || { echo "Error restarting nginx"; exit 1; }

# Backend setup
cd ../backend/

echo "Installing Backend Dependencies..."
pnpm install || { echo "Error installing backend dependencies"; exit 1; }

echo "Building TypeScript files..."
npm install tsc
 tsc -b || { echo "Error building backend TypeScript files"; exit 1; }

echo "PM2 Reload"
pm2 reload 0 || { echo "Error reloading PM2"; exit 1; }

# Reapply any stashed changes if they exist
echo "Reapplying stashed changes..."
git stash pop || echo "No stashed changes to apply"

echo "Deployment Finished!"
