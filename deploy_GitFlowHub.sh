#!/bin/bash

# Switch to the GitFlowHub project directory
cd ~/GitFlowHub || { echo "Failed to switch to the project directory. Stopping script."; exit 1; }

# Perform git fetch to update the repository
git fetch origin main || { echo "Failed on git fetch. Stopping script."; exit 1; }

# Perform git pull to merge changes
git pull origin main || { echo "Failed on git pull. Stopping script."; exit 1; }

# Stop the gitflowhub-react-app application
pm2 stop gitflowhub-react-app || { echo "Failed to stop gitflowhub-react-app. Stopping script."; exit 1; }

# Stop the gitflowhub-Backend application
pm2 stop gitflowhub-Backend || { echo "Failed to stop gitflowhub-Backend. Stopping script."; exit 1; }

# Wait a few seconds to ensure the applications have stopped
sleep 5

# Start the gitflowhub-Backend application
pm2 start gitflowhub-Backend || { echo "Failed to start gitflowhub-Backend. Stopping script."; exit 1; }

# Wait a few seconds to ensure the Backend application has started
sleep 5

# Start the gitflowhub-react-app application
pm2 start gitflowhub-react-app || { echo "Failed to start gitflowhub-react-app. Stopping script."; exit 1; }
