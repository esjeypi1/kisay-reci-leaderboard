import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// A gold rank-1 chip, the leaderboard's own mark.
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
          borderRadius: 14,
          background: "#fbefc8",
          border: "4px solid #e8d394",
          color: "#7a5600",
          fontSize: 40,
          fontWeight: 700,
        }}
      >
        1
      </div>
    ),
    size,
  );
}
