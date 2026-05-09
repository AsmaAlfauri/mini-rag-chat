"use client";

import { useState } from "react";

export default function PDFUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  async function upload() {
    if (!file) return;

    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    await fetch("/api/upload-pdf", {
      method: "POST",
      body: formData,
    });

    setLoading(false);
    alert("PDF processed 🚀");
  }

  return (
    <div className="p-4 border border-zinc-700 rounded-xl bg-zinc-900">
      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button
        onClick={upload}
        disabled={loading}
        className="mt-3 px-4 py-2 bg-blue-600 rounded-lg"
      >
        {loading ? "Processing..." : "Upload PDF"}
      </button>
    </div>
  );
}