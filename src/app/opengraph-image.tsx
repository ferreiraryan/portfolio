import { ImageResponse } from "next/og";


export const alt = "Ryan Ferreira — Tecnologia, Computação & Projetos";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          backgroundColor: "#050508",
          color: "#F5F5F7",
          fontFamily: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
          position: "relative",
        }}
      >
        {/* Fundo com efeito de vinheta e grade sutil */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.15) 0%, transparent 40%), radial-gradient(circle at 20% 80%, rgba(245, 158, 11, 0.12) 0%, transparent 45%)",
          }}
        />

        {/* Topo: Monograma + Badge de Especialização */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                borderRadius: "12px",
                backgroundColor: "#0A0D0C",
                border: "2px solid #10B981",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
                fontWeight: 900,
                color: "#10B981",
                boxShadow: "0 0 20px rgba(16, 185, 129, 0.3)",
              }}
            >
              RF
            </div>
            <span
              style={{
                fontSize: "20px",
                fontWeight: 700,
                letterSpacing: "0.08em",
                color: "#E2E8F0",
              }}
            >
              RYAN FERREIRA
            </span>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 18px",
              borderRadius: "9999px",
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.3)",
              color: "#34D399",
              fontSize: "14px",
              fontWeight: 600,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
            }}
          >
            ● CIÊNCIA DA COMPUTAÇÃO
          </div>
        </div>

        {/* Centro: Título Cinemático & Subtítulo */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "18px",
            maxWidth: "960px",
          }}
        >
          <h1
            style={{
              fontSize: "66px",
              fontWeight: 900,
              lineHeight: 1.05,
              letterSpacing: "-0.03em",
              margin: 0,
              color: "#FFFFFF",
            }}
          >
            Tecnologia, Computação & Projetos
          </h1>
          <p
            style={{
              fontSize: "26px",
              lineHeight: 1.4,
              color: "#94A3B8",
              margin: 0,
            }}
          >
            Portfólio cinematográfico em 6 mundos interativos. Software engineering,
            interfaces criativas, infraestrutura e arquitetura de sistemas.
          </p>
        </div>

        {/* Rodapé: Tags dos 6 Mundos + Link */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: "24px",
            borderTop: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          <div
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
            }}
          >
            {[
              "01 HERO",
              "02 SOBRE",
              "03 PROJETOS",
              "04 SKILLS",
              "05 ESTANTE",
              "06 CONTATO",
            ].map((tag, idx) => (
              <span
                key={idx}
                style={{
                  fontSize: "13px",
                  fontWeight: 700,
                  letterSpacing: "0.08em",
                  color: "#64748B",
                  padding: "4px 10px",
                  borderRadius: "6px",
                  backgroundColor: "rgba(255, 255, 255, 0.04)",
                  border: "1px solid rgba(255, 255, 255, 0.06)",
                }}
              >
                {tag}
              </span>
            ))}
          </div>

          <span
            style={{
              fontSize: "17px",
              fontWeight: 700,
              color: "#38BDF8",
              fontFamily: "monospace",
              letterSpacing: "0.04em",
            }}
          >
            ryanferreira.dev ↗
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
