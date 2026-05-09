import Chat from "@/components/Chat";

export default function Page() {
  return (
    <main style={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center", padding: 20, overflow: "hidden", minHeight: 0 }}>
      <div style={{
        width: "100%", maxWidth: 900,
        height: "100%", maxHeight: 700,
        background: "#fff",
        borderRadius: 16,
        border: "0.5px solid #e5e5e5",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",     
        minHeight: 0,           
      }}>
        <Chat />
      </div>
    </main>
  );
}