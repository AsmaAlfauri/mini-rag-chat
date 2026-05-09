"use client";

import { useState } from "react";
import MessageList from "./MessageList";
import ChatInput from "./ChatInput";
import PDFUpload from "./PDFUpload";


type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);

  async function sendMessage(text: string) {
    const userMessage: Message = { role: "user", content: text };

    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    const res = await fetch("/api/chat", {
      method: "POST",
      body: JSON.stringify({ message: text }),
    });

    const data = await res.json();

    const botMessage: Message = {
      role: "assistant",
      content: data.answer,
    };

    setMessages((prev) => [...prev, botMessage]);
    setLoading(false);
  }

  return (
    <div className="w-full max-w-2xl h-[80vh] flex flex-col bg-zinc-900 rounded-2xl border border-zinc-800">
      <MessageList messages={messages} loading={loading} />
      <PDFUpload/>
      <ChatInput onSend={sendMessage} />
    </div>
  );
}