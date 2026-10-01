import { ImageResponse } from "next/og";

export const alt = "Recitation Points · 2nd Term, SY 2026-2027";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Static link preview for group chats. It carries no leaderboard data on purpose.
export default function OpengraphImage() {
  const rows = [
    { rank: "1", tint: "#fbefc8", ink: "#7a5600", width: 520 },
    { rank: "2", tint: "#d9e1ec", ink: "#27364d", width: 470 },
    { rank: "3", tint: "#f7e2d3", ink: "#7c3f16", width: 430 },
    { rank: "4", tint: "#efeff1", ink: "#5c5c66", width: 390 },
  ];
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "72px 80px",
          background: "#f6f6f7",
          color: "#18181b",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div style={{ fontSize: 84, fontWeight: 700, letterSpacing: -3, lineHeight: 1 }}>
            Recitation Points
          </div>
          <div style={{ fontSize: 38, color: "#5c5c66" }}>2nd Term, SY 2026-2027</div>
          <div style={{ display: "flex", marginTop: 28, fontSize: 28, color: "#1f4fd8", fontWeight: 600 }}>
            Overall top 20 and section top 5
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {rows.map((r) => (
            <div
              key={r.rank}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 18,
                width: r.width * 0.62,
                height: 64,
                padding: "0 14px",
                borderRadius: 12,
                background: "#fdfdfd",
                border: "2px solid #e3e3e7",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 48,
                  height: 40,
                  borderRadius: 8,
                  background: r.tint,
                  color: r.ink,
                  fontSize: 24,
                  fontWeight: 700,
                }}
              >
                {r.rank}
              </div>
              <div style={{ display: "flex", flex: 1, height: 12, borderRadius: 6, background: "#e3e3e7" }} />
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
