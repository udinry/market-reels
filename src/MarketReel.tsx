import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Sequence,
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

// ─── Helpers ──────────────────────────────────────────────────────────────────
function useSpring(delay = 0) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - delay, fps, config: { damping: 14, stiffness: 200 }, durationInFrames: 22 });
}

function fadein(frame: number, delay = 0, dur = 15) {
  return interpolate(frame - delay, [0, dur], [0, 1], { extrapolateLeft: "clamp", extrapolateRight: "clamp" });
}

function Topbar() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pulse = interpolate(Math.sin((frame / fps) * Math.PI * 2), [-1, 1], [0.4, 1]);
  return (
    <div style={{
      position: "absolute", top: 0, left: 0, right: 0,
      padding: "56px 60px 0",
      display: "flex", justifyContent: "space-between", alignItems: "center",
      zIndex: 20,
      opacity: fadein(frame, 0, 15),
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ width: 12, height: 12, borderRadius: "50%", background: ACCENT, boxShadow: `0 0 18px ${ACCENT}`, opacity: pulse }} />
        <span style={{ color: ACCENT, fontSize: 26, fontWeight: 700, letterSpacing: 4, fontFamily: HIND }}>MARKET BRIEF</span>
      </div>
      <span style={{ color: "rgba(255,255,255,0.5)", fontSize: 23, fontFamily: HIND, fontWeight: 700 }}>{todayData.date}</span>
    </div>
  );
}

// ─── SCENE 1: Hook / Intro ─────────────────────────────────────────────────────
function SceneHook() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const s1 = useSpring(20);
  const s2 = useSpring(38);
  const s3 = useSpring(56);
  const flags = spring({ frame: frame - 8, fps, config: { damping: 12, stiffness: 160 }, durationInFrames: 20 });

  return (
    <AbsoluteFill style={{ background: "linear-gradient(155deg, #180800 0%, #0a0a0f 45%, #001208 100%)" }}>
      {/* India saffron glow */}
      <div style={{ position: "absolute", top: "10%", left: "5%", width: 460, height: 460, borderRadius: "50%", background: "radial-gradient(circle, #FF671522 0%, transparent 70%)" }} />
      {/* Sweden blue glow */}
      <div style={{ position: "absolute", bottom: "15%", right: "8%", width: 380, height: 380, borderRadius: "50%", background: "radial-gradient(circle, #06A3DA20 0%, transparent 70%)" }} />
      {/* Accent glow center */}
      <div style={{ position: "absolute", top: "35%", left: "50%", transform: "translateX(-50%)", width: 500, height: 400, borderRadius: "50%", background: "radial-gradient(circle, #00FF9412 0%, transparent 70%)" }} />

      <Topbar />

      <div style={{
        position: "absolute", top: "16%", left: 0, right: 0,
        display: "flex", justifyContent: "center",
        opacity: flags,
        transform: `scale(${interpolate(flags, [0, 1], [0.3, 1])}) translateY(${interpolate(flags, [0, 1], [-40, 0])}px)`,
        fontSize: 100, letterSpacing: 8,
      }}>
        🇮🇳 ✈️ 🇸🇪
      </div>

      <div style={{ position: "absolute", top: "36%", left: 0, right: 0, padding: "0 60px" }}>
        <div style={{ opacity: s1, transform: `translateY(${interpolate(s1, [0, 1], [55, 0])}px)`, fontSize: 96, fontWeight: 700, fontFamily: HIND, color: "#fff", lineHeight: 1.05 }}>Modi Ji Ki</div>
        <div style={{ opacity: s2, transform: `translateY(${interpolate(s2, [0, 1], [50, 0])}px)`, fontSize: 96, fontWeight: 700, fontFamily: HIND, color: ACCENT, lineHeight: 1.05 }}>Diplomacy</div>
        <div style={{ opacity: s3, transform: `translateY(${interpolate(s3, [0, 1], [45, 0])}px)`, fontSize: 96, fontWeight: 700, fontFamily: HIND, color: "#fff", lineHeight: 1.05 }}>On Fire 🔥</div>
      </div>

      <div style={{
        position: "absolute", bottom: 90, left: 60,
        opacity: fadein(frame, 80, 20),
        background: "rgba(255,255,255,0.07)", backdropFilter: "blur(12px)",
        border: "1px solid rgba(255,255,255,0.12)", borderRadius: 50,
        padding: "14px 34px",
        fontSize: 28, fontFamily: HIND, fontWeight: 700, color: "rgba(255,255,255,0.8)",
      }}>
        Netherlands ✅ → Sweden ✅
      </div>
    </AbsoluteFill>
  );
}

// ─── SCENE 2: Jets / Welcome ───────────────────────────────────────────────────
function SceneJets() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const jetX = interpolate(frame, [0, 180], [-220, 1400], { extrapolateRight: "clamp" });
  const title = useSpring(45);
  const cards = useSpring(85);

  return (
    <AbsoluteFill style={{ background: "linear-gradient(175deg, #04111f 0%, #081428 55%, #060e1a 100%)" }}>
      {/* Stars */}
      {Array.from({ length: 28 }, (_, i) => (
        <div key={i} style={{
          position: "absolute",
          top: `${(i * 41) % 100}%`, left: `${(i * 67 + 13) % 100}%`,
          width: i % 4 === 0 ? 4 : 2, height: i % 4 === 0 ? 4 : 2,
          borderRadius: "50%", background: "#fff",
          opacity: interpolate(Math.sin((frame / 20 + i) * 1.8), [-1, 1], [0.1, 0.7]),
        }} />
      ))}
      <div style={{ position: "absolute", bottom: "25%", right: "15%", width: 450, height: 450, borderRadius: "50%", background: "radial-gradient(circle, #0088CC20 0%, transparent 70%)" }} />

      <Topbar />

      {/* Jet */}
      <div style={{
        position: "absolute", top: "26%", left: jetX, zIndex: 5,
        fontSize: 108, transform: "scaleX(-1)",
        filter: "drop-shadow(0 0 22px rgba(100,180,255,0.9))",
      }}>✈️</div>
      <div style={{
        position: "absolute", top: "calc(26% + 64px)", left: 0,
        width: Math.min(Math.max(jetX + 120, 0), 1080),
        height: 2,
        background: "linear-gradient(to right, transparent, rgba(100,180,255,0.5) 60%, transparent)",
      }} />

      <div style={{ position: "absolute", top: "42%", left: 0, right: 0, padding: "0 60px" }}>
        <div style={{ opacity: title, transform: `translateY(${interpolate(title, [0, 1], [45, 0])}px)`, fontSize: 80, fontWeight: 700, fontFamily: HIND, color: "#fff", lineHeight: 1.1 }}>Swedish Air Force</div>
        <div style={{ opacity: title, transform: `translateY(${interpolate(title, [0, 1], [38, 0])}px)`, fontSize: 80, fontWeight: 700, fontFamily: HIND, color: "#4DBBFF", lineHeight: 1.1 }}>ne Welcome kiya! 🎖️</div>
      </div>

      <div style={{
        position: "absolute", bottom: 90, left: 60, right: 60,
        display: "flex", gap: 20,
        opacity: cards, transform: `translateY(${interpolate(cards, [0, 1], [40, 0])}px)`,
      }}>
        {["🇳🇱 Netherlands\nSemiconductors deal ✅", "🇸🇪 Sweden\nDefense + AI corridor ✅"].map((txt, i) => (
          <div key={i} style={{
            flex: 1,
            background: "rgba(77,187,255,0.08)", border: "1px solid rgba(77,187,255,0.22)",
            borderRadius: 18, padding: "20px 24px",
            fontSize: 26, fontFamily: HIND, fontWeight: 700, color: "rgba(255,255,255,0.82)",
            whiteSpace: "pre-line",
          }}>{txt}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
}

// ─── SCENE 3: Defense Stocks ───────────────────────────────────────────────────
function SceneDefense() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const hal = useSpring(18);
  const bel = useSpring(48);
  const chartProgress = spring({ frame: frame - 90, fps, config: { damping: 40, stiffness: 35, mass: 1 }, durationInFrames: 90 });

  const data = todayData.chart.data;
  const W = 920, H = 155, PX = 10, PY = 12;
  const min = Math.min(...data) * 0.998, max = Math.max(...data) * 1.002;
  const toX = (i: number) => PX + (i / (data.length - 1)) * (W - PX * 2);
  const toY = (v: number) => H - PY - ((v - min) / (max - min)) * (H - PY * 2);
  const prog = chartProgress * (data.length - 1);
  const comp = Math.floor(prog);
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i <= Math.min(comp, data.length - 1); i++) pts.push({ x: toX(i), y: toY(data[i]) });
  if (comp < data.length - 1) {
    const f = prog - comp;
    pts.push({ x: toX(comp) + f * (toX(comp + 1) - toX(comp)), y: toY(data[comp]) + f * (toY(data[comp + 1]) - toY(data[comp])) });
  }
  const pathD = pts.length >= 2 ? pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ") : "";
  const last = pts[pts.length - 1] ?? { x: 0, y: 0 };

  return (
    <AbsoluteFill style={{ background: "linear-gradient(155deg, #020d03 0%, #0a0a0f 50%, #031503 100%)" }}>
      <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)", width: 560, height: 500, borderRadius: "50%", background: "radial-gradient(circle, #00FF9416 0%, transparent 70%)" }} />

      <Topbar />

      <div style={{ position: "absolute", top: "15%", left: 60, opacity: fadein(frame, 5, 12) }}>
        <div style={{ fontSize: 32, fontFamily: HIND, fontWeight: 700, color: ACCENT, letterSpacing: 3, marginBottom: 6 }}>DEFENSE SECTOR 🛡️</div>
        <div style={{ fontSize: 62, fontFamily: HIND, fontWeight: 700, color: "#fff", lineHeight: 1.1 }}>HAL + BEL ke<br />bulls, suno! 👂</div>
      </div>

      <div style={{ position: "absolute", top: "44%", left: 60, right: 60, display: "flex", gap: 22 }}>
        {[
          { n: "HAL", price: "₹3,450", ch: "▲ +8.5%", sub: "Gripen fighter deal" },
          { n: "BEL", price: "₹280",   ch: "▲ +6.2%", sub: "Defense electronics" },
        ].map((s, i) => (
          <div key={i} style={{
            flex: 1,
            opacity: i === 0 ? hal : bel,
            transform: `translateY(${interpolate(i === 0 ? hal : bel, [0, 1], [65, 0])}px) scale(${interpolate(i === 0 ? hal : bel, [0, 1], [0.85, 1])})`,
            background: "rgba(0,255,148,0.07)", border: "2px solid rgba(0,255,148,0.28)",
            borderRadius: 24, padding: "26px 26px",
          }}>
            <div style={{ fontSize: 48, fontFamily: HIND, fontWeight: 700, color: "#fff" }}>{s.n}</div>
            <div style={{ fontSize: 60, fontFamily: HIND, fontWeight: 700, color: ACCENT, lineHeight: 1 }}>{s.price}</div>
            <div style={{ fontSize: 32, fontFamily: HIND, fontWeight: 700, color: "#00FF94", marginTop: 8 }}>{s.ch}</div>
            <div style={{ fontSize: 22, fontFamily: HIND, color: "rgba(255,255,255,0.45)", marginTop: 6 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {pathD && (
        <div style={{ position: "absolute", bottom: 55, left: 60, right: 60, opacity: fadein(frame, 95, 15) }}>
          <svg width={W} height={H + 26} viewBox={`0 0 ${W} ${H + 26}`} style={{ overflow: "visible" }}>
            <path d={`${pathD} L${last.x},${H - PY} L${pts[0].x},${H - PY} Z`} fill="#00FF9414" />
            <path d={pathD} fill="none" stroke={ACCENT} strokeWidth={4} strokeLinecap="round" strokeLinejoin="round" />
            <circle cx={last.x} cy={last.y} r={8} fill={ACCENT} style={{ filter: "drop-shadow(0 0 12px #00FF94)" }} />
            {todayData.chart.labels.map((l, i) => (
              <text key={i} x={toX(i)} y={H + 22} textAnchor="middle" fill="rgba(255,255,255,0.38)" fontSize={16} fontFamily={HIND}>{l}</text>
            ))}
            <text x={last.x} y={last.y - 14} textAnchor="middle" fill={ACCENT} fontSize={18} fontWeight="bold" fontFamily={HIND}>{data[data.length - 1]}</text>
          </svg>
        </div>
      )}
    </AbsoluteFill>
  );
}

// ─── SCENE 4: Semiconductors ───────────────────────────────────────────────────
function SceneSemi() {
  const frame = useCurrentFrame();
  const c1 = useSpring(18);
  const c2 = useSpring(48);

  const dots = Array.from({ length: 18 }, (_, i) => ({
    x: ((i * 131 + 55) % 880) + 100,
    y: ((i * 97 + 40) % 1700) + 80,
  }));

  return (
    <AbsoluteFill style={{ background: "linear-gradient(155deg, #06060f 0%, #0a0a20 55%, #100520 100%)" }}>
      {dots.map((d, i) => (
        <div key={i} style={{
          position: "absolute", left: d.x, top: d.y,
          width: 5, height: 5, borderRadius: "50%",
          background: "#5566FF",
          opacity: interpolate(Math.sin((frame / 28 + i) * Math.PI), [-1, 1], [0.05, 0.3]),
          boxShadow: "0 0 7px #5566FF",
        }} />
      ))}
      <div style={{ position: "absolute", top: "30%", left: "50%", transform: "translateX(-50%)", width: 600, height: 500, borderRadius: "50%", background: "radial-gradient(circle, #5544FF18 0%, transparent 70%)" }} />

      <Topbar />

      <div style={{ position: "absolute", top: "15%", left: 60, opacity: fadein(frame, 5, 12) }}>
        <div style={{ fontSize: 32, fontFamily: HIND, fontWeight: 700, color: "#6699FF", letterSpacing: 3, marginBottom: 6 }}>SEMI + AI CORRIDOR 💻</div>
        <div style={{ fontSize: 62, fontFamily: HIND, fontWeight: 700, color: "#fff", lineHeight: 1.1 }}>Dutch + Swedish<br />double setting! 🔥</div>
      </div>

      <div style={{ position: "absolute", top: "47%", left: 60, right: 60, display: "flex", gap: 22 }}>
        {[
          { n: "Tata Electronics", tag: "ASML play 🇳🇱", badge: "WATCHLIST" },
          { n: "KPIT Tech",        tag: "AI + Sweden 🇸🇪", badge: "WATCHLIST" },
        ].map((co, i) => (
          <div key={i} style={{
            flex: 1,
            opacity: i === 0 ? c1 : c2,
            transform: `translateY(${interpolate(i === 0 ? c1 : c2, [0, 1], [60, 0])}px)`,
            background: "rgba(85,68,255,0.1)", border: "2px solid rgba(100,110,255,0.32)",
            borderRadius: 24, padding: "26px 24px",
          }}>
            <div style={{ fontSize: 42, fontFamily: HIND, fontWeight: 700, color: "#fff", lineHeight: 1.1 }}>{co.n}</div>
            <div style={{ fontSize: 26, fontFamily: HIND, color: "#99AAFF", marginTop: 10 }}>{co.tag}</div>
            <div style={{
              marginTop: 14, display: "inline-block",
              background: "#5544FF", borderRadius: 28,
              padding: "8px 22px",
              fontSize: 22, fontFamily: HIND, fontWeight: 700, color: "#fff",
            }}>📋 {co.badge}</div>
          </div>
        ))}
      </div>

      <div style={{
        position: "absolute", bottom: 90, left: 60,
        opacity: fadein(frame, 110, 15),
        background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 16, padding: "14px 28px",
        fontSize: 30, fontFamily: HIND, fontWeight: 700, color: "rgba(255,255,255,0.65)",
      }}>
        Real stonk up incoming 🚀📈
      </div>
    </AbsoluteFill>
  );
}

// ─── SCENE 5: Ghabrao Mat (this-is-fine GIF) ───────────────────────────────────
function SceneGhabrao() {
  const frame = useCurrentFrame();
  const h = useSpring(10);
  const gif = useSpring(30);
  const txt = useSpring(55);

  return (
    <AbsoluteFill style={{ background: "linear-gradient(155deg, #190404 0%, #0a0a0f 50%, #100308 100%)" }}>
      <div style={{ position: "absolute", top: "20%", left: "20%", width: 560, height: 560, borderRadius: "50%", background: "radial-gradient(circle, #FF333322 0%, transparent 70%)" }} />

      <Topbar />

      <div style={{
        position: "absolute", top: "13%", left: 60, right: 60,
        opacity: h, transform: `translateY(${interpolate(h, [0, 1], [40, 0])}px)`,
      }}>
        <div style={{ fontSize: 86, fontWeight: 700, fontFamily: HIND, color: "#FF4455", lineHeight: 1.0 }}>Portfolio</div>
        <div style={{ fontSize: 86, fontWeight: 700, fontFamily: HIND, color: "#fff", lineHeight: 1.0 }}>laal hai? 🔴</div>
      </div>

      {/* This-is-fine GIF */}
      <div style={{
        position: "absolute", left: 56, top: "42%",
        width: 430, height: 370,
        opacity: gif, transform: `scale(${interpolate(gif, [0, 1], [0.55, 1])})`, transformOrigin: "bottom left",
        borderRadius: 20, overflow: "hidden",
        boxShadow: "0 14px 60px rgba(0,0,0,0.75)",
        zIndex: 10,
      }}>
        <Video src={staticFile("this-is-fine.mp4")} style={{ width: "100%", height: "100%", objectFit: "cover" }} muted loop />
      </div>

      {/* Right-side reassurance */}
      <div style={{
        position: "absolute", right: 56, top: "42%", width: 450,
        opacity: txt, transform: `translateX(${interpolate(txt, [0, 1], [50, 0])}px)`,
      }}>
        <div style={{ fontSize: 72, fontWeight: 700, fontFamily: HIND, color: ACCENT, lineHeight: 1.1 }}>GHABRAO<br />MAT 😌</div>
        <div style={{ fontSize: 30, fontFamily: HIND, color: "rgba(255,255,255,0.6)", lineHeight: 1.55, marginTop: 18 }}>
          Geopolitics samjho<br />toh multibagger<br />milega yahin 💎
        </div>
      </div>
    </AbsoluteFill>
  );
}

// ─── SCENE 6: Stonks ──────────────────────────────────────────────────────────
function SceneStonks() {
  const frame = useCurrentFrame();
  const h = useSpring(10);
  const gif = useSpring(22);
  const tickers = useSpring(80);

  return (
    <AbsoluteFill style={{ background: "linear-gradient(155deg, #081200 0%, #0a0a0f 50%, #091400 100%)" }}>
      <div style={{ position: "absolute", bottom: "18%", right: "8%", width: 650, height: 600, borderRadius: "50%", background: "radial-gradient(circle, #00FF9420 0%, transparent 70%)" }} />

      <Topbar />

      {/* Stonks GIF — left */}
      <div style={{
        position: "absolute", left: 52, top: "22%",
        width: 460, height: 430,
        opacity: gif, transform: `scale(${interpolate(gif, [0, 1], [0.5, 1])})`, transformOrigin: "bottom left",
        borderRadius: 22, overflow: "hidden",
        boxShadow: "0 14px 60px rgba(0,255,148,0.22)",
        zIndex: 10,
      }}>
        <Video src={staticFile("stonks.mp4")} style={{ width: "100%", height: "100%", objectFit: "cover" }} muted loop />
      </div>

      {/* Right text */}
      <div style={{
        position: "absolute", right: 52, top: "22%", width: 440,
        opacity: h, transform: `translateY(${interpolate(h, [0, 1], [45, 0])}px)`,
      }}>
        <div style={{ fontSize: 34, fontFamily: HIND, fontWeight: 700, color: ACCENT, letterSpacing: 2, marginBottom: 8 }}>REAL-LIFE</div>
        <div style={{ fontSize: 94, fontFamily: HIND, fontWeight: 700, color: ACCENT, lineHeight: 0.92 }}>STONK</div>
        <div style={{ fontSize: 94, fontFamily: HIND, fontWeight: 700, color: "#fff", lineHeight: 0.92 }}>UP 🚀</div>
        <div style={{ fontSize: 28, fontFamily: HIND, color: "rgba(255,255,255,0.58)", marginTop: 22, lineHeight: 1.55 }}>
          Agla multibagger<br />yahin milega 💎
        </div>
      </div>

      {/* Ticker strip */}
      <div style={{
        position: "absolute", bottom: 85, left: 60, right: 60,
        display: "flex", gap: 18,
        opacity: tickers, transform: `translateY(${interpolate(tickers, [0, 1], [30, 0])}px)`,
      }}>
        {["HAL 📈", "BEL 📈", "TATA ELEC 📈", "KPIT 📈"].map((t, i) => (
          <div key={i} style={{
            flex: 1, textAlign: "center",
            background: "rgba(0,255,148,0.09)", border: "1px solid rgba(0,255,148,0.28)",
            borderRadius: 12, padding: "12px 0",
            fontSize: 21, fontFamily: HIND, fontWeight: 700, color: ACCENT,
          }}>{t}</div>
        ))}
      </div>
    </AbsoluteFill>
  );
}

// ─── SCENE 7: CTA ─────────────────────────────────────────────────────────────
function SceneCTA() {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const icon   = useSpring(12);
  const handle = useSpring(28);
  const sub    = useSpring(50);
  const btn    = useSpring(75);
  const footer = useSpring(105);
  const pulse  = interpolate(Math.sin((frame / 30) * Math.PI * 2), [-1, 1], [0.92, 1.08]);

  return (
    <AbsoluteFill style={{
      background: "linear-gradient(160deg, #001a0a 0%, #0a0a0f 40%, #001408 100%)",
      display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
    }}>
      {/* Pulsing rings */}
      {[1, 2, 3].map((r) => (
        <div key={r} style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%, -50%)",
          width: r * 290, height: r * 290, borderRadius: "50%",
          border: `1px solid rgba(0,255,148,${0.18 / r})`,
          opacity: interpolate(Math.sin((frame / 45 + r * 0.8) * Math.PI), [-1, 1], [0.2, 1]),
        }} />
      ))}
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 720, height: 720, borderRadius: "50%", background: "radial-gradient(circle, #00FF941a 0%, transparent 70%)" }} />

      <div style={{ opacity: icon, transform: `scale(${interpolate(icon, [0, 1], [0.4, 1])})`, fontSize: 90, marginBottom: 18 }}>📱</div>

      <div style={{
        opacity: handle,
        transform: `scale(${interpolate(handle, [0, 1], [0.6, 1])}) translateY(${interpolate(handle, [0, 1], [28, 0])}px)`,
        fontSize: 90, fontWeight: 700, fontFamily: HIND, color: ACCENT,
        textShadow: `0 0 44px ${ACCENT}55`, textAlign: "center", letterSpacing: -1,
      }}>@desi_degen</div>

      <div style={{
        opacity: sub, transform: `translateY(${interpolate(sub, [0, 1], [22, 0])}px)`,
        fontSize: 34, fontFamily: HIND, color: "rgba(255,255,255,0.65)",
        marginTop: 12, fontWeight: 700, textAlign: "center",
      }}>on Instagram</div>

      <div style={{
        marginTop: 50,
        opacity: btn,
        transform: `scale(${interpolate(btn, [0, 1], [0.55, 1]) * pulse})`,
        background: ACCENT, borderRadius: 60,
        padding: "22px 72px",
        fontSize: 38, fontFamily: HIND, fontWeight: 700, color: "#000",
        boxShadow: `0 0 44px ${ACCENT}44`,
        letterSpacing: 0.5,
      }}>Follow 🔔</div>

      <div style={{
        position: "absolute", bottom: 75,
        opacity: footer, transform: `translateY(${interpolate(footer, [0, 1], [20, 0])}px)`,
        fontSize: 26, fontFamily: HIND, color: "rgba(255,255,255,0.32)", textAlign: "center",
      }}>New reel every market day 📅</div>
    </AbsoluteFill>
  );
}

// ─── Root ──────────────────────────────────────────────────────────────────────
export function MarketReel() {
  return (
    <AbsoluteFill style={{ background: "#0A0A0F", fontFamily: HIND }}>
      <Sequence from={0}    durationInFrames={300}><SceneHook /></Sequence>
      <Sequence from={300}  durationInFrames={300}><SceneJets /></Sequence>
      <Sequence from={600}  durationInFrames={300}><SceneDefense /></Sequence>
      <Sequence from={900}  durationInFrames={300}><SceneSemi /></Sequence>
      <Sequence from={1200} durationInFrames={300}><SceneGhabrao /></Sequence>
      <Sequence from={1500} durationInFrames={300}><SceneStonks /></Sequence>
      <Sequence from={1800} durationInFrames={300}><SceneCTA /></Sequence>
    </AbsoluteFill>
  );
}
