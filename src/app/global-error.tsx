"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="pt-BR">
      <body style={{ background: "#0a0e17", fontFamily: "system-ui, sans-serif" }}>
        <main
          style={{
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "24px",
            textAlign: "center",
          }}
        >
          <div
            style={{
              maxWidth: "24rem",
              background: "#131a2a",
              padding: "28px",
              borderRadius: "16px",
              border: "1px solid #222c40",
            }}
          >
            <h1 style={{ fontWeight: 700, fontSize: "1.5rem", color: "#f3f5f9", margin: 0 }}>
              Sem conexão ou erro inesperado
            </h1>
            <p style={{ marginTop: "12px", color: "#ff6b7a", fontSize: "0.875rem" }}>
              Não deu pra carregar o app. Verifique sua internet e tente de novo.
            </p>
            <button
              type="button"
              onClick={() => reset()}
              style={{
                marginTop: "20px",
                fontWeight: 700,
                fontSize: "0.875rem",
                color: "#3ddc97",
                background: "none",
                border: "none",
                textDecoration: "underline",
                cursor: "pointer",
              }}
            >
              Tentar de novo
            </button>
          </div>
        </main>
      </body>
    </html>
  );
}
