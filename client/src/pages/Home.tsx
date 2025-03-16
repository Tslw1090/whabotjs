import { useState } from "react";
import Status from "@/pages/Status";
import SendMessage from "@/pages/SendMessage";
import ApiDocs from "@/pages/ApiDocs";
import StatusIndicator from "@/components/StatusIndicator";
import { useWhatsAppStatus } from "@/hooks/useWhatsAppStatus";

export default function Home() {
  const [activeTab, setActiveTab] = useState("status");
  const { data: statusData, isLoading: statusLoading } = useWhatsAppStatus();
  
  return (
    <div className="bg-gray-50 text-gray-800 font-sans min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <header className="mb-10">
          <div className="flex items-center justify-between flex-col md:flex-row">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">WhatsApp API Client</h1>
              <p className="mt-2 text-gray-600">Powered by Baileys.js</p>
            </div>
            
            {/* Status Indicator */}
            {!statusLoading && <StatusIndicator connected={statusData?.connected || false} />}
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200 mb-8">
          <nav className="-mb-px flex space-x-8">
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); setActiveTab("status"); }}
              className={`${activeTab === "status" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"} border-b-2 py-4 px-1 text-sm font-medium`}
            >
              Status
            </a>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); setActiveTab("send"); }}
              className={`${activeTab === "send" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"} border-b-2 py-4 px-1 text-sm font-medium`}
            >
              Send Message
            </a>
            <a 
              href="#" 
              onClick={(e) => { e.preventDefault(); setActiveTab("docs"); }}
              className={`${activeTab === "docs" ? "border-primary text-primary" : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"} border-b-2 py-4 px-1 text-sm font-medium`}
            >
              API Docs
            </a>
          </nav>
        </div>

        {/* Main Content */}
        <main>
          {activeTab === "status" && <Status />}
          {activeTab === "send" && <SendMessage />}
          {activeTab === "docs" && <ApiDocs />}
        </main>
      </div>
    </div>
  );
}
