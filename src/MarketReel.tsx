import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
  Img,
  OffthreadVideo,
} from "remotion";
import { loadFont } from "@remotion/google-fonts/Hind";
import { todayData } from "./data";

// Load Hind — supports Hindi (Devanagari) + Latin (Hinglish)
const { fontFamily: HIND } = loadFont("normal", {
  weights: ["700", "800"],
  subsets: ["devanagari", "latin"],
});

// ─── Theme ───────────────────────────────────────────────────────────────────
const THEMES = {
  bullish:  { accent: "#00FF94", glow: "#00FF9412", warnBg: "#001a0e" },
  bearish:  { accent: "#FF4455", glow: "#FF445512", warnBg: "#1a0007" },
  volatile: { accent: "#FFB800", glow: "#FFB80012", warnBg: "#1a1100" },
  breaking: { accent: "#FF6B35", glow: "#FF6B3512", warnBg: "#1a0900" },
} as const;

const BG    = "#0A0A0F";
const TEXT  = "#FFFFFF";
const MUTED = "#6a6a88";
const { accent: ACCENT, glow: GLOW, warnBg: WARN_BG } = THEMES[todayData.theme] ?? THEMES.bullish;

// ─── Scene timing (45s = 1350 frames @ 30fps) ────────────────────────────────
const HOOK_FROM = 0,    HOOK_DUR  = 240;  // 8s
const HEAD_FROM = 240,  HEAD_DUR  = 330;  // 11s
const B1_FROM   = 570,  B_DUR     = 300;  // 10s each
const B2_FROM   = 870;
const B3_FROM   = 1170;
const WARN_FROM = 1470, WARN_DUR  = 390;  // 13s
const CTA_FROM  = 1860, CTA_DUR   = 240;  // 8s

// ─── Helpers ─────────────────────────────────────────────────────────────────
function useEntrance(delay = 0) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const progress = spring({ frame: frame - delay, fps, config: { damping: 18, stiffness: 100, mass: 0.9 }, durationInFrames: 22 });
  const opacity  = interpolate(frame - delay, [0, 12], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
  return { progress, opacity };
}

function fadeIn(frame: number, delay = 0, dur = 12) {
  return interpolate(frame - delay, [0, dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

// ─── Subtitle overlay (word-pop style) ───────────────────────────────────────
function SubtitleOverlay() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const sub = todayData.subtitles?.find(
    (s) => frame >= s.from && frame < s.from + s.durationInFrames
  );

  if (!sub) return null;

  const local = frame - sub.from;
  const pop = spring({ frame: local, fps, config: { damping: 10, stiffness: 280, mass: 0.4 }, durationInFrames: 8 });
  const opacity = interpolate(local, [0, 4], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div style={{
      position: "absolute", bottom: 160, left: 0, right: 0,
      display: "flex", justifyContent: "center", padding: "0 60px",
      zIndex: 200, pointerEvents: "none",
    }}>
      <div style={{
        opacity,
        transform: `scale(${interpolate(pop, [0, 1], [0.75, 1])})`,
        fontSize: 74,
        fontWeight: 800,
        fontFamily: HIND,
        color: "#FFFFFF",
        textAlign: "center",
        lineHeight: 1.2,
        // Thick black outline for readability over any background
        textShadow: [
          "3px 3px 0 #000",
          "-3px -3px 0 #000",
          "3px -3px 0 #000",
          "-3px 3px 0 #000",
          "0 0 30px rgba(0,0,0,0.9)",
        ].join(", "),
      }}>
        {sub.text}
      </div>
    </div>
  );
}

// ─── GIF inserts ─────────────────────────────────────────────────────────────
function GifInserts() {
  const frame = useCurrentFrame();
  if (!todayData.gifs?.length) return null;

  return (
    <>
      {todayData.gifs.map((gif, i) => {
        const local = frame - gif.from;
        if (local < 0 || local >= gif.durationInFrames) return null;

        const opacity = interpolate(
          local,
          [0, 8, gif.durationInFrames - 8, gif.durationInFrames],
          [0, 1, 1, 0],
          { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
        );
        const scale = spring({ frame: local, fps: 30, config: { damping: 12, stiffness: 180 }, durationInFrames: 12 });

        const posStyle: React.CSSProperties = gif.position === "center"
          ? { top: "50%", left: "50%", transform: `translate(-50%, -50%) scale(${scale})` }
          : gif.position === "top-right"
          ? { top: 160, right: 60, transform: `scale(${scale})`, transformOrigin: "top right" }
          : gif.position === "bottom-right"
          ? { bottom: 160, right: 60, transform: `scale(${scale})`, transformOrigin: "bottom right" }
          : { top: 160, left: 60, transform: `scale(${scale})`, transformOrigin: "top left" };

        return (
          <div key={i} style={{
            position: "absolute", ...posStyle,
            width: gif.size, height: gif.size,
            opacity, zIndex: 100,
            borderRadius: 20, overflow: "hidden",
          }}>
            <OffthreadVideo src={gif.url} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        );
      })}
    </>
  );
}

// ─── Shared visual components ─────────────────────────────────────────────────

function Background() {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const t = frame / durationInFrames;
  const x = interpolate(t, [0, 1], [15, 85]);
  const y = interpolate(t, [0, 1], [15, 85]);
  return (
    <AbsoluteFill style={{ background: BG }}>
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 90% 70% at ${x}% ${y}%, ${GLOW} 0%, transparent 65%)` }} />
      <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 70% 50% at ${100-x}% ${100-y}%, #0033AA0a 0%, transparent 60%)` }} />
    </AbsoluteFill>
  );
}

function Header() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = interpolate(Math.sin((frame / fps) * Math.PI * 2), [-1, 1], [0.5, 1]);
  return (
    <div style={{
      position: "absolute", top: 0, left: 0, right: 0,
      padding: "60px 68px 0",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      opacity: fadeIn(frame, 0, 15), zIndex: 10,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: ACCENT, boxShadow: `0 0 14px ${ACCENT}`, opacity: pulse }} />
        <span style={{ color: ACCENT, fontSize: 26, fontWeight: 800, letterSpacing: 3, fontFamily: HIND }}>MARKET BRIEF</span>
      </div>
      <span style={{ color: MUTED, fontSize: 24, fontWeight: 700, fontFamily: HIND }}>{todayData.date}</span>
    </div>
  );
}

function ProgressDots({ current }: { current: number }) {
  return (
    <div style={{ position: "absolute", bottom: 64, left: 0, right: 0, display: "flex", justifyContent: "center", gap: 12 }}>
      {Array.from({ length: 7 }).map((_, i) => (
        <div key={i} style={{ width: i === current ? 30 : 10, height: 10, borderRadius: 5, background: i === current ? ACCENT : "#1e1e30" }} />
      ))}
    </div>
  );
}

function Label({ text, delay = 0, color = MUTED }: { text: string; delay?: number; color?: string }) {
  const frame = useCurrentFrame();
  return (
    <div style={{ opacity: fadeIn(frame, delay, 12), color, fontSize: 24, fontWeight: 700, fontFamily: HIND, letterSpacing: 4, marginBottom: 32, textTransform: "uppercase" as const }}>
      {text}
    </div>
  );
}

// ─── Animated line chart ──────────────────────────────────────────────────────
function LineChart({ chart }: { chart: NonNullable<typeof todayData.chart> }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const drawProgress = spring({ frame: frame - 20, fps, config: { damping: 40, stiffness: 35, mass: 1 }, durationInFrames: 90 });

  const W = 940, H = 240, PX = 8, PY = 20;
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
  for (let i = 0; i <= Math.min(completed, data.length - 1); i++) pts.push({ x: toX(i), y: toY(data[i]) });
  if (completed < totalSeg) {
    const ax = toX(completed), ay = toY(data[completed]);
    const bx = toX(completed + 1), by = toY(data[completed + 1]);
    pts.push({ x: ax + frac * (bx - ax), y: ay + frac * (by - ay) });
  }
  if (pts.length < 2) return null;

  const pathD = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
  const last = pts[pts.length - 1];
  const isUp = data[data.length - 1] >= data[0];
  const color = isUp ? "#00FF94" : "#FF4455";
  const areaD = `${pathD} L${last.x},${H - PY} L${pts[0].x},${H - PY} Z`;

  return (
    <div style={{ marginTop: 36 }}>
      <div style={{ color: MUTED, fontSize: 20, marginBottom: 10, fontWeight: 500, fontFamily: HIND }}>{chart.title}</div>
      <svg width={W} height={H + 24} viewBox={`0 0 ${W} ${H + 24}`} style={{ overflow: "visible" }}>
        {[0.25, 0.5, 0.75].map((t, i) => <line key={i} x1={PX} y1={PY + t * (H - PY * 2)} x2={W - PX} y2={PY + t * (H - PY * 2)} stroke="#1e1e30" strokeWidth={1} />)}
        <path d={areaD} fill={`${color}18`} />
        <path d={pathD} fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx={last.x} cy={last.y} r={10} fill={color} style={{ filter: `drop-shadow(0 0 12px ${color})` }} />
        {chart.labels.map((label, i) => <text key={i} x={toX(i)} y={H + 20} textAnchor="middle" fill={MUTED} fontSize={18} fontFamily={HIND}>{label}</text>)}
        <text x={PX + 4} y={toY(data[0]) - 10} fill={MUTED} fontSize={18} fontFamily={HIND}>{data[0]}</text>
        <text x={W - PX - 4} y={toY(data[data.length - 1]) - 10} textAnchor="end" fill={color} fontSize={20} fontWeight="bold" fontFamily={HIND} opacity={fadeIn(frame, 60, 15)}>{data[data.length - 1]}</text>
      </svg>
    </div>
  );
}

// ─── Scenes ───────────────────────────────────────────────────────────────────
function HookScene() {
  const { progress, opacity } = useEntrance(14);
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "160px 70px 130px" }}>
      {todayData.heroImage && (
        <AbsoluteFill style={{ zIndex: 0 }}>
          <Img src={todayData.heroImage} style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.2 }} />
          <AbsoluteFill style={{ background: "linear-gradient(to bottom, #0A0A0Fbb 0%, #0A0A0F55 35%, #0A0A0Fcc 70%, #0A0A0F 100%)" }} />
        </AbsoluteFill>
      )}
      <div style={{ position: "relative", zIndex: 1 }}>
        <Label text="Today's Top Story" delay={0} color={ACCENT} />
        <div style={{ opacity, transform: `translateY(${interpolate(progress, [0, 1], [70, 0])}px)`, fontSize: 92, fontWeight: 900, fontFamily: HIND, color: TEXT, lineHeight: 1.08, letterSpacing: -2, whiteSpace: "pre-line" }}>
          {todayData.hook}
        </div>
      </div>
      <ProgressDots current={0} />
    </AbsoluteFill>
  );
}

function HeadlineScene() {
  const h = useEntrance(8);
  const s = useEntrance(22);
  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "160px 70px 130px" }}>
      <Label text="Breaking Down" delay={0} />
      <div style={{ opacity: h.opacity, transform: `translateY(${interpolate(h.progress, [0, 1], [50, 0])}px)`, fontSize: 74, fontWeight: 900, fontFamily: HIND, color: TEXT, lineHeight: 1.1, letterSpacing: -2, marginBottom: 24, whiteSpace: "pre-line" }}>
        {todayData.headline}
      </div>
      <div style={{ opacity: s.opacity, transform: `translateY(${interpolate(s.progress, [0, 1], [24, 0])}px)`, fontSize: 34, fontFamily: HIND, color: ACCENT, fontWeight: 600, lineHeight: 1.5 }}>
        {todayData.subheadline}
      </div>
      {todayData.chart && <LineChart chart={todayData.chart} />}
      <ProgressDots current={1} />
    </AbsoluteFill>
  );
}

function BulletScene({ bullet, index }: { bullet: typeof todayData.bullets[0]; index: number }) {
  const icon  = useEntrance(5);
  const title = useEntrance(18);
  const det   = useEntrance(30);
  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "160px 70px 130px" }}>
      <Label text={`Point ${index + 1} of ${todayData.bullets.length}`} delay={0} />
      <div style={{ opacity: icon.opacity, transform: `scale(${interpolate(icon.progress, [0, 1], [0.3, 1])})`, fontSize: 130, lineHeight: 1, marginBottom: 44, transformOrigin: "left center" }}>{bullet.icon}</div>
      <div style={{ opacity: title.opacity, transform: `translateY(${interpolate(title.progress, [0, 1], [36, 0])}px)`, fontSize: 74, fontWeight: 900, fontFamily: HIND, color: TEXT, lineHeight: 1.1, letterSpacing: -1, marginBottom: 28 }}>{bullet.title}</div>
      <div style={{ opacity: det.opacity, transform: `translateY(${interpolate(det.progress, [0, 1], [20, 0])}px)`, fontSize: 40, fontFamily: HIND, color: MUTED, lineHeight: 1.55, fontWeight: 500 }}>{bullet.detail}</div>
      <ProgressDots current={2 + index} />
    </AbsoluteFill>
  );
}

function WatchOutScene() {
  const { progress, opacity } = useEntrance(12);
  const frame = useCurrentFrame();
  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "160px 70px 130px", background: `linear-gradient(160deg, ${WARN_BG} 0%, ${BG} 50%)` }}>
      <div style={{ opacity: fadeIn(frame, 0, 10), fontSize: 90, marginBottom: 28, lineHeight: 1 }}>⚠️</div>
      <Label text="Watch Out" delay={0} color="#FFB800" />
      <div style={{ opacity, transform: `translateY(${interpolate(progress, [0, 1], [44, 0])}px)`, fontSize: 56, fontWeight: 800, fontFamily: HIND, color: TEXT, lineHeight: 1.35, letterSpacing: -1 }}>{todayData.watchOut}</div>
      <ProgressDots current={5} />
    </AbsoluteFill>
  );
}

function CTAScene() {
  const main = useEntrance(8);
  const sub  = useEntrance(22);
  return (
    <AbsoluteFill style={{ display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center", textAlign: "center", padding: "160px 70px 130px" }}>
      <div style={{ opacity: main.opacity, transform: `scale(${interpolate(main.progress, [0, 1], [0.5, 1])})`, fontSize: 110, marginBottom: 48, lineHeight: 1 }}>📈</div>
      <div style={{ opacity: main.opacity, transform: `translateY(${interpolate(main.progress, [0, 1], [36, 0])}px)`, fontSize: 66, fontWeight: 900, fontFamily: HIND, color: TEXT, lineHeight: 1.2, marginBottom: 36 }}>{todayData.ctaText}</div>
      <div style={{ opacity: sub.opacity, transform: `translateY(${interpolate(sub.progress, [0, 1], [20, 0])}px)`, fontSize: 34, fontFamily: HIND, color: ACCENT, fontWeight: 600 }}>New reel every market day</div>
      <ProgressDots current={6} />
    </AbsoluteFill>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export function MarketReel() {
  return (
    <AbsoluteFill style={{ background: BG, fontFamily: HIND }}>
      <Background />
      <Header />
      <Sequence from={HOOK_FROM} durationInFrames={HOOK_DUR}><HookScene /></Sequence>
      <Sequence from={HEAD_FROM} durationInFrames={HEAD_DUR}><HeadlineScene /></Sequence>
      <Sequence from={B1_FROM}   durationInFrames={B_DUR}><BulletScene bullet={todayData.bullets[0]} index={0} /></Sequence>
      <Sequence from={B2_FROM}   durationInFrames={B_DUR}><BulletScene bullet={todayData.bullets[1]} index={1} /></Sequence>
      <Sequence from={B3_FROM}   durationInFrames={B_DUR}><BulletScene bullet={todayData.bullets[2]} index={2} /></Sequence>
      <Sequence from={WARN_FROM} durationInFrames={WARN_DUR}><WatchOutScene /></Sequence>
      <Sequence from={CTA_FROM}  durationInFrames={CTA_DUR}><CTAScene /></Sequence>
      {/* GIFs and subtitles render over everything */}
      <GifInserts />
      <SubtitleOverlay />
    </AbsoluteFill>
  );
}
