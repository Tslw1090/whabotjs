#!/bin/bash

# WhatsApp Client API Deployment Script
# This script helps deploy the WhatsApp Client API in a production environment

echo "WhatsApp Client API Deployment"
echo "============================="

# Check if running with sudo
if [ "$EUID" -ne 0 ]; then
  echo "Please run as root or with sudo"
  exit 1
fi

# Setup variables
APP_DIR=$(pwd)
NODE_VERSION="16"

echo "Installing dependencies..."
apt-get update
apt-get install -y curl git build-essential

# Install Node.js if not installed
if ! command -v node &> /dev/null; then
    echo "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash -
    apt-get install -y nodejs
fi

# Install PM2 if not installed
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    npm install -g pm2
fi

# Install project dependencies
echo "Installing project dependencies..."
npm install

# Build the project
echo "Building the project..."
npm run build

# Check if .env file exists, if not create from example
if [ ! -f .env ]; then
    echo "Creating .env file from example..."
    cp .env.example .env
    echo "Please edit the .env file with your configuration"
fi

# Create sessions directory if it doesn't exist
if [ ! -d "sessions" ]; then
    echo "Creating sessions directory..."
    mkdir -p sessions
    chmod 755 sessions
fi

# Start the application with PM2
echo "Starting the application with PM2..."
pm2 start npm --name "whatsapp-api" -- start

# Configure PM2 to start on boot
echo "Configuring PM2 to start on system boot..."
pm2 startup
pm2 save

echo ""
echo "WhatsApp Client API has been deployed successfully!"
echo "The API is now running and managed by PM2"
echo ""
echo "To check status: pm2 status"
echo "To view logs: pm2 logs whatsapp-api"
echo "To restart: pm2 restart whatsapp-api"
echo ""
echo "Next steps:"
echo "1. Configure a reverse proxy (Nginx/Apache) if needed"
echo "2. Setup SSL certificates for HTTPS"
echo "3. Configure API authentication for security"
echo ""
echo "For more information, see DEPLOYMENT.md"