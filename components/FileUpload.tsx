"use client";
import { useState, useRef } from "react";
import type { Doc } from "./Chat";

const ACCEPTED = ".pdf,.docx,.pptx,.xlsx,.txt";

const EXT_STYLE: Record<string, { bg: string; color: string }> = {
  pdf:  { bg: "#FAECE7", color: "#993C1D" },
  docx: { bg: "#E6F1FB", color: "#185FA5" },
  xlsx: { bg: "#EAF3DE", color: "#3B6D11" },
  pptx: { bg: "#FAEEDA", color: "#854F0B" },
  txt:  { bg: "#F1EFE8", color: "#5F5E5A" },
};

function getExt(name: string) { return name.split(".").pop()?.toLowerCase() ?? "txt"; }
function fmtSize(b: number) { return b < 1048576 ? `${Math.round(b / 1024)} KB` : `${(b / 1048576).toFixed(1)} MB`; }

export default function FileUpload({ docs, setDocs }: { docs: Doc[]; setDocs: React.Dispatch<React.SetStateAction<Doc[]>> }) {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleFile(f: File) { setError(null); setFile(f); }

  async function upload() {
    if (!file) return;
    setLoading(true); setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/upload-pdf", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) { setError(data.error ?? "Upload failed"); }
      else {
        setDocs(p => [...p, { name: file.name, sizeLabel: fmtSize(file.size), chars: data.length }]);
        setFile(null);
        if (inputRef.current) inputRef.current.value = "";
      }
    } catch { setError("Network error, please try again."); }
    finally { setLoading(false); }
  }

  const labelStyle: React.CSSProperties = {
    border: `1.5px dashed ${dragOver ? "#7F77DD" : "#d4d4d4"}`,
    background: dragOver ? "#EEEDFE22" : "transparent",
    borderRadius: "var(--radius-lg)",
    padding: "18px 12px",
    display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
    cursor: "pointer", transition: "all .15s", textAlign: "center",
  };

  return (
    <>
      <div>
        <p style={{ fontSize: 10, fontWeight: 500, color: "#999", letterSpacing: ".07em", textTransform: "uppercase", marginBottom: 10 }}>
          Upload
        </p>
        <label
          style={labelStyle}
          onDragOver={e => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => { e.preventDefault(); setDragOver(false); const f = e.dataTransfer.files[0]; if (f) handleFile(f); }}
        >
          <span style={{ fontSize: 20 }}>⬆️</span>
          <span style={{ fontSize: 11, color: "#666", lineHeight: 1.5 }}>
            {file ? <strong style={{ color: "#1a1a1a" }}>{file.name}</strong> : <>Drop a file or <span style={{ color: "#534AB7" }}>browse</span></>}
          </span>
          <span style={{ fontSize: 10, color: "#aaa" }}>PDF · DOCX · XLSX · PPTX · TXT</span>
          <input ref={inputRef} type="file" accept={ACCEPTED} onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} style={{ display: "none" }} />
        </label>

        <button
          onClick={upload}
          disabled={!file || loading}
          style={{
            width: "100%", marginTop: 8, padding: "7px 0",
            background: file && !loading ? "#534AB7" : "#e5e5e5",
            color: file && !loading ? "#EEEDFE" : "#aaa",
            border: "none", borderRadius: "var(--radius-md)",
            fontSize: 12, fontWeight: 500, cursor: file && !loading ? "pointer" : "not-allowed",
            transition: "all .15s",
          }}
        >
          {loading ? "Processing…" : "Upload & process"}
        </button>

        {error && (
          <p style={{ marginTop: 8, fontSize: 11, color: "#A32D2D", background: "#FCEBEB", border: "0.5px solid #F09595", borderRadius: "var(--radius-md)", padding: "6px 10px" }}>
            {error}
          </p>
        )}
      </div>

      {docs.length > 0 && (
        <div>
          <p style={{ fontSize: 10, fontWeight: 500, color: "#999", letterSpacing: ".07em", textTransform: "uppercase", marginBottom: 10 }}>
            Indexed · {docs.length}
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {docs.map((doc, i) => {
              const ext = getExt(doc.name);
              const style = EXT_STYLE[ext] ?? EXT_STYLE.txt;
              return (
                <div key={i} style={{ display: "flex", alignItems: "center", gap: 9, padding: "7px 10px", border: "0.5px solid #e5e5e5", borderRadius: "var(--radius-md)", background: "#fafaf9" }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: style.bg, color: style.color, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600, flexShrink: 0 }}>
                    {ext.toUpperCase().slice(0, 3)}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 11, fontWeight: 500, color: "#1a1a1a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{doc.name}</p>
                    <p style={{ fontSize: 10, color: "#aaa" }}>{doc.sizeLabel} · {doc.chars.toLocaleString()} chars</p>
                  </div>
                  <div style={{ width: 5, height: 5, background: "#1D9E75", borderRadius: "50%", flexShrink: 0 }} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}