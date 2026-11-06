import { ImageResponse } from "next/og";

export const alt = "Obuolių sūris";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "linear-gradient(135deg, #2f6b3a 0%, #1d4527 100%)",
          color: "white",
        }}
      >
        <div style={{ fontSize: 28, color: "#e8b53a", letterSpacing: 4, textTransform: "uppercase" }}>
          Obuolių sūris · Lietuviška tradicija
        </div>
        <div style={{ fontSize: 96, fontWeight: 700, marginTop: 24 }}>Obuolių sūris</div>
        <div style={{ fontSize: 36, marginTop: 24, opacity: 0.9 }}>
          Gaminta neskubant, iš obuolių.
        </div>
      </div>
    ),
    size
  );
}
