import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { todayData } from "./data";

const ACCENT = "#00FF94";
const BG = "#0A0A0F";
const CARD_BG = "#13131A";
const TEXT = "#FFFFFF";
const MUTED = "#8888AA";

function useSlide(frame: number, fps: number, delay = 0) {
  return spring({
    frame: frame - delay,
    fps,
    config: { damping: 18, stiffness: 120, mass: 0.8 },
    durationInFrames: 25,
  });
}

function useFade(frame: number, delay = 0) {
  return interpolate(frame - delay, [0, 15], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
}

// Top badge
function DateBadge({ frame, fps }: { frame: number; fps: number }) {
  const progress = useSlide(frame, fps, 0);
  return (
    <div
      style={{
        opacity: progress,
        transform: `translateY(${interpolate(progress, [0, 1], [-20, 0])}px)`,
        display: "flex",
        alignItems: "center",
        gap: 8,
        marginBottom: 24,
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          background: ACCENT,
          boxShadow: `0 0 8px ${ACCENT}`,
        }}
      />
      <span style={{ color: ACCENT, fontSize: 18, fontWeight: 600, letterSpacing: 2, textTransform: "uppercase" }}>
        {todayData.date}
      </span>
    </div>
  );
}

// Animated progress bar at bottom
function ProgressBar({ frame, durationInFrames }: { frame: number; durationInFrames: number }) {
  const progress = frame / durationInFrames;
  return (
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 4,
        background: "#1a1a2e",
      }}
    >
      <div
        style={{
          height: "100%",
          width: `${progress * 100}%`,
          background: `linear-gradient(90deg, ${ACCENT}, #00BFFF)`,
          transition: "width 0.1s",
        }}
      />
    </div>
  );
}

// Bullet point card
function BulletCard({
  bullet,
  frame,
  fps,
  delay,
}: {
  bullet: (typeof todayData.bullets)[0];
  frame: number;
  fps: number;
  delay: number;
}) {
  const progress = useSlide(frame, fps, delay);
  const fade = useFade(frame, delay);

  return (
    <div
      style={{
        opacity: fade,
        transform: `translateX(${interpolate(progress, [0, 1], [60, 0])}px)`,
        background: CARD_BG,
        border: `1px solid #1e1e30`,
        borderLeft: `3px solid ${ACCENT}`,
        borderRadius: 12,
        padding: "16px 20px",
        display: "flex",
        alignItems: "flex-start",
        gap: 16,
        marginBottom: 14,
      }}
    >
      <span style={{ fontSize: 28 }}>{bullet.icon}</span>
      <div>
        <div style={{ color: TEXT, fontSize: 22, fontWeight: 700, marginBottom: 4 }}>
          {bullet.title}
        </div>
        <div style={{ color: MUTED, fontSize: 17, lineHeight: 1.4 }}>{bullet.detail}</div>
      </div>
    </div>
  );
}

export function MarketReel() {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  const headlineProgress = useSlide(frame, fps, 5);
  const subProgress = useSlide(frame, fps, 12);
  const watchOutFade = useFade(frame, 90);
  const ctaFade = useFade(frame, 105);

  return (
    <AbsoluteFill
      style={{
        background: BG,
        fontFamily: "'Inter', 'SF Pro Display', 'Helvetica Neue', sans-serif",
        padding: "60px 60px 20px 60px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      {/* Header */}
      <div>
        <DateBadge frame={frame} fps={fps} />

        {/* Main headline */}
        <div
          style={{
            opacity: interpolate(headlineProgress, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(headlineProgress, [0, 1], [30, 0])}px)`,
            fontSize: 52,
            fontWeight: 900,
            color: TEXT,
            lineHeight: 1.1,
            marginBottom: 14,
            letterSpacing: -1,
          }}
        >
          {todayData.headline}
        </div>

        {/* Sub headline */}
        <div
          style={{
            opacity: interpolate(subProgress, [0, 1], [0, 1]),
            transform: `translateY(${interpolate(subProgress, [0, 1], [20, 0])}px)`,
            fontSize: 22,
            color: MUTED,
            marginBottom: 40,
            fontWeight: 500,
          }}
        >
          {todayData.subheadline}
        </div>

        {/* Bullet cards */}
        {todayData.bullets.map((bullet, i) => (
          <BulletCard
            key={i}
            bullet={bullet}
            frame={frame}
            fps={fps}
            delay={20 + i * 18}
          />
        ))}
      </div>

      {/* Bottom section */}
      <div>
        {/* Watch out box */}
        <div
          style={{
            opacity: watchOutFade,
            background: `linear-gradient(135deg, #0d1f14, #0a1a1f)`,
            border: `1px solid ${ACCENT}33`,
            borderRadius: 12,
            padding: "14px 20px",
            marginBottom: 20,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <span style={{ fontSize: 22 }}>⚠️</span>
          <span style={{ color: "#ccffdd", fontSize: 18, fontWeight: 500 }}>
            {todayData.watchOut}
          </span>
        </div>

        {/* CTA */}
        <div
          style={{
            opacity: ctaFade,
            textAlign: "center",
            color: ACCENT,
            fontSize: 20,
            fontWeight: 700,
            letterSpacing: 1,
            paddingBottom: 20,
          }}
        >
          {todayData.ctaText} →
        </div>
      </div>

      <ProgressBar frame={frame} durationInFrames={durationInFrames} />
    </AbsoluteFill>
  );
}
