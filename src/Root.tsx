import React from "react";
import { Composition } from "remotion";
import { MarketReel } from "./MarketReel";

export function RemotionRoot() {
  return (
    <Composition
      id="MarketReel"
      component={MarketReel}
      durationInFrames={1350} // 45 seconds at 30fps
      fps={30}
      width={1080}
      height={1920}  // 9:16 vertical for Shorts/Reels/TikTok
    />
  );
}
