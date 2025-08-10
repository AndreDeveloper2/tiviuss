import { ImageResponse } from "next/og";

// Route segment config
export const runtime = "edge";

// Image metadata
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = "image/png";

// Image generation
export default function Image() {
  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          color: "white",
          padding: "40px",
        }}
      >
        <div
          style={{
            fontSize: 72,
            fontWeight: "bold",
            marginBottom: "20px",
            textAlign: "center",
          }}
        >
          TIVIUS
        </div>
        <div
          style={{
            fontSize: 36,
            textAlign: "center",
            marginBottom: "30px",
            opacity: 0.9,
          }}
        >
          Streaming Premium 4K
        </div>
        <div
          style={{
            fontSize: 24,
            textAlign: "center",
            opacity: 0.8,
          }}
        >
          Sem contrato • Sem burocracia • Teste grátis
        </div>
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size metadata config to also set the ImageResponse's width and height.
      ...size,
    }
  );
}
