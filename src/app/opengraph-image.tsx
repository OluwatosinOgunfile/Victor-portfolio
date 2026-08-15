import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(<div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "center", padding: 80, color: "white", background: "linear-gradient(135deg,#070b12,#101c31 65%,#40267a)", fontFamily: "sans-serif" }}><div style={{ display: "flex", alignItems: "center", gap: 24, fontSize: 34, fontWeight: 800 }}><span style={{ width: 66, height: 66, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", background: "linear-gradient(135deg,#318cff,#8559ed)" }}>N</span>Navill Tech</div><div style={{ fontSize: 72, lineHeight: 1.05, fontWeight: 800, marginTop: 55, maxWidth: 950 }}>Business systems that create momentum.</div><div style={{ fontSize: 25, color: "#a9b9ce", marginTop: 30 }}>Custom web applications · Automation · AI integrations</div></div>);
}
