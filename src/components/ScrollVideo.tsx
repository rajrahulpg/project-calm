"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Play } from "lucide-react";
import { useIsMobile, usePrefersReducedMotion } from "@/lib/hooks";
import { useLanguage } from "@/lib/language";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// How much of the scroll range the opening headline stays visible for,
// before it fades out completely.
const HERO_FADE_END = 0.06;
// The story captions only start fading in once the headline is fully gone —
// a clean handoff instead of a cross-dissolve where both are half-visible.
const CAPTION_FADE_END = HERO_FADE_END + 0.05;

export default function ScrollVideo() {
  const { t } = useLanguage();
  const sectionRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const captionLayerRef = useRef<HTMLDivElement>(null);
  const targetProgress = useRef(0);
  const smoothProgress = useRef(0);
  const activeBeatRef = useRef(-1);

  const [activeBeat, setActiveBeat] = useState(-1);
  const [needsPlayButton, setNeedsPlayButton] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const reducedMotion = usePrefersReducedMotion();
  // Purely a layout choice now (a shorter scroll distance on narrow
  // screens) — every device scrubs the video by scroll position, touch
  // included, so this no longer changes how the video itself plays. Video
  // scrubbing used to be skipped on touch devices because repeated
  // video.currentTime seeks caused scroll jank there; re-encoding the clip
  // with a short keyframe interval and no B-frames (cheap to seek to)
  // resolved that, so the same scroll-tied scrubbing now runs everywhere —
  // matching the desktop experience on mobile instead of an autoplaying
  // loop that ignored scroll position.
  const isMobile = useIsMobile();

  // ── Reduced motion: play the clip normally, no scrubbing ────────────
  useEffect(() => {
    if (!reducedMotion) return;
    videoRef.current?.play().catch(() => setNeedsPlayButton(true));
  }, [reducedMotion]);

  // ── Scroll-driven text timeline + video scrubbing ───────────────────
  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    const video = videoRef.current;
    if (!section || !video) return;

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      onUpdate: (self) => {
        targetProgress.current = self.progress;
      },
    });

    const tick = () => {
      const diff = targetProgress.current - smoothProgress.current;
      // Snap once the gap is imperceptible instead of chasing it forever —
      // pure exponential smoothing never quite reaches zero, so without
      // this the loop keeps nudging video.currentTime by sub-frame amounts
      // indefinitely after the scroll settles.
      smoothProgress.current += Math.abs(diff) < 0.0005 ? diff : diff * 0.12;

      const duration = Number.isFinite(video.duration) && video.duration > 0 ? video.duration : t.VIDEO_DURATION;
      const time = smoothProgress.current * duration;

      if (Math.abs(video.currentTime - time) > 0.04) {
        try {
          video.currentTime = time;
        } catch {
          // seeking before metadata is ready — ignore, next tick retries
        }
      }

      const heroOpacity = Math.max(0, 1 - smoothProgress.current / HERO_FADE_END);
      if (heroRef.current) {
        heroRef.current.style.opacity = String(heroOpacity);
        heroRef.current.style.transform = `translateY(${(1 - heroOpacity) * -24}px)`;
        heroRef.current.style.pointerEvents = heroOpacity > 0.05 ? "auto" : "none";
      }
      if (captionLayerRef.current) {
        const captionOpacity =
          smoothProgress.current <= HERO_FADE_END
            ? 0
            : Math.min(1, (smoothProgress.current - HERO_FADE_END) / (CAPTION_FADE_END - HERO_FADE_END));
        captionLayerRef.current.style.opacity = String(captionOpacity);
      }

      const seconds = smoothProgress.current * t.VIDEO_DURATION;
      const beatIndex = t.VIDEO_STORY_BEATS.findIndex((b) => seconds >= b.from && seconds <= b.to);
      if (beatIndex !== activeBeatRef.current) {
        activeBeatRef.current = beatIndex;
        setActiveBeat(beatIndex);
      }
    };

    gsap.ticker.add(tick);
    return () => {
      gsap.ticker.remove(tick);
      trigger.kill();
    };
  }, [reducedMotion, t]);

  const beat = activeBeat >= 0 ? t.VIDEO_STORY_BEATS[activeBeat] : null;

  return (
    <section
      id="story"
      ref={sectionRef}
      className="relative"
      style={{ height: reducedMotion ? "auto" : isMobile ? "220vh" : "300vh", background: "var(--color-bg-0)" }}
    >
      <div className={reducedMotion ? "relative w-full min-h-screen" : "sticky top-0 h-screen w-full overflow-hidden"}>
        {!videoFailed ? (
          <video
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            src={t.VIDEO_SRC}
            poster={t.VIDEO_POSTER}
            muted
            loop={reducedMotion}
            playsInline
            preload="auto"
            aria-label="Cinematic 3D visualization of a coronary artery, from healthy to calcified to treated"
            onError={() => setVideoFailed(true)}
            onLoadedMetadata={(e) => {
              // Force the browser to decode and paint a real frame instead of
              // sitting on a blank black canvas until playback/seeking begins.
              const v = e.currentTarget;
              if (v.currentTime === 0) {
                try {
                  v.currentTime = 0.01;
                } catch {
                  // ignore — the scroll-driven seek below will catch up
                }
              }
            }}
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: "radial-gradient(120% 100% at 50% 30%, #1a1512 0%, #0A0C0F 55%, #050608 100%)" }}
          />
        )}

        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(180deg, rgba(5,6,8,0.55) 0%, rgba(5,6,8,0.15) 30%, rgba(5,6,8,0) 55%, rgba(5,6,8,0.45) 100%)" }}
        />

        {needsPlayButton && !videoFailed && (
          <button
            onClick={() => videoRef.current?.play().then(() => setNeedsPlayButton(false)).catch(() => {})}
            aria-label="Play video"
            className="absolute inset-0 flex items-center justify-center z-20"
            style={{ background: "rgba(5,6,8,0.3)" }}
          >
            <span className="flex items-center justify-center rounded-full" style={{ width: 64, height: 64, background: "rgba(245,245,242,0.92)" }}>
              <Play size={22} color="#050608" fill="#050608" />
            </span>
          </button>
        )}

        {/* Opening headline — fades out as the visitor starts scrolling */}
        {!reducedMotion && (
          <div
            ref={heroRef}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 md:px-16 pt-20"
            style={{ willChange: "opacity, transform" }}
          >
            <h1
              className="whitespace-pre-line max-w-[900px] text-[1.9rem] sm:text-[2.6rem] md:text-[3.1rem] leading-[1.15] font-medium"
              style={{ color: "#F5F5F2", textShadow: "0 2px 10px rgba(0,0,0,0.9), 0 12px 40px rgba(0,0,0,0.7)" }}
            >
              {t.HERO.headline}
            </h1>
            <p
              className="mt-6 max-w-md text-base sm:text-lg leading-relaxed"
              style={{ color: "#A8ADB3", textShadow: "0 2px 10px rgba(0,0,0,0.9), 0 8px 30px rgba(0,0,0,0.7)" }}
            >
              {t.HERO.subline}
            </p>

            <div className="mt-9 flex items-center justify-center gap-6">
              <a
                href="#understanding"
                className="btn-accent inline-flex items-center px-7 py-3.5 rounded-full text-[12px] font-semibold uppercase tracking-[0.14em]"
              >
                {t.HERO.cta}
              </a>
            </div>
          </div>
        )}

        {/* Story beat captions */}
        {reducedMotion ? (
          <div className="relative z-10 max-w-xl mx-auto px-6 py-16 flex flex-col gap-8">
            <h1 className="whitespace-pre-line text-3xl font-medium" style={{ color: "#F5F5F2" }}>
              {t.HERO.headline}
            </h1>
            {t.VIDEO_STORY_BEATS.map((b) => (
              <p key={b.text} className="text-lg" style={{ color: "#F5F5F2" }}>
                {b.text}
              </p>
            ))}
          </div>
        ) : (
          <div
            ref={captionLayerRef}
            className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center px-6 md:px-10"
            style={{ opacity: 0, willChange: "opacity" }}
          >
            <p
              className="max-w-4xl md:max-w-5xl text-[1.9rem] sm:text-[2.6rem] md:text-[3.1rem] leading-[1.15] font-medium whitespace-normal transition-all duration-700"
              style={{
                color: "#F5F5F2",
                opacity: beat ? 1 : 0,
                transform: beat ? "translateY(0)" : "translateY(16px)",
                textShadow: "0 2px 10px rgba(0,0,0,0.9), 0 10px 36px rgba(0,0,0,0.7)",
              }}
            >
              {beat?.text ?? ""}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
