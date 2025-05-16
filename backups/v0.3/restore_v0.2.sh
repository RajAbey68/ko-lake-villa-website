#!/bin/bash

# Restore script for version 0.2
echo "Restoring Ko Lake Villa site to version 0.2..."

# Check if backup exists
if [ ! -d "./backups/v0.2" ]; then
  echo "Error: Backup v0.2 not found!"
  exit 1
fi

# Create a temporary backup of current state before restoring
echo "Creating temporary backup of current state..."
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
mkdir -p ./backups/pre_restore_$TIMESTAMP
cp -r ./client ./server ./shared ./uploads ./backups/pre_restore_$TIMESTAMP/ 2>/dev/null
echo "Current state backed up to ./backups/pre_restore_$TIMESTAMP/"

# Restore from v0.2 backup
echo "Restoring client, server, shared and uploads directories..."
rm -rf ./client ./server ./shared ./uploads
cp -r ./backups/v0.2/client ./backups/v0.2/server ./backups/v0.2/shared ./backups/v0.2/uploads ./ 2>/dev/null

echo "Restoration complete! The site has been reverted to version 0.2."
echo "If you need to go back to the pre-restore state, you can find it in ./backups/pre_restore_$TIMESTAMP/"