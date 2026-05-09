"use client";
import { useEffect, useRef } from "react";
import ChatMessage from "./ChatMessage";

export default function MessageList({ messages, loading }: { messages: any[]; loading: boolean }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const prevLengthRef = useRef(messages.length);

  useEffect(() => {

    if (messages.length > prevLengthRef.current) {
      prevLengthRef.current = messages.length;

      const el = containerRef.current;
      if (!el) return;

      // اطلع لبداية آخر رسالة مش للنهاية
      const messageElements = el.querySelectorAll("[data-message]");
      const lastMessage = messageElements[messageElements.length - 1];
      if (lastMessage) {
        lastMessage.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }
  }, [messages.length]);

  return (
    <div
      ref={containerRef}
      style={{ flex: 1, overflowY: "auto", padding: "20px 18px", display: "flex", flexDirection: "column", gap: 14 }}
    >
      {messages.map((msg, i) => (
        <div key={i} data-message>
          <ChatMessage message={msg} />
        </div>
      ))}

      {loading && (
        <div style={{ display: "flex", gap: 9, alignItems: "flex-start" }}>
          <div style={{ width: 26, height: 26, borderRadius: 8, background: "#EEEDFE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#534AB7", flexShrink: 0 }}>✦</div>
          <div style={{ padding: "10px 14px", background: "#fafaf9", border: "0.5px solid #e5e5e5", borderRadius: "3px 12px 12px 12px", display: "flex", gap: 4, alignItems: "center" }}>
            {[0, 180, 360].map(d => (
              <span key={d} style={{ width: 5, height: 5, borderRadius: "50%", background: "#ccc", display: "inline-block", animation: "pulse 1.3s ease-in-out infinite", animationDelay: `${d}ms` }} />
            ))}
          </div>
        </div>
      )}

      <style>{`@keyframes pulse{0%,80%,100%{opacity:.2}40%{opacity:1}}`}</style>
    </div>
  );
}