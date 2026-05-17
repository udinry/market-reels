import React from "react";
import { Composition } from "remotion";
import { MarketReel } from "./MarketReel";

export function RemotionRoot() {
  return (
    <Composition
      id="MarketReel"
      component={MarketReel}
      durationInFrames={150}  // 5 seconds at 30fps — adjust to match your voiceover
      fps={30}
      width={1080}
      height={1920}  // 9:16 vertical for Shorts/Reels/TikTok
    />
  );
}
