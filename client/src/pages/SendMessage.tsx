import { Card, CardContent } from "@/components/ui/card";
import MessageForm from "@/components/MessageForm";
import RecentMessages from "@/components/RecentMessages";
import { useQuery } from "@tanstack/react-query";
import { Message } from "@shared/schema";

export default function SendMessage() {
  const { data: messages, refetch } = useQuery<Message[]>({
    queryKey: ['/api/messages'],
  });

  const handleMessageSent = () => {
    refetch();
  };

  return (
    <Card className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Send WhatsApp Message</h2>
        <p className="mt-1 text-sm text-gray-600">Send a message to any WhatsApp number</p>
      </div>
      
      <CardContent className="p-6">
        <MessageForm onMessageSent={handleMessageSent} />
      </CardContent>
      
      <RecentMessages messages={messages || []} />
    </Card>
  );
}
