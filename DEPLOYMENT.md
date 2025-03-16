# Deployment Guide

This guide provides detailed instructions for deploying the WhatsApp Client API in various environments.

## Table of Contents

1. [Local Development](#local-development)
2. [Docker Deployment](#docker-deployment)
3. [Node.js Server Deployment](#nodejs-server-deployment)
4. [Cloud Platform Deployment](#cloud-platform-deployment)
5. [Security Considerations](#security-considerations)
6. [Troubleshooting](#troubleshooting)

## Local Development

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Steps

1. Clone the repository:
```bash
git clone https://github.com/yourusername/whatsapp-client-api.git
cd whatsapp-client-api
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Start the development server:
```bash
npm run dev
```

The API will be accessible at http://localhost:5000.

## Docker Deployment

### Option 1: Using Docker Compose (Recommended)

1. Clone the repository:
```bash
git clone https://github.com/yourusername/whatsapp-client-api.git
cd whatsapp-client-api
```

2. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

3. Start the service using Docker Compose:
```bash
docker-compose up -d
```

The API will be accessible at http://localhost:5000.

### Option 2: Using Docker Directly

1. Build the Docker image:
```bash
docker build -t whatsapp-client-api .
```

2. Run the container:
```bash
docker run -p 5000:5000 -v $(pwd)/sessions:/app/sessions whatsapp-client-api
```

The API will be accessible at http://localhost:5000.

## Node.js Server Deployment

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PM2 (recommended for process management)

### Steps

1. Clone the repository on your server:
```bash
git clone https://github.com/yourusername/whatsapp-client-api.git
cd whatsapp-client-api
```

2. Install dependencies:
```bash
npm install
```

3. Build the application:
```bash
npm run build
```

4. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

5. Install PM2 globally (if not already installed):
```bash
npm install -g pm2
```

6. Start the application with PM2:
```bash
pm2 start npm --name "whatsapp-api" -- start
```

7. Configure PM2 to start on system boot:
```bash
pm2 startup
pm2 save
```

### Setting Up Nginx as a Reverse Proxy

If you want to use Nginx as a reverse proxy:

1. Install Nginx:
```bash
sudo apt-get install nginx
```

2. Create a Nginx configuration file:
```bash
sudo nano /etc/nginx/sites-available/whatsapp-api
```

3. Add the following configuration:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

4. Create a symbolic link to enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/whatsapp-api /etc/nginx/sites-enabled/
```

5. Test the Nginx configuration:
```bash
sudo nginx -t
```

6. Restart Nginx:
```bash
sudo systemctl restart nginx
```

7. Setup SSL with Let's Encrypt:
```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## Cloud Platform Deployment

### Deploying to Replit

This project is ready to be deployed on Replit.

1. Fork the repository to your Replit account
2. Set up environment variables in the Replit Secrets tab
3. Run the project

### Deploying to Heroku

1. Create a Heroku app:
```bash
heroku create whatsapp-client-api
```

2. Add a Procfile:
```
web: npm start
```

3. Configure environment variables:
```bash
heroku config:set NODE_ENV=production
```

4. Deploy to Heroku:
```bash
git push heroku main
```

### Deploying to DigitalOcean App Platform

1. Create a new app on DigitalOcean App Platform
2. Connect your GitHub repository
3. Configure the app:
   - Type: Web Service
   - Build Command: `npm run build`
   - Run Command: `npm start`
4. Set environment variables from the `.env.example` file
5. Deploy the app

## Security Considerations

### API Authentication

It's recommended to add authentication to your API in production environments. Two common approaches:

1. **API Key Authentication**: Verify a secret key sent in the request headers.
2. **JWT Authentication**: Implement JWT-based authentication.

To implement API key authentication, modify your server code to check for an `Authorization` header and validate it against your configured API key.

### HTTPS

Always use HTTPS in production to protect data in transit. When using Nginx, Let's Encrypt provides free SSL certificates.

### Rate Limiting

Implement rate limiting to prevent abuse. You can use the `express-rate-limit` package:

```bash
npm install express-rate-limit
```

Then, add it to your Express app:

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

## Troubleshooting

### Connection Issues

1. **QR Code not displaying**:
   - Ensure the API server is running
   - Check for errors in server logs
   - Verify your client is connecting to the correct endpoint

2. **Connection drops frequently**:
   - Check your server's internet connection
   - Ensure your server has sufficient resources
   - Look for error messages in the logs

3. **Message sending fails**:
   - Verify the phone number format (include country code)
   - Check if the WhatsApp session is still active
   - Look for any error responses from the API

### Persistent Session Issues

If you're having issues with sessions not persisting between restarts:

1. Check that the sessions directory is properly mounted if using Docker
2. Verify file permissions on the sessions directory
3. Make sure your server has sufficient disk space