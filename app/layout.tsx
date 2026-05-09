import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Mini RAG Chat",
  description: "AI-powered document Q&A using Supabase Vector DB",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" style={{ height: "100%" }}>
      <body style={{ height: "100%", display: "flex", flexDirection: "column", background: "#f5f5f4" }}>
        <header style={{
          padding: "13px 24px",
          background: "#fff",
          borderBottom: "0.5px solid #e5e5e5",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flexShrink: 0,
        }}>
          <div style={{ width: 26, height: 26, background: "#534AB7", borderRadius: 7, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 13 }}>🧠</span>
          </div>
          <span style={{ fontSize: 14, fontWeight: 500, color: "#1a1a1a" }}>
            Mini RAG <span style={{ color: "#999", fontWeight: 400 }}>/ chat</span>
          </span>
        </header>
        {children}
      </body>
    </html>
  );
}