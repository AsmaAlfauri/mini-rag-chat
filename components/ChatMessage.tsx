export default function ChatMessage({ message }: { message: { role: string; content: string } }) {
  const isUser = message.role === "user";
  return (
    <div style={{ display: "flex", gap: 9, alignItems: "flex-start", flexDirection: isUser ? "row-reverse" : "row" }}>
      <div style={{
        width: 26, height: 26, borderRadius: 8, flexShrink: 0,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 11, fontWeight: 500,
        background: isUser ? "#f5f5f4" : "#EEEDFE",
        color: isUser ? "#888" : "#534AB7",
        border: isUser ? "0.5px solid #e5e5e5" : "none",
      }}>
        {isUser ? "You" : "✦"}
      </div>
      <div style={{
        padding: "9px 13px",
        borderRadius: isUser ? "12px 3px 12px 12px" : "3px 12px 12px 12px",
        fontSize: 13, lineHeight: 1.65,
        maxWidth: "78%",
        background: isUser ? "#534AB7" : "#fafaf9",
        color: isUser ? "#EEEDFE" : "#1a1a1a",
        border: isUser ? "none" : "0.5px solid #e5e5e5",
      }}>
        {message.content}
      </div>
    </div>
  );
}