interface StatusIndicatorProps {
  connected: boolean;
}

export default function StatusIndicator({ connected }: StatusIndicatorProps) {
  return (
    <div className="hidden md:flex items-center px-4 py-2 rounded-full bg-gray-100 mt-4 md:mt-0">
      <div className={`w-3 h-3 rounded-full ${connected ? 'bg-success' : 'bg-danger'}`}></div>
      <span className="ml-2 text-sm font-medium">{connected ? 'Connected' : 'Disconnected'}</span>
    </div>
  );
}
