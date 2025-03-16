import { Button } from "@/components/ui/button";

interface ConnectionLogsProps {
  logs: string[];
  onClear: () => void;
}

export default function ConnectionLogs({ logs, onClear }: ConnectionLogsProps) {
  return (
    <div className="px-6 py-5 border-t border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-medium text-gray-900">Connection Logs</h3>
        <Button 
          variant="ghost"
          onClick={onClear}
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Clear logs
        </Button>
      </div>
      <div className="bg-gray-50 rounded-md p-3 h-36 overflow-y-auto text-sm font-mono text-gray-600">
        {logs.length === 0 ? (
          <p>No logs yet.</p>
        ) : (
          logs.map((log, index) => (
            <p key={index}>{log}</p>
          ))
        )}
      </div>
    </div>
  );
}
