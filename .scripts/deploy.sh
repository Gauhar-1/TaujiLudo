#!/bin/bash
set -e

echo "Deployment started..."

# Pull the latest version of the app
git pull origin main
echo "New changes copied to server!"

cd ./frontend/

echo "Installing Dependencies..."
pnpm install --yes

echo "Creating Production Build..."
pnpm run build

sudo systemctl restart nginx

cd ../backend/

echo "PM2 Reload"
pm2 reload 0

echo "Deployment Finished!"
