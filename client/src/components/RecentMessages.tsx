import { Message } from "@shared/schema";

interface RecentMessagesProps {
  messages: Message[];
}

export default function RecentMessages({ messages }: RecentMessagesProps) {
  return (
    <div className="px-6 py-5 border-t border-gray-200">
      <h3 className="text-base font-medium text-gray-900 mb-4">Recent Messages</h3>
      
      <div className="space-y-4 max-h-80 overflow-y-auto">
        {messages.length === 0 ? (
          <p className="text-sm text-gray-500">No messages sent yet.</p>
        ) : (
          messages.map((message) => (
            <div key={message.id} className="bg-gray-50 rounded-md p-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm font-medium text-gray-900">To: {message.phone}</p>
                  <p className="text-xs text-gray-500">{new Date(message.timestamp).toLocaleString()}</p>
                </div>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  message.status === 'delivered' 
                    ? 'bg-green-100 text-green-800' 
                    : message.status === 'sent' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {message.status === 'delivered' 
                    ? 'Delivered' 
                    : message.status === 'sent' 
                    ? 'Sent' 
                    : 'Pending'}
                </span>
              </div>
              <p className="mt-2 text-sm text-gray-700">{message.message}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
