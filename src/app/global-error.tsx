"use client";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <html lang="pt-BR">
      <body style={{ background: "#ada58f", fontFamily: "system-ui, sans-serif" }}>
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
          <div style={{ maxWidth: "24rem", background: "#f2f0ea", padding: "28px", border: "2px dashed #c9463c" }}>
            <h1 style={{ fontWeight: 700, fontSize: "1.5rem", color: "#22201c", margin: 0 }}>
              Sem conexão ou erro inesperado
            </h1>
            <p style={{ marginTop: "12px", color: "#c9463c", fontSize: "0.875rem" }}>
              Não deu pra carregar o app. Verifique sua internet e tente de novo.
            </p>
            <button
              type="button"
              onClick={() => reset()}
              style={{
                marginTop: "20px",
                fontWeight: 700,
                textTransform: "uppercase",
                fontSize: "0.875rem",
                color: "#2c5340",
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
