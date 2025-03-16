# WhatsApp Client API

A WhatsApp client API using Baileys.js that provides endpoints for checking connection status and sending messages.

## Features

- ✅ Check WhatsApp connection status via API endpoint
- ✅ Connect to WhatsApp via QR code scanning
- ✅ Send WhatsApp messages via API endpoint
- ✅ View message history and status
- ✅ Secure API with simple authentication
- ✅ Automatic reconnection handling

## API Endpoints

### Status Endpoint

```
GET /api/status
```

Returns the current WhatsApp connection status, including:
- Connection state
- QR code for scanning (when not connected)
- Client information (when connected)

**Response Example (Not Connected):**
```json
{
  "success": true,
  "connected": false,
  "qrCode": "data:image/png;base64,..."
}
```

**Response Example (Connected):**
```json
{
  "success": true,
  "connected": true,
  "clientInfo": {
    "name": "John Doe",
    "phone": "1234567890",
    "device": "iPhone",
    "connectedSince": "2023-06-15T12:34:56.789Z"
  }
}
```

### Send Message Endpoint

```
POST /api/send
```

Sends a WhatsApp message to a specified phone number.

**Request Body:**
```json
{
  "phone": "+1234567890",
  "message": "Hello, this is a test message!"
}
```

**Response Example (Success):**
```json
{
  "success": true,
  "message": {
    "id": 1,
    "phone": "+1234567890",
    "message": "Hello, this is a test message!",
    "status": "sent",
    "timestamp": "2023-06-15T12:34:56.789Z",
    "messageId": "WHATSAPP_MESSAGE_ID"
  }
}
```

### Disconnect Endpoint

```
POST /api/disconnect
```

Disconnects the currently connected WhatsApp session.

**Response Example:**
```json
{
  "success": true,
  "message": "WhatsApp disconnected successfully"
}
```

### Get Messages Endpoint

```
GET /api/messages
```

Returns a list of all messages sent through the API, with their current status.

**Response Example:**
```json
{
  "success": true,
  "messages": [
    {
      "id": 1,
      "phone": "+1234567890",
      "message": "Hello, this is a test message!",
      "status": "sent",
      "timestamp": "2023-06-15T12:34:56.789Z",
      "messageId": "WHATSAPP_MESSAGE_ID"
    }
  ]
}
```

## Installation

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation Steps

1. Clone the repository:
```bash
git clone https://github.com/yourusername/whatsapp-client-api.git
cd whatsapp-client-api
```

2. Install dependencies:
```bash
npm install
```

3. Build the project:
```bash
npm run build
```

4. Start the server:
```bash
npm run start
```

## Deployment

### Deploying on Replit

This project is ready to be deployed on Replit. Simply fork the repository and run the project.

### Docker Deployment

A Dockerfile is included for easy deployment in Docker environments.

1. Build the Docker image:
```bash
docker build -t whatsapp-client-api .
```

2. Run the container:
```bash
docker run -p 5000:5000 -v $(pwd)/sessions:/app/sessions whatsapp-client-api
```

### PM2 Deployment (Linux/Unix)

For a production environment, it's recommended to use PM2 to manage the Node.js process.

1. Install PM2 globally:
```bash
npm install -g pm2
```

2. Start the application with PM2:
```bash
pm2 start npm --name "whatsapp-api" -- start
```

3. Setup PM2 to start on system boot:
```bash
pm2 startup
pm2 save
```

## Important Notes

- This API creates a WhatsApp Web session on your server. You'll need to scan the QR code once to connect your WhatsApp account.
- The sessions are stored in the `sessions` directory. Backup this directory if you want to preserve your session.
- Only one WhatsApp account can be connected at a time per instance.

## Security Considerations

- This API does not include authentication by default. In a production environment, you should add proper authentication and authorization.
- Consider implementing rate limiting to prevent abuse.
- Always deploy behind HTTPS in production.

## Troubleshooting

### Common Issues

1. **QR Code not displaying**: Ensure your server is properly returning the base64 QR code from the status endpoint.

2. **Connection issues after deployment**: WhatsApp Web can sometimes detect server changes. Try removing the `sessions` directory and reconnect.

3. **Send message failing**: Verify that the phone number is formatted correctly with country code (e.g., +1234567890).

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [Baileys](https://github.com/WhiskeySockets/Baileys) - The WhatsApp Web API library
- [Express](https://expressjs.com/) - The web server framework
- [QRCode](https://github.com/soldair/node-qrcode) - QR code generation