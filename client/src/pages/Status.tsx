import { useState } from "react";
import QRCodeDisplay from "@/components/QRCodeDisplay";
import ConnectionLogs from "@/components/ConnectionLogs";
import { useWhatsAppStatus } from "@/hooks/useWhatsAppStatus";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Status() {
  const { toast } = useToast();
  const { data: statusData, refetch, isLoading } = useWhatsAppStatus();
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    const now = new Date();
    const timestamp = now.toISOString().substr(0, 19).replace('T', ' ');
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const handleDisconnect = async () => {
    try {
      await apiRequest('POST', '/api/disconnect', {});
      toast({
        title: "Disconnected",
        description: "Successfully disconnected from WhatsApp",
      });
      addLog("Manually disconnected from WhatsApp");
      refetch();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to disconnect from WhatsApp",
        variant: "destructive",
      });
    }
  };

  const clearLogs = () => {
    setLogs([]);
    addLog("Logs cleared");
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <p>Loading status...</p>
      </div>
    );
  }

  return (
    <Card className="bg-white shadow rounded-lg overflow-hidden">
      <div className="px-6 py-5 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Connection Status</h2>
        <p className="mt-1 text-sm text-gray-600">Check if your WhatsApp client is connected</p>
      </div>
      
      <CardContent className="p-6">
        {statusData?.connected ? (
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-success"></div>
                <p className="ml-3 text-lg font-medium text-gray-900">Connected to WhatsApp</p>
              </div>
              <Button
                onClick={handleDisconnect}
                variant="outline"
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Disconnect
              </Button>
            </div>
            
            <div className="mt-6 bg-gray-50 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-success" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-gray-800">Client Information</h3>
                  <div className="mt-2 text-sm text-gray-600">
                    <div>
                      <p><span className="font-medium">Name:</span> {statusData?.clientInfo?.name || "N/A"}</p>
                      <p><span className="font-medium">Phone:</span> {statusData?.clientInfo?.phone || "N/A"}</p>
                      <p><span className="font-medium">Device:</span> {statusData?.clientInfo?.device || "N/A"}</p>
                      <p><span className="font-medium">Connected since:</span> {new Date(statusData?.clientInfo?.connectedSince || "").toLocaleString() || "N/A"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <QRCodeDisplay 
            qrCode={statusData?.qrCode || ""}
            onRefresh={() => {
              refetch();
              addLog("Manually refreshing QR code");
            }}
          />
        )}
      </CardContent>
      
      <ConnectionLogs logs={logs} onClear={clearLogs} />
    </Card>
  );
}
