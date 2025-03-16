import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface QRCodeDisplayProps {
  qrCode: string;
  onRefresh: () => void;
}

export default function QRCodeDisplay({ qrCode, onRefresh }: QRCodeDisplayProps) {
  const [timer, setTimer] = useState(60);

  useEffect(() => {
    if (!qrCode) return;
    
    setTimer(60);
    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(interval);
          onRefresh();
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [qrCode, onRefresh]);

  return (
    <div>
      <div className="flex items-center mb-6">
        <div className="w-4 h-4 rounded-full bg-danger"></div>
        <p className="ml-3 text-lg font-medium text-gray-900">Disconnected</p>
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg text-center">
        <h3 className="text-base font-medium text-gray-900 mb-4">Scan the QR code with WhatsApp</h3>
        
        <div className="qr-container mx-auto mb-4 bg-white p-4 inline-block rounded-lg">
          {qrCode ? (
            <img 
              src={`data:image/png;base64,${qrCode}`}
              alt="WhatsApp QR Code" 
              className="h-48 w-48"
            />
          ) : (
            <div className="h-48 w-48 flex items-center justify-center text-gray-400">
              Loading QR code...
            </div>
          )}
        </div>
        
        <p className="text-sm text-gray-600 mb-6">This QR code will refresh in <span className="font-medium">{timer}</span> seconds</p>
        
        <Button 
          onClick={onRefresh}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary hover:bg-blue-700"
        >
          Refresh QR Code
        </Button>
      </div>
      
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-900 mb-2">Connection Instructions:</h3>
        <ol className="list-decimal pl-5 text-sm text-gray-600 space-y-2">
          <li>Open WhatsApp on your phone</li>
          <li>Tap Menu or Settings and select WhatsApp Web</li>
          <li>Point your phone to this screen to scan the QR code</li>
        </ol>
      </div>
    </div>
  );
}
