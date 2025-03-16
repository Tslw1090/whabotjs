import { Card, CardContent } from "@/components/ui/card";

export default function ApiDocs() {
  return (
    <Card className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">API Documentation</h2>
        <p className="mt-1 text-sm text-gray-600">How to use the WhatsApp API endpoints</p>
      </div>
      
      <CardContent className="p-6 space-y-8">
        {/* Status Endpoint Docs */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Status Endpoint</h3>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex items-center">
              <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-md">GET</span>
              <code className="ml-2 text-sm font-mono text-gray-800">/api/status</code>
            </div>
            
            <p className="mt-2 text-sm text-gray-600">Get the current connection status of the WhatsApp client</p>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Example Response:</h4>
              <pre className="bg-gray-800 text-gray-100 p-3 rounded-md text-xs overflow-x-auto">
{`{
  "success": true,
  "connected": true,
  "clientInfo": {
    "name": "John Doe",
    "phone": "+1234567890",
    "device": "Samsung Galaxy S21",
    "connectedSince": "2023-10-15T14:30:00Z"
  }
}`}
              </pre>
            </div>
          </div>
        </div>
        
        {/* Send Endpoint Docs */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Send Message Endpoint</h3>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <div className="flex items-center">
              <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-md">POST</span>
              <code className="ml-2 text-sm font-mono text-gray-800">/api/send</code>
            </div>
            
            <p className="mt-2 text-sm text-gray-600">Send a WhatsApp message to a specified phone number</p>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Request Parameters:</h4>
              <div className="border border-gray-200 rounded-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parameter</th>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Required</th>
                      <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 text-xs">
                    <tr>
                      <td className="px-4 py-2 font-mono">phone</td>
                      <td className="px-4 py-2">String</td>
                      <td className="px-4 py-2">Yes</td>
                      <td className="px-4 py-2">Recipient phone number with country code</td>
                    </tr>
                    <tr>
                      <td className="px-4 py-2 font-mono">message</td>
                      <td className="px-4 py-2">String</td>
                      <td className="px-4 py-2">Yes</td>
                      <td className="px-4 py-2">Message content to send</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Example Request:</h4>
              <pre className="bg-gray-800 text-gray-100 p-3 rounded-md text-xs overflow-x-auto">
{`curl -X POST http://your-server/api/send \\
  -H "Content-Type: application/json" \\
  -d '{
    "phone": "+1234567890",
    "message": "Hello from WhatsApp API"
  }'`}
              </pre>
            </div>
            
            <div className="mt-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Example Response:</h4>
              <pre className="bg-gray-800 text-gray-100 p-3 rounded-md text-xs overflow-x-auto">
{`{
  "success": true,
  "messageId": "ABCDEF123456",
  "status": "sent",
  "timestamp": "2023-10-15T15:30:00Z"
}`}
              </pre>
            </div>
          </div>
        </div>
        
        {/* Error Handling Docs */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Error Handling</h3>
          
          <div className="bg-gray-50 p-4 rounded-md">
            <p className="text-sm text-gray-600 mb-4">All API endpoints return proper error codes and messages in case of failure</p>
            
            <div className="border border-gray-200 rounded-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-100">
                  <tr>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status Code</th>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th scope="col" className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Example</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 text-xs">
                  <tr>
                    <td className="px-4 py-2">400</td>
                    <td className="px-4 py-2">Bad Request - Invalid parameters</td>
                    <td className="px-4 py-2 font-mono">{"{"}"success": false, "error": "Invalid phone number format"{"}"}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2">500</td>
                    <td className="px-4 py-2">Server Error - Something went wrong</td>
                    <td className="px-4 py-2 font-mono">{"{"}"success": false, "error": "WhatsApp connection failed"{"}"}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* API Usage Examples */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">API Usage Examples</h3>
          
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Node.js Example:</h4>
              <pre className="bg-gray-800 text-gray-100 p-3 rounded-md text-xs overflow-x-auto">
{`const axios = require('axios');

// Send a message
async function sendWhatsAppMessage() {
  try {
    const response = await axios.post('http://your-server/api/send', {
      phone: '+1234567890',
      message: 'Hello from Node.js!'
    });
    console.log('Message sent:', response.data);
  } catch (error) {
    console.error('Error sending message:', error.response?.data || error.message);
  }
}

// Check connection status
async function checkStatus() {
  try {
    const response = await axios.get('http://your-server/api/status');
    console.log('WhatsApp status:', response.data);
  } catch (error) {
    console.error('Error checking status:', error.response?.data || error.message);
  }
}`}
              </pre>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-md">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Python Example:</h4>
              <pre className="bg-gray-800 text-gray-100 p-3 rounded-md text-xs overflow-x-auto">
{`import requests

# Send a message
def send_whatsapp_message():
    try:
        response = requests.post('http://your-server/api/send', json={
            'phone': '+1234567890',
            'message': 'Hello from Python!'
        })
        response.raise_for_status()
        print('Message sent:', response.json())
    except requests.exceptions.RequestException as e:
        print('Error sending message:', e)

# Check connection status
def check_status():
    try:
        response = requests.get('http://your-server/api/status')
        response.raise_for_status()
        print('WhatsApp status:', response.json())
    except requests.exceptions.RequestException as e:
        print('Error checking status:', e)
`}
              </pre>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
