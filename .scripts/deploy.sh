#!/bin/bash
set -e

echo "Deployment started..."

# Clean untracked files and symbolic links
git clean -fdx

# Stash local changes if there are any
git stash -u

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

# Reapply any stashed changes
git stash pop

echo "Deployment Finished!"
