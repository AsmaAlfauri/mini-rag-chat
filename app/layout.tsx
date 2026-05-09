import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mini RAG Chat",
  description: "AI-powered knowledge chat using Supabase Vector DB",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full`}
    >
      <body className="h-full bg-zinc-950 text-white antialiased">
        <div className="h-full flex flex-col">
          {/* Header */}
          <header className="border-b border-zinc-800 p-4 text-center">
            <h1 className="text-lg font-semibold">
              🧠 Mini RAG Chat
            </h1>
          </header>

          {/* Main Content */}
          <main className="flex-1 flex justify-center items-center p-4">
            <div className="w-full max-w-3xl h-[80vh] bg-zinc-900 rounded-2xl border border-zinc-800 flex flex-col overflow-hidden">
              {children}
            </div>
          </main>
        </div>
      </body>
    </html>
  );
}