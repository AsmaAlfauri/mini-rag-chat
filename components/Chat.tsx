"use client";
import { useState } from "react";
import FileUpload from "./FileUpload";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";

type Message = { role: "user" | "assistant"; content: string };
export type Doc = { name: string; sizeLabel: string; chars: number };

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "Hello! Upload your documents and ask me anything about them." }
  ]);
  const [loading, setLoading] = useState(false);
  const [docs, setDocs] = useState<Doc[]>([]);

  async function sendMessage(text: string) {
    setMessages(p => [...p, { role: "user", content: text }]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setMessages(p => [...p, { role: "assistant", content: data.answer }]);
    } catch {
      setMessages(p => [...p, { role: "assistant", content: "Something went wrong. Please try again." }]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
      <aside style={{
        width: 230, flexShrink: 0,
        borderRight: "0.5px solid #e5e5e5",
        padding: "18px 14px",
        display: "flex", flexDirection: "column", gap: 20,
        overflowY: "auto",
      }}>
        <FileUpload docs={docs} setDocs={setDocs} />
      </aside>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <MessageList messages={messages} loading={loading} />
        <ChatInput onSend={sendMessage} disabled={loading} />
      </div>
    </div>
  );
}