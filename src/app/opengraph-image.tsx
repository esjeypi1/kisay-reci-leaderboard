import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { ROSTER } from "@/db/roster";

export const alt = "Recitation Points · 2nd Term, SY 2026-2027";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const fontDir = join(process.cwd(), "src/assets/fonts");

// Satori sets Geist's word spaces too wide, so words are laid out with an explicit gap.
function Words({ text, gap }: { text: string; gap: number }) {
  return (
    <div style={{ display: "flex", gap }}>
      {text.split(" ").map((w, i) => (
        <span key={i}>{w}</span>
      ))}
    </div>
  );
}

// Static link preview for group chats. It carries no leaderboard data on purpose.
export default async function OpengraphImage() {
  const [regular, semibold] = await Promise.all([
    readFile(join(fontDir, "Geist-Regular.ttf")),
    readFile(join(fontDir, "Geist-SemiBold.ttf")),
  ]);
  const grades = [9, 10].map((g) => ROSTER.filter((s) => s.gradeLevel === g).map((s) => s.name));

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px 88px",
          background: "#f6f6f7",
          color: "#18181b",
          fontFamily: "Geist",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", fontSize: 96, fontWeight: 600, letterSpacing: -3.5, lineHeight: 1 }}>
            <Words text="Recitation Points" gap={8} />
          </div>
          <div style={{ display: "flex", marginTop: 22, fontSize: 40, color: "#5c5c66" }}>
            <Words text="2nd Term, SY 2026-2027" gap={10} />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "flex", fontSize: 30, fontWeight: 600, color: "#1f4fd8" }}>
            <Words text="Overall top 20 and the top 5 of each section" gap={8} />
          </div>
          {grades.map((names, i) => (
            <div key={i} style={{ display: "flex", gap: 14 }}>
              {names.map((name) => (
                <div
                  key={name}
                  style={{
                    display: "flex",
                    padding: "12px 22px",
                    borderRadius: 12,
                    background: "#fdfdfd",
                    border: "2px solid #e3e3e7",
                    fontSize: 30,
                    fontWeight: 600,
                  }}
                >
                  {name}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
      fonts: [
        { name: "Geist", data: regular, weight: 400, style: "normal" },
        { name: "Geist", data: semibold, weight: 600, style: "normal" },
      ],
    },
  );
}
