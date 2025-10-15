#!/bin/bash

# Auto-save script - runs backup every 5 minutes
# Run this in the background: ./auto-save.sh &

echo "🔄 Starting auto-save process (every 5 minutes)..."
echo "Press Ctrl+C to stop"

while true; do
    echo "⏰ $(date): Running auto-backup..."
    ./backup-and-push.sh
    echo "💤 Waiting 5 minutes until next backup..."
    sleep 300  # 5 minutes
done