import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  Img,
  Video,
  staticFile,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Hind";
import { todayData } from "./data";

const { fontFamily: HIND } = loadFont("normal", {
  weights: ["700"],
  subsets: ["devanagari", "latin"],
});

const ACCENT = todayData.accent;

// ─── Background ───────────────────────────────────────────────────────────────
function Background() {
  return (
    <AbsoluteFill style={{ background: "#0A0A0F" }}>
      <Img
        src={todayData.bg}
        style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.38 }}
      />
      {/* Vignette */}
      <AbsoluteFill style={{
        background: "radial-gradient(ellipse 85% 85% at 50% 50%, transparent 35%, rgba(0,0,0,0.72) 100%)",
      }} />
      {/* Bottom gradient — keeps captions readable */}
      <AbsoluteFill style={{
        background: "linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.55) 28%, transparent 50%)",
      }} />
      {/* Top gradient — keeps branding readable */}
      <AbsoluteFill style={{
        background: "linear-gradient(to bottom, rgba(0,0,0,0.75) 0%, transparent 22%)",
      }} />
    </AbsoluteFill>
  );
}

// ─── Branding bar ─────────────────────────────────────────────────────────────
function Branding() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = interpolate(Math.sin((frame / fps) * Math.PI * 2), [-1, 1], [0.5, 1]);
  return (
    <div style={{
      position: "absolute", top: 0, left: 0, right: 0,
      padding: "58px 68px 0",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      zIndex: 10,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{
          width: 13, height: 13, borderRadius: "50%",
          background: ACCENT, boxShadow: `0 0 18px ${ACCENT}`,
          opacity: pulse,
        }} />
        <span style={{
          color: ACCENT, fontSize: 28, fontWeight: 700,
          letterSpacing: 4, fontFamily: HIND,
          textShadow: `0 0 24px ${ACCENT}66`,
        }}>MARKET BRIEF</span>
      </div>
      <span style={{
        color: "rgba(255,255,255,0.65)", fontSize: 25, fontWeight: 700,
        fontFamily: HIND, letterSpacing: 1,
      }}>{todayData.date}</span>
    </div>
  );
}

// ─── Word-pop captions ────────────────────────────────────────────────────────
function CaptionLayer() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Last-wins: if two captions overlap the more-recent one takes over
  const cap = [...todayData.captions].reverse().find(
    (c) => frame >= c.from && frame < c.from + c.dur
  );
  if (!cap) return null;

  const local = frame - cap.from;
  const pop = spring({
    frame: local, fps,
    config: { damping: 8, stiffness: 340, mass: 0.45 },
    durationInFrames: 10,
  });
  const opacity = interpolate(local, [0, 5], [0, 1], { extrapolateRight: "clamp" });
  const scale = interpolate(pop, [0, 1], [0.65, 1]);

  return (
    <div style={{
      position: "absolute", bottom: 150, left: 0, right: 0,
      display: "flex", justifyContent: "center",
      padding: "0 64px",
      zIndex: 200, pointerEvents: "none",
    }}>
      <div style={{
        opacity,
        transform: `scale(${scale})`,
        fontSize: 86,
        fontWeight: 700,
        fontFamily: HIND,
        color: "#FFFFFF",
        textAlign: "center",
        lineHeight: 1.18,
        textShadow: [
          "4px  4px 0 #000",
          "-4px -4px 0 #000",
          "4px -4px 0 #000",
          "-4px  4px 0 #000",
          "0    5px 0 #000",
          "0   -5px 0 #000",
          "5px  0   0 #000",
          "-5px 0   0 #000",
          "0 0 32px rgba(0,0,0,0.95)",
        ].join(", "),
      }}>
        {cap.text}
      </div>
    </div>
  );
}

// ─── Animated chart (floating glass card) ────────────────────────────────────
function ChartOverlay() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chart = todayData.chart;
  if (!chart) return null;

  const local = frame - chart.from;
  if (local < 0 || local >= chart.dur) return null;

  const fadeOpacity = interpolate(
    local,
    [0, 20, chart.dur - 20, chart.dur],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );

  const drawProgress = spring({
    frame: local - 10, fps,
    config: { damping: 40, stiffness: 35, mass: 1 },
    durationInFrames: 90,
  });

  const W = 360, H = 150, PX = 12, PY = 14;
  const data = chart.data;
  const min = Math.min(...data) * 0.998;
  const max = Math.max(...data) * 1.002;
  const toX = (i: number) => PX + (i / (data.length - 1)) * (W - PX * 2);
  const toY = (v: number) => H - PY - ((v - min) / (max - min)) * (H - PY * 2);

  const totalSeg = data.length - 1;
  const prog = drawProgress * totalSeg;
  const completed = Math.floor(prog);
  const frac = prog - completed;
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i <= Math.min(completed, data.length - 1); i++) {
    pts.push({ x: toX(i), y: toY(data[i]) });
  }
  if (completed < totalSeg) {
    const ax = toX(completed), ay = toY(data[completed]);
    const bx = toX(completed + 1), by = toY(data[completed + 1]);
    pts.push({ x: ax + frac * (bx - ax), y: ay + frac * (by - ay) });
  }
  if (pts.length < 2) return null;

  const pathD = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const last = pts[pts.length - 1];
  const isUp = data[data.length - 1] >= data[0];
  const lineColor = isUp ? "#00FF94" : "#FF4455";
  const areaD = `${pathD} L${last.x},${H - PY} L${pts[0].x},${H - PY} Z`;

  return (
    <div style={{
      position: "absolute", left: 40, bottom: 260,
      opacity: fadeOpacity, zIndex: 50,
      background: "rgba(8,8,18,0.80)",
      backdropFilter: "blur(18px)",
      borderRadius: 22,
      border: "1px solid rgba(255,255,255,0.10)",
      padding: "18px 20px 10px",
      width: W + 40,
    }}>
      <div style={{
        color: "rgba(255,255,255,0.55)", fontSize: 17,
        fontFamily: HIND, fontWeight: 700,
        letterSpacing: 0.5, marginBottom: 8,
      }}>{chart.title}</div>
      <svg width={W} height={H + 24} viewBox={`0 0 ${W} ${H + 24}`} style={{ overflow: "visible" }}>
        {[0.25, 0.5, 0.75].map((t, i) => (
          <line key={i}
            x1={PX} y1={PY + t * (H - PY * 2)}
            x2={W - PX} y2={PY + t * (H - PY * 2)}
            stroke="rgba(255,255,255,0.07)" strokeWidth={1}
          />
        ))}
        <path d={areaD} fill={`${lineColor}20`} />
        <path d={pathD} fill="none" stroke={lineColor} strokeWidth={3.5}
          strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={last.x} cy={last.y} r={7} fill={lineColor}
          style={{ filter: `drop-shadow(0 0 10px ${lineColor})` }} />
        {chart.labels.map((label, i) => (
          <text key={i} x={toX(i)} y={H + 20} textAnchor="middle"
            fill="rgba(255,255,255,0.45)" fontSize={15} fontFamily={HIND}>{label}</text>
        ))}
        <text x={W - PX - 4} y={toY(data[data.length - 1]) - 10}
          textAnchor="end" fill={lineColor}
          fontSize={17} fontWeight="bold" fontFamily={HIND}
        >{data[data.length - 1]}</text>
      </svg>
    </div>
  );
}

// ─── Local MP4 assets (GIFs converted) ───────────────────────────────────────
type AssetPos = "tr" | "bl" | "br" | "center";

function AssetItem({ asset }: { asset: { file: string; dur: number; size: number; pos: AssetPos } }) {
  const frame = useCurrentFrame(); // 0-based inside Sequence
  const { fps } = useVideoConfig();

  const fadeOpacity = interpolate(
    frame,
    [0, 8, asset.dur - 8, asset.dur],
    [0, 1, 1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const popVal = spring({ frame, fps, config: { damping: 12, stiffness: 180 }, durationInFrames: 14 });
  const scale = interpolate(popVal, [0, 1], [0.65, 1]);

  const base: React.CSSProperties = {
    position: "absolute",
    width: asset.size, height: asset.size,
    opacity: fadeOpacity, zIndex: 100,
    borderRadius: 18, overflow: "hidden",
    boxShadow: "0 10px 50px rgba(0,0,0,0.6)",
  };

  const posStyle: React.CSSProperties =
    asset.pos === "center"
      ? { ...base, top: "50%", left: "50%", transform: `translate(-50%, -50%) scale(${scale})` }
      : asset.pos === "tr"
      ? { ...base, top: 170, right: 56, transform: `scale(${scale})`, transformOrigin: "top right" }
      : asset.pos === "br"
      ? { ...base, bottom: 290, right: 56, transform: `scale(${scale})`, transformOrigin: "bottom right" }
      : { ...base, top: 170, left: 56, transform: `scale(${scale})`, transformOrigin: "top left" };

  return (
    <div style={posStyle}>
      <Video
        src={staticFile(asset.file)}
        style={{ width: "100%", height: "100%", objectFit: "cover" }}
        muted
      />
    </div>
  );
}

function AssetLayer() {
  if (!todayData.assets?.length) return null;
  return (
    <>
      {todayData.assets.map((asset, i) => (
        <Sequence key={i} from={asset.from} durationInFrames={asset.dur} layout="none">
          <AssetItem asset={asset} />
        </Sequence>
      ))}
    </>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export function MarketReel() {
  return (
    <AbsoluteFill style={{ background: "#0A0A0F", fontFamily: HIND }}>
      <Background />
      <Branding />
      <ChartOverlay />
      <AssetLayer />
      <CaptionLayer />
    </AbsoluteFill>
  );
}
