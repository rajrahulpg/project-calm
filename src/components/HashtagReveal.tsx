"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { useLanguage } from "@/lib/language";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// The campaign line, revealed one word per scroll step. Same in every
// language (it's the campaign hashtag), so it isn't in content.ts.
const WORDS = [
  { text: "Har", accent: false },
  { text: "Blockage", accent: true },
  { text: "Same", accent: false },
  { text: "Nahi", accent: false },
  { text: "Hota", accent: false },
];

// Scroll timeline (fractions of the pinned scroll distance):
//   0 → HASH_IN              "#" pops in alone, big, at screen center
//   HASH_IN → HASH_HOLD      it holds there for a beat
//   HASH_HOLD → HASH_MOVE    it slides left into its slot in front of "Har"
//   HASH_MOVE → WORDS_END    the words pop in one at a time
//   WORDS_END → MERGE_END    the words shrink away and the joined hashtag lands
//   MERGE_END → 1            hold on the hashtag, then the page scrolls on
const HASH_IN = 0.07;
const HASH_HOLD = 0.11;
const HASH_MOVE = 0.21;
const WORDS_END = 0.62;
const MERGE_END = 0.8;
const SCROLL_VH = 440;
const HASH_CENTER_SCALE = 1.5;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);
const easeBack = (t: number) => 1 + 2.2 * Math.pow(t - 1, 3) + 1.2 * Math.pow(t - 1, 2);

const display = { fontFamily: "var(--font-display)", fontWeight: 800 } as const;

// Two lines on phones (so it can be big), one line from `sm` up.
function Hashtag() {
  return (
    <>
      <span style={{ color: "var(--color-coral)" }}>#</span>Har<span style={{ color: "var(--color-coral)" }}>Blockage</span>
      <br className="sm:hidden" />
      SameNahiHota
    </>
  );
}

const HASHTAG_SIZE = "text-[11vw] sm:text-[5.6vw] 2xl:text-[5.5rem]";

export default function HashtagReveal() {
  const { t } = useLanguage();
  const reducedMotion = usePrefersReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const wordsRef = useRef<HTMLDivElement>(null);
  const wordRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const hashRef = useRef<HTMLSpanElement>(null);
  const finalRef = useRef<HTMLDivElement>(null);
  const underlineRef = useRef<SVGPathElement>(null);
  const captionRef = useRef<HTMLParagraphElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (reducedMotion) return;
    const section = sectionRef.current;
    if (!section) return;

    // Direct style writes (no React state) — this runs every scroll frame.
    const apply = (p: number) => {
      // "#": starts at the center of the words block (≈ screen center),
      // then travels back to its real layout slot. offsetLeft/Top ignore
      // transforms, so this always measures the slot itself.
      const hash = hashRef.current;
      const words = wordsRef.current;
      if (hash && words) {
        const dx = words.clientWidth / 2 - (hash.offsetLeft + hash.offsetWidth / 2);
        const dy = words.clientHeight / 2 - (hash.offsetTop + hash.offsetHeight / 2);
        const a = clamp01(p / HASH_IN);
        const mv = easeOut(clamp01((p - HASH_HOLD) / (HASH_MOVE - HASH_HOLD)));
        const scale = (0.3 + 0.7 * easeBack(a)) * (HASH_CENTER_SCALE - (HASH_CENTER_SCALE - 1) * mv);
        hash.style.opacity = String(easeOut(a));
        hash.style.transform = `translate(${(1 - mv) * dx}px, ${(1 - mv) * dy}px) scale(${scale}) rotate(${(1 - a) * -20}deg)`;
        hash.style.filter = `blur(${(1 - a) * 12}px)`;
      }

      const step = (WORDS_END - HASH_MOVE) / WORDS.length;
      wordRefs.current.forEach((el, i) => {
        if (!el) return;
        const k = clamp01((p - HASH_MOVE - i * step) / step);
        const pop = easeBack(k);
        el.style.opacity = String(easeOut(k));
        el.style.transform = `translateY(${(1 - easeOut(k)) * 70}%) scale(${0.6 + 0.4 * pop}) rotate(${(1 - k) * (i % 2 ? 6 : -6)}deg)`;
        el.style.filter = `blur(${(1 - k) * 12}px)`;
      });

      const m = clamp01((p - WORDS_END) / (MERGE_END - WORDS_END));
      if (words) {
        words.style.opacity = String(1 - easeOut(m));
        words.style.transform = `scale(${1 - 0.35 * easeOut(m)})`;
        words.style.filter = `blur(${m * 10}px)`;
      }
      const fin = finalRef.current;
      if (fin) {
        const f = clamp01((m - 0.25) / 0.75);
        fin.style.opacity = String(easeOut(f));
        fin.style.transform = `scale(${1.25 - 0.25 * easeBack(f)})`;
        fin.style.letterSpacing = `${(1 - easeOut(f)) * 0.12}em`;
      }
      const hold = clamp01((p - MERGE_END) / (1 - MERGE_END));
      if (underlineRef.current) underlineRef.current.style.strokeDashoffset = String(1 - easeOut(clamp01(hold * 2.2)));
      if (captionRef.current) {
        const c = clamp01((hold - 0.2) * 3);
        captionRef.current.style.opacity = String(c);
        captionRef.current.style.transform = `translateY(${(1 - c) * 16}px)`;
      }
      if (glowRef.current) glowRef.current.style.opacity = String(0.25 + 0.75 * clamp01(p / MERGE_END));
    };

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.4,
      onUpdate: (self) => apply(self.progress),
    });
    apply(trigger.progress);

    // The hero video above settles its height after hydration (notably on
    // mobile), which moves this section after the trigger measured it.
    // Re-measure whenever the page height changes, debounced.
    let timer: ReturnType<typeof setTimeout> | undefined;
    const ro = new ResizeObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(() => ScrollTrigger.refresh(), 150);
    });
    ro.observe(document.body);

    return () => {
      clearTimeout(timer);
      ro.disconnect();
      trigger.kill();
    };
  }, [reducedMotion]);

  // Reduced motion: no pinning, just the finished hashtag.
  if (reducedMotion) {
    return (
      <section className="px-6 text-center" style={{ background: "var(--color-bg-0)", padding: "var(--section-py) 1.5rem" }}>
        <p className={`whitespace-nowrap leading-[1.05] ${HASHTAG_SIZE}`} style={{ ...display, color: "var(--color-text)" }}>
          <Hashtag />
        </p>
        <p className="mt-6 text-sm sm:text-lg" style={{ color: "var(--color-text-muted)" }}>{t.HASHTAG_REVEAL.caption}</p>
      </section>
    );
  }

  return (
    <section ref={sectionRef} aria-label="#HarBlockageSameNahiHota" className="relative" style={{ background: "var(--color-bg-0)", height: `${SCROLL_VH}vh` }}>
      <div className="sticky top-0 h-[100dvh] overflow-hidden flex items-center justify-center px-5">
        <div
          ref={glowRef}
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(55% 45% at 50% 50%, var(--color-coral-tint) 0%, transparent 70%)", opacity: 0.25 }}
          aria-hidden="true"
        />

        {/* Stage 1: the words, one by one */}
        <div ref={wordsRef} className="absolute inset-x-5 flex flex-wrap justify-center items-baseline leading-[1.02] text-center" aria-hidden="true">
          {WORDS.map((w, i) => (
            // Static wrapper per word: holds the size and spacing (em margins,
            // so they scale with the huge type — a flex gap would be measured
            // against the 16px parent) and keeps "#" + "Har" on one line.
            // Only the inner spans animate, so "#" can show before "Har".
            <span
              key={w.text}
              className="inline-block mx-[0.13em] whitespace-nowrap"
              style={{ ...display, fontSize: "clamp(3.4rem, 14vw, 10.5rem)" }}
            >
              {i === 0 && (
                <span ref={hashRef} className="relative z-10 inline-block will-change-transform" style={{ color: "var(--color-coral)", opacity: 0 }}>
                  #
                </span>
              )}
              <span
                ref={(el) => { wordRefs.current[i] = el; }}
                className="inline-block will-change-transform"
                style={{ color: w.accent ? "var(--color-coral)" : "var(--color-text)", opacity: 0 }}
              >
                {w.text}
              </span>
            </span>
          ))}
        </div>

        {/* Stage 2: the campaign hashtag */}
        <div ref={finalRef} className="relative flex flex-col items-center text-center will-change-transform" style={{ opacity: 0 }}>
          <p className={`whitespace-nowrap leading-[1.05] ${HASHTAG_SIZE}`} style={{ ...display, color: "var(--color-text)" }}>
            <Hashtag />
          </p>
          <svg viewBox="0 0 400 24" preserveAspectRatio="none" className="w-[86%] h-3 sm:h-5 mt-2 sm:mt-4" aria-hidden="true">
            <path
              ref={underlineRef}
              d="M4 16 C 90 4, 200 22, 300 10 S 380 12, 396 8"
              pathLength={1}
              fill="none"
              stroke="var(--color-coral)"
              strokeWidth={5}
              strokeLinecap="round"
              style={{ strokeDasharray: 1, strokeDashoffset: 1 }}
            />
          </svg>
          <p ref={captionRef} className="mt-5 sm:mt-8 text-sm sm:text-xl max-w-xl" style={{ color: "var(--color-text-muted)", opacity: 0 }}>
            {t.HASHTAG_REVEAL.caption}
          </p>
        </div>
      </div>
    </section>
  );
}
