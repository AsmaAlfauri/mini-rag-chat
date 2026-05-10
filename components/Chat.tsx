"use client";
import { useState, useEffect } from "react";
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
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    function check() {
      setIsMobile(window.innerWidth <= 768);
    }

    check();
    window.addEventListener("resize", check);

    return () => window.removeEventListener("resize", check);
  }, []);

  async function sendMessage(text: string) {
    setMessages(p => [...p, { role: "user", content: text }]);
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let started = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split("\n").filter(l => l.startsWith("data: "));

        for (const line of lines) {
          const data = line.replace("data: ", "");
          if (data === "[DONE]") break;

          try {
            const parsed = JSON.parse(data);
            const token = parsed.choices?.[0]?.delta?.content ?? "";

            if (!token) continue;

            if (!started) {
              started = true;

              setMessages(p => [
                ...p,
                { role: "assistant", content: token }
              ]);
            } else {
              setMessages(p => {
                const copy = [...p];

                copy[copy.length - 1] = {
                  role: "assistant",
                  content: copy[copy.length - 1].content + token,
                };

                return copy;
              });
            }
          } catch {}
        }
      }
    } catch {
      setMessages(p => [
        ...p,
        { role: "assistant", content: "Something went wrong." }
      ]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flex: 1,
        overflow: "hidden",
        position: "relative",
        minHeight: 0,
      }}
    >
      {isMobile && (
        <button
          onClick={() => setMobileSidebarOpen(true)}
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            zIndex: 20,
            width: 38,
            height: 38,
            borderRadius: 10,
            border: "0.5px solid #e5e5e5",
            background: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            boxShadow: "0 2px 10px rgba(0,0,0,.05)",
          }}
        >
          ☰
        </button>
      )}

      {isMobile && mobileSidebarOpen && (
        <div
          onClick={() => setMobileSidebarOpen(false)}
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(0,0,0,.35)",
            zIndex: 30,
          }}
        />
      )}

      <aside
        style={{
          width: isMobile ? 280 : 230,
          flexShrink: 0,
          borderRight: "0.5px solid #e5e5e5",
          padding: "18px 14px",
          display: "flex",
          flexDirection: "column",
          gap: 20,
          overflowY: "auto",
          background: "#fff",
          position: isMobile ? "absolute" : "relative",
          left: isMobile ? (mobileSidebarOpen ? 0 : -300) : 0,
          top: 0,
          bottom: 0,
          zIndex: 40,
          transition: "left .2s ease",
        }}
      >
        {isMobile && (
          <button
            onClick={() => setMobileSidebarOpen(false)}
            style={{
              alignSelf: "flex-end",
              border: "none",
              background: "none",
              cursor: "pointer",
              fontSize: 18,
              color: "#666",
            }}
          >
            ✕
          </button>
        )}

        <FileUpload docs={docs} setDocs={setDocs} />
      </aside>

      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          minWidth: 0,
        }}
      >
        <MessageList messages={messages} loading={loading} />
        <ChatInput onSend={sendMessage} disabled={loading} />
      </div>
    </div>
  );
}