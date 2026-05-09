"use client";
import { useState } from "react";

export default function ChatInput({ onSend, disabled }: { onSend: (t: string) => void; disabled?: boolean }) {
  const [input, setInput] = useState("");
  const canSend = input.trim().length > 0 && !disabled;

  function send() { if (!canSend) return; onSend(input.trim()); setInput(""); }

  return (
    <div style={{ padding: "12px 14px", borderTop: "0.5px solid #e5e5e5", display: "flex", gap: 8, alignItems: "flex-end" }}>
      <div style={{
        flex: 1, display: "flex", alignItems: "center",
        border: "0.5px solid #d4d4d4", borderRadius: 10,
        padding: "8px 11px", gap: 7, background: "#fff",
        transition: "border-color .15s",
      }}
        onFocus={e => (e.currentTarget.style.borderColor = "#7F77DD")}
        onBlur={e => (e.currentTarget.style.borderColor = "#d4d4d4")}
      >
        <textarea
          rows={1}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); } }}
          placeholder="Ask something about your documents…"
          style={{ flex: 1, background: "none", border: "none", outline: "none", fontSize: 13, color: "#1a1a1a", resize: "none", lineHeight: 1.5, fontFamily: "inherit" }}
        />
      </div>
      <button
        onClick={send}
        disabled={!canSend}
        style={{
          width: 34, height: 34, border: "none", borderRadius: 9,
          background: canSend ? "#534AB7" : "#e5e5e5",
          cursor: canSend ? "pointer" : "not-allowed",
          display: "flex", alignItems: "center", justifyContent: "center",
          flexShrink: 0, transition: "background .15s",
        }}
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={canSend ? "#EEEDFE" : "#bbb"} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>
        </svg>
      </button>
    </div>
  );
}