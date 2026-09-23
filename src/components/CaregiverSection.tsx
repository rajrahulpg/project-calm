"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { HandHeart } from "lucide-react";
import SectionReveal from "./SectionReveal";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { useLanguage } from "@/lib/language";
import { scrollToY } from "@/lib/smooth-scroll";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// One full viewport height of scroll per tip — the section pins in place
// while scrolling through it. Each tip is its own physical card; scrolling
// slides the next card up from below while the current one recedes and
// tucks in behind it, like flipping through a deck — rather than swapping
// text inside one static box. The pin releases back to normal scrolling
// once the last card has settled.
const VH_PER_TIP = 100;
const MAX_STACK_DEPTH = 4;

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v));

// Presents the approved paragraph one sentence at a time — the copy itself is
// untouched, only split on sentence-ending punctuation (Latin and Devanagari).
function splitSentences(text: string) {
  return (text.match(/[^.।!?]+[.।!?]+/g) ?? [text]).map((s) => s.trim()).filter(Boolean);
}

export default function CaregiverSection() {
  const { t } = useLanguage();
  const reducedMotion = usePrefersReducedMotion();
  const CAREGIVER_SECTION = t.CAREGIVER_SECTION;
  const ui = t.UI.caregiver;
  const tips = useMemo(() => splitSentences(CAREGIVER_SECTION.body), [CAREGIVER_SECTION.body]);
  const total = tips.length;
  const pinned = !reducedMotion && total > 1;

  const [current, setCurrent] = useState(0);
  const currentRef = useRef(0);
  const sectionRef = useRef<HTMLElement>(null);
  const cardRefs = useRef<Array<HTMLDivElement | null>>([]);

  useEffect(() => {
    if (!pinned) return;
    const section = sectionRef.current;
    if (!section) return;

    const applyStack = (progress: number) => {
      const raw = clamp(progress, 0, 1) * total;
      const activeIndex = Math.min(total - 1, Math.floor(raw));
      const hasNext = activeIndex + 1 < total;
      const activeFrac = hasNext ? raw - activeIndex : 0;

      if (activeIndex !== currentRef.current) {
        currentRef.current = activeIndex;
        setCurrent(activeIndex);
      }

      cardRefs.current.forEach((el, i) => {
        if (!el) return;
        if (i <= activeIndex) {
          // Already shown (or currently active): stays put, only easing back in
          // scale/opacity/tilt as later cards slide in on top of it — no
          // vertical shift, so it never peeks out from behind the opaque card
          // sliding over it.
          const recede = Math.min((activeIndex - i) + (i === activeIndex ? activeFrac : 0), MAX_STACK_DEPTH);
          const scale = 1 - 0.045 * recede;
          const rotate = recede > 0.02 ? (i % 2 === 0 ? -1 : 1) * Math.min(recede, 3) : 0;
          const opacity = Math.max(0.22, 1 - 0.32 * recede);
          el.style.transform = `translateY(0) scale(${scale}) rotate(${rotate}deg)`;
          el.style.opacity = String(opacity);
          el.style.zIndex = String(i + 1);
          el.style.boxShadow = recede < 0.05 ? "0 24px 48px -26px var(--color-coral-glow)" : "0 12px 26px -18px rgba(0,0,0,0.28)";
          el.style.pointerEvents = recede < 0.05 ? "auto" : "none";
        } else if (hasNext && i === activeIndex + 1) {
          // Incoming: fully opaque throughout, sliding up from directly below
          // the card's own footprint (clipped out of view by the stack's
          // `overflow: hidden` until it arrives) so it physically covers the
          // previous card rather than cross-fading through it.
          const y = (1 - activeFrac) * 100;
          const scale = 0.94 + 0.06 * activeFrac;
          el.style.transform = `translateY(${y}%) scale(${scale}) rotate(0deg)`;
          el.style.opacity = "1";
          el.style.zIndex = String(i + 1);
          el.style.boxShadow = "0 24px 48px -26px var(--color-coral-glow)";
          el.style.pointerEvents = "none";
        } else {
          el.style.transform = "translateY(100%) scale(0.94) rotate(0deg)";
          el.style.opacity = "0";
          el.style.zIndex = "0";
          el.style.pointerEvents = "none";
        }
      });
    };

    const trigger = ScrollTrigger.create({
      trigger: section,
      start: "top top",
      end: "bottom bottom",
      scrub: 0.4,
      onUpdate: (self) => applyStack(self.progress),
    });
    applyStack(trigger.progress);

    return () => trigger.kill();
  }, [pinned, total]);

  const jumpTo = (i: number) => {
    if (!pinned) return;
    const section = sectionRef.current;
    if (!section) return;
    const rect = section.getBoundingClientRect();
    const sectionTop = rect.top + window.scrollY;
    const segment = rect.height / total;
    scrollToY(sectionTop + segment * (i + 0.5));
  };

  const header = (
    <div className="flex items-center gap-5 mb-8">
      <span className="flex items-center justify-center rounded-full shrink-0" style={{ width: 52, height: 52, background: "var(--color-coral-tint)" }}>
        <HandHeart size={24} color="var(--color-coral)" strokeWidth={1.75} />
      </span>
      <h2 className="text-2xl sm:text-3xl font-medium" style={{ color: "var(--color-heading)" }}>
        {CAREGIVER_SECTION.title}
      </h2>
    </div>
  );

  if (!pinned) {
    return (
      <section style={{ background: "var(--color-bg-1)", padding: "var(--section-py) 0" }}>
        <div className="max-w-4xl mx-auto px-6 md:px-12">
          <SectionReveal>
            <div className="rounded-2xl p-8 sm:p-12" style={{ background: "var(--color-card)", border: "1px solid var(--color-line)" }}>
              {header}
              <div className="flex flex-col gap-5">
                {tips.map((tip, i) => (
                  <div key={tip} className="flex gap-4">
                    <span className="shrink-0 text-xs font-semibold tabular-nums mt-1.5" style={{ color: "var(--color-coral)" }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-xl sm:text-2xl md:text-[1.7rem] leading-relaxed" style={{ color: "var(--color-text)" }}>
                      {tip}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </SectionReveal>
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative" style={{ background: "var(--color-bg-1)", height: `${total * VH_PER_TIP}vh` }}>
      <div className="sticky top-24 md:top-28 flex items-center px-6" style={{ minHeight: "calc(100vh - 6rem)" }}>
        <div className="max-w-4xl mx-auto w-full">
          {header}

          <div className="relative" style={{ minHeight: "11rem", overflow: "hidden" }} aria-live="polite">
            {tips.map((tip, i) => (
              <div
                key={tip}
                ref={(el) => {
                  cardRefs.current[i] = el;
                }}
                className="absolute inset-0 rounded-2xl p-6 sm:p-8"
                style={{
                  background: "var(--color-bg-0)",
                  border: "1px solid var(--color-line)",
                  willChange: "transform, opacity",
                  transform: i === 0 ? "none" : "translateY(100%) scale(0.94)",
                  opacity: i === 0 ? 1 : 0,
                }}
                aria-hidden={i !== current}
              >
                <span
                  className="inline-block text-[11px] font-semibold uppercase tracking-[0.16em] mb-3 px-2.5 py-1 rounded-full"
                  style={{ color: "var(--color-coral)", background: "var(--color-coral-tint)" }}
                >
                  {ui.counter(i + 1, total)}
                </span>
                <p className="text-lg sm:text-xl md:text-[1.5rem] leading-relaxed" style={{ color: "var(--color-text)" }}>
                  {tip}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-10 flex items-center justify-center gap-2">
            {tips.map((tip, i) => (
              <button
                key={tip}
                type="button"
                aria-label={ui.counter(i + 1, total)}
                aria-current={i === current}
                onClick={() => jumpTo(i)}
                className="flex items-center justify-center p-3.5 -m-3.5"
              >
                <span
                  aria-hidden="true"
                  className="block h-2 rounded-full transition-all duration-500"
                  style={{ width: i === current ? 28 : 8, background: i === current ? "var(--color-coral)" : "var(--color-line)" }}
                />
              </button>
            ))}
            <span className="ml-3 text-xs tabular-nums" style={{ color: "var(--color-text-muted)" }}>
              {ui.counter(current + 1, total)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
