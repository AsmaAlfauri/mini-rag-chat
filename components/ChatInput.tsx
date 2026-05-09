"use client";

import { useState } from "react";

export default function ChatInput({
  onSend,
}: {
  onSend: (text: string) => void;
}) {
  const [input, setInput] = useState("");

  function handleSend() {
    if (!input.trim()) return;

    onSend(input);
    setInput("");
  }

  return (
    <div className="p-3 border-t border-zinc-800 flex gap-2">
      <input
        className="flex-1 bg-zinc-800 text-white px-3 py-2 rounded-xl outline-none"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask something..."
      />

      <button
        onClick={handleSend}
        className="bg-blue-600 px-4 py-2 rounded-xl"
      >
        Send
      </button>
    </div>
  );
}