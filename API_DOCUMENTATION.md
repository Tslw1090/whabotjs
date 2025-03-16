# WhatsApp Client API Documentation

This document provides detailed information about all available API endpoints, request parameters, response formats, and error handling for the WhatsApp Client API.

## Base URL

All API endpoints are relative to:

```
https://your-domain.com/api
```

For local development:

```
http://localhost:5000/api
```

## Authentication

Authentication is optional and can be configured in the `.env` file. If enabled, all API requests must include the following headers:

```
Authorization: Bearer YOUR_API_KEY
```

## API Endpoints

### 1. Check Connection Status

Retrieves the current WhatsApp connection status.

**Endpoint:**
```
GET /status
```

**Parameters:**
None

**Response:**

Status Code: 200 OK

When not connected:
```json
{
  "success": true,
  "connected": false,
  "qrCode": "data:image/png;base64,..."
}
```

When connected:
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

**Error Responses:**

Status Code: 500 Internal Server Error
```json
{
  "success": false,
  "error": "Error message"
}
```

### 2. Send Message

Sends a WhatsApp message to a specified phone number.

**Endpoint:**
```
POST /send
```

**Request Body:**
```json
{
  "phone": "+1234567890",
  "message": "Hello, this is a test message!"
}
```

**Phone Number Format:**
- Must include country code
- Can include or exclude the "+" symbol
- Can include or exclude spaces, dashes, or parentheses (these will be stripped)

**Response:**

Status Code: 200 OK
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

**Error Responses:**

Status Code: 400 Bad Request
```json
{
  "success": false,
  "error": "Phone number or message is missing"
}
```

Status Code: 403 Forbidden
```json
{
  "success": false,
  "error": "WhatsApp client is not connected. Please scan the QR code first."
}
```

Status Code: 500 Internal Server Error
```json
{
  "success": false,
  "error": "Error message"
}
```

### 3. Disconnect WhatsApp

Disconnects the currently connected WhatsApp session.

**Endpoint:**
```
POST /disconnect
```

**Parameters:**
None

**Response:**

Status Code: 200 OK
```json
{
  "success": true,
  "message": "WhatsApp disconnected successfully"
}
```

**Error Responses:**

Status Code: 500 Internal Server Error
```json
{
  "success": false,
  "error": "Error message"
}
```

### 4. Get Message History

Returns a list of all messages sent through the API, with their current status.

**Endpoint:**
```
GET /messages
```

**Query Parameters:**

| Parameter | Type   | Description                  | Default | Required |
|-----------|--------|------------------------------|---------|----------|
| limit     | number | Maximum number of messages   | 50      | No       |
| offset    | number | Number of messages to skip   | 0       | No       |
| status    | string | Filter by status             | All     | No       |

**Response:**

Status Code: 200 OK
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
    },
    {
      "id": 2,
      "phone": "+0987654321",
      "message": "Another test message",
      "status": "pending",
      "timestamp": "2023-06-15T12:35:56.789Z",
      "messageId": null
    }
  ],
  "total": 2
}
```

**Error Responses:**

Status Code: 500 Internal Server Error
```json
{
  "success": false,
  "error": "Error message"
}
```

## Message Status Codes

The following status codes are used in the API:

| Status Code | Description |
|-------------|-------------|
| pending     | Message is queued to be sent |
| sent        | Message was sent successfully |
| delivered   | Message was delivered to the recipient |
| read        | Message was read by the recipient |
| failed      | Message failed to send |

## Error Handling

All API endpoints return standardized error responses:

```json
{
  "success": false,
  "error": "Descriptive error message"
}
```

Common error codes:

| HTTP Status Code | Description |
|------------------|-------------|
| 400              | Bad Request - Invalid parameters or missing required fields |
| 401              | Unauthorized - Invalid or missing API key |
| 403              | Forbidden - WhatsApp is not connected |
| 404              | Not Found - Resource not found |
| 429              | Too Many Requests - Rate limit exceeded |
| 500              | Internal Server Error - Server-side error |

## Webhooks (Future Feature)

In future versions, the API will support webhooks for real-time notifications about message status changes. These can be configured in the `.env` file.

## Example Code

### JavaScript (Node.js)

```javascript
const axios = require('axios');

async function sendWhatsAppMessage(phone, message) {
  try {
    const response = await axios.post('http://localhost:5000/api/send', {
      phone,
      message
    });
    
    console.log('Message sent:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error sending message:', error.response.data);
    throw error;
  }
}

// Example usage
sendWhatsAppMessage('+1234567890', 'Hello from API!')
  .then(result => console.log(result))
  .catch(err => console.error(err));
```

### Python

```python
import requests

def send_whatsapp_message(phone, message):
    try:
        response = requests.post(
            'http://localhost:5000/api/send',
            json={'phone': phone, 'message': message}
        )
        response.raise_for_status()
        return response.json()
    except requests.exceptions.RequestException as e:
        print(f"Error sending message: {e}")
        if hasattr(e, 'response') and e.response:
            print(e.response.json())
        raise

# Example usage
result = send_whatsapp_message('+1234567890', 'Hello from Python!')
print(result)
```

### cURL

```bash
# Send a message
curl -X POST http://localhost:5000/api/send \
  -H "Content-Type: application/json" \
  -d '{"phone": "+1234567890", "message": "Hello from cURL!"}'

# Check status
curl -X GET http://localhost:5000/api/status

# Get message history
curl -X GET http://localhost:5000/api/messages
```