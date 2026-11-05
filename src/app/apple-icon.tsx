import { ImageResponse } from "next/og";


export const size = {
  width: 180,
  height: 180,
};
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#050508",
          borderRadius: "36px",
          border: "6px solid #10B981",
          position: "relative",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Glow de fundo */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage:
              "radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.25) 0%, transparent 70%)",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "84px",
            fontWeight: 900,
            letterSpacing: "-4px",
            color: "#FFFFFF",
            textShadow: "0 0 24px rgba(16, 185, 129, 0.6)",
          }}
        >
          RF
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
