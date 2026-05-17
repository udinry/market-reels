# market-reels

Daily market news video reels built with **Remotion 4.0.462** + React 18 + TypeScript. Outputs 9:16 vertical MP4s for Instagram Reels, YouTube Shorts, and TikTok.

## Project purpose

Each morning, edit `src/data.ts` (2 minutes of work), then render. The video animates market headlines, bullet points, and a "watch out" alert with spring animations.

## Key files

| File | Role |
|---|---|
| `src/data.ts` | **Daily edit** — date, headline, subheadline, hook, 3 bullets, watchOut, ctaText |
| `src/MarketReel.tsx` | Main composition: all visual components and animation logic |
| `src/Root.tsx` | Remotion root — sets composition id `MarketReel`, 150 frames (5s), 1080×1920 |
| `src/index.ts` | Registers the root with Remotion |
| `remotion.config.ts` | Sets entry point, jpeg image format, overwrites output |

## Commands

```powershell
npm start          # Open Remotion Studio (live preview in browser)
npm run render     # Render to out/reel.mp4
```

## Composition specs

- **Resolution:** 1080 × 1920 (9:16 vertical)
- **FPS:** 30
- **Duration:** 150 frames = 5 seconds
- **Output:** `out/reel.mp4`

## Animation timing (frames at 30fps)

| Element | Delay |
|---|---|
| Date badge | 0 |
| Headline | 5 |
| Sub-headline | 12 |
| Bullet 1 | 20 |
| Bullet 2 | 38 |
| Bullet 3 | 56 |
| Watch out box | 90 |
| CTA | 105 |

## Color palette

| Token | Value |
|---|---|
| `BG` | `#0A0A0F` (near-black background) |
| `CARD_BG` | `#13131A` |
| `ACCENT` | `#00FF94` (neon green) |
| `TEXT` | `#FFFFFF` |
| `MUTED` | `#8888AA` |

## Daily workflow

1. Look up today's top market story
2. Edit `src/data.ts` — fill in date, headline, subheadline, 3 bullets, watchOut, ctaText
3. `npm start` to preview in Remotion Studio
4. `npm run render` to produce `out/reel.mp4`
5. Upload to social platforms

## Extending the video

- To change duration: update `durationInFrames` in `src/Root.tsx`
- To add a new scene/section: add a new component in `MarketReel.tsx` following the `useSlide`/`useFade` pattern
- To change fonts: update the `fontFamily` in the root `AbsoluteFill` style
