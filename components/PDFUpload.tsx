"use client";

import { useState } from "react";

const ACCEPTED_TYPES = ".pdf,.docx,.pptx,.xlsx,.txt";
const ACCEPTED_LABELS = "PDF, DOCX, PPTX, XLSX, TXT";

export default function FileUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    setStatus(null);
    setFile(e.target.files?.[0] || null);
  }

  async function upload() {
    if (!file) return;

    setLoading(true);
    setStatus(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/upload-pdf", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setStatus({ type: "error", message: data.error || "Upload failed" });
      } else {
        setStatus({
          type: "success",
          message: `✅ "${file.name}" processed (${data.length?.toLocaleString()} chars)`,
        });
        setFile(null);
        // reset input
        const input = document.querySelector<HTMLInputElement>("input[type=file]");
        if (input) input.value = "";
      }
    } catch (err) {
      setStatus({ type: "error", message: "Network error, please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="p-5 border border-zinc-700 rounded-xl bg-zinc-900 w-full max-w-md space-y-4">
      <h2 className="text-white font-semibold text-lg">Upload Document</h2>
      <p className="text-zinc-400 text-sm">Supported: {ACCEPTED_LABELS}</p>

      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-zinc-600 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-zinc-800 transition">
        <span className="text-zinc-400 text-sm text-center px-4">
          {file ? (
            <span className="text-white">{file.name}</span>
          ) : (
            "Click to choose a file"
          )}
        </span>
        <input
          type="file"
          accept={ACCEPTED_TYPES}
          onChange={handleFileChange}
          className="hidden"
        />
      </label>

      <button
        onClick={upload}
        disabled={!file || loading}
        className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg text-white font-medium transition"
      >
        {loading ? "Processing..." : "Upload & Process"}
      </button>

      {status && (
        <p
          className={`text-sm rounded-lg px-3 py-2 ${
            status.type === "success"
              ? "bg-green-900/40 text-green-400"
              : "bg-red-900/40 text-red-400"
          }`}
        >
          {status.message}
        </p>
      )}
    </div>
  );
}