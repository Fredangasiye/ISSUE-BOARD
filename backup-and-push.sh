#!/bin/bash

# Backup and Git Push Script for Issue Board
# This script automatically commits changes and pushes to GitHub

echo "🔄 Starting backup and Git push process..."

# Get current timestamp
TIMESTAMP=$(date +"%Y-%m-%d_%H-%M-%S")
BACKUP_DIR="/Users/fred/Desktop/vaib/issue-board-backups"

# Create backup directory if it doesn't exist
mkdir -p "$BACKUP_DIR"

# Create backup
echo "📦 Creating backup..."
cp -r /Users/fred/Desktop/vaib/issue-board "$BACKUP_DIR/issue-board-backup-$TIMESTAMP"
echo "✅ Backup created: issue-board-backup-$TIMESTAMP"

# Check if there are changes to commit
if git diff --quiet && git diff --cached --quiet; then
    echo "ℹ️  No changes to commit"
else
    echo "📝 Committing changes..."
    
    # Add all changes
    git add .
    
    # Create commit with timestamp
    git commit -m "Auto-backup: $TIMESTAMP - $(git diff --cached --name-only | head -3 | tr '\n' ' ')"
    
    echo "✅ Changes committed"
    
    # Push to GitHub if remote is configured
    if git remote get-url origin >/dev/null 2>&1; then
        echo "🚀 Pushing to GitHub..."
        git push origin main
        echo "✅ Pushed to GitHub successfully"
    else
        echo "⚠️  No GitHub remote configured. Run: git remote add origin YOUR_GITHUB_URL"
    fi
fi

echo "🎉 Backup and Git process completed!"
echo "📁 Backup location: $BACKUP_DIR"
echo "⏰ Timestamp: $TIMESTAMP"