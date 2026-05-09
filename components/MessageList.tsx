import ChatMessage from "./ChatMessage";


export default function MessageList({
  messages,
  loading,
}: {
  messages: any[];
  loading: boolean;
}) {
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((msg, i) => (
        <ChatMessage key={i} message={msg} />
      ))}

      {loading && (
        <div className="text-sm text-zinc-400">Thinking...</div>
      )}
    </div>
  );
}