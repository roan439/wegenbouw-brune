import { ImageResponse } from "next/og";

export const alt = "Wegenbouw Brune B.V. — Sterk in wegenbouw.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "#0d0e0f",
          color: "#f2f1ed",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div style={{ width: 56, height: 56, borderRadius: 12, background: "#ff6a13" }} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 36, fontWeight: 800, letterSpacing: -1 }}>BRUNE</div>
            <div style={{ fontSize: 16, letterSpacing: 4, opacity: 0.6 }}>WEGENBOUW B.V.</div>
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: -4, lineHeight: 0.95 }}>Sterk in</div>
          <div style={{ fontSize: 96, fontWeight: 800, letterSpacing: -4, lineHeight: 0.95, color: "#ff6a13" }}>
            wegenbouw.
          </div>
          <div style={{ marginTop: 28, fontSize: 28, opacity: 0.7 }}>
            Wegenbouw · Straatwerk · Grondwerk · Riolering — Geleen, Zuid-Limburg
          </div>
        </div>
        <div style={{ display: "flex", height: 6, width: "100%", gap: 18 }}>
          {Array.from({ length: 14 }).map((_, i) => (
            <div key={i} style={{ flex: 1, background: "#ff6a13", opacity: 0.85 }} />
          ))}
        </div>
      </div>
    ),
    size,
  );
}
