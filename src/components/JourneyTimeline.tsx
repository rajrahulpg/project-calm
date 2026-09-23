"use client";

import { useEffect, useRef, useState } from "react";
import { Activity, BedDouble, Handshake, HeartPulse, ScanLine, Stethoscope, type LucideIcon } from "lucide-react";
import SectionReveal from "./SectionReveal";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { useLanguage } from "@/lib/language";
import { scrollToElement } from "@/lib/smooth-scroll";

const STEP_ICONS: LucideIcon[] = [Stethoscope, ScanLine, Handshake, Activity, BedDouble, HeartPulse];

export default function JourneyTimeline() {
  const { t } = useLanguage();
  const reducedMotion = usePrefersReducedMotion();
  const listRef = useRef<HTMLOListElement>(null);
  const [progress, setProgress] = useState(0);
  const [track, setTrack] = useState<{ top: number; height: number } | null>(null);
  const total = t.JOURNEY_STEPS.length;

  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const focusLine = window.innerHeight * 0.55;
      setProgress(Math.max(0, Math.min(1, (focusLine - rect.top) / rect.height)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  // The track should run exactly between the first and last node's centers —
  // not a fixed inset from the list's edges — since each step's card height
  // (and so each row's height) varies with its text length. Measured live
  // rather than assumed, so it stays correct across content/language changes
  // and responsive reflow.
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;

    const update = () => {
      const nodes = el.querySelectorAll<HTMLElement>("[data-timeline-node]");
      if (nodes.length < 2) return;
      const first = nodes[0];
      const last = nodes[nodes.length - 1];
      const containerTop = el.getBoundingClientRect().top;
      const firstCenter = first.getBoundingClientRect().top - containerTop + first.offsetHeight / 2;
      const lastCenter = last.getBoundingClientRect().top - containerTop + last.offsetHeight / 2;
      setTrack({ top: firstCenter, height: lastCenter - firstCenter });
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, [t]);

  const activeIndex = Math.min(total - 1, Math.floor(progress * total));

  return (
    <section id="journey" style={{ background: "var(--color-bg-0)", padding: "var(--section-py) 0" }}>
      <div className="max-w-5xl mx-auto px-6 md:px-12">
        <SectionReveal>
          <h2 className="text-3xl sm:text-4xl md:text-[2.4rem] font-medium mb-16 text-center" style={{ color: "var(--color-heading)" }}>
            {t.JOURNEY_TITLE}
          </h2>
        </SectionReveal>

        <ol ref={listRef} className="relative">
          <div
            className="absolute w-px left-6 md:left-1/2 md:-translate-x-1/2"
            style={{ background: "var(--color-line)", top: track?.top ?? 24, height: track ? track.height : "calc(100% - 48px)" }}
            aria-hidden="true"
          >
            <div
              className="w-full"
              style={{
                height: `${progress * 100}%`,
                background: "var(--color-coral)",
                boxShadow: "0 0 12px var(--color-coral-soft)",
                transition: reducedMotion ? "none" : "height 0.25s linear",
              }}
            />
          </div>

          {t.JOURNEY_STEPS.map((step, i) => {
            const Icon = STEP_ICONS[i % STEP_ICONS.length];
            const state = i < activeIndex ? "completed" : i === activeIndex ? "active" : "upcoming";
            const isLeft = i % 2 === 0;
            return (
              <li
                key={step.num}
                className="relative grid grid-cols-[48px_1fr] md:grid-cols-[1fr_72px_1fr] gap-x-5 md:gap-x-6 pb-12 last:pb-0"
              >
                <div data-timeline-node className="col-start-1 md:col-start-2 row-start-1 justify-self-center relative" style={{ width: 48, height: 48 }}>
                  {state === "active" && !reducedMotion && (
                    <span className="node-pulse absolute inset-0 rounded-full" style={{ border: "1.5px solid var(--color-coral)" }} aria-hidden="true" />
                  )}
                  <button
                    type="button"
                    aria-label={`${t.UI.journey.progress(i + 1, total)}: ${step.title}`}
                    onClick={(e) => {
                      const li = e.currentTarget.closest("li");
                      if (li) scrollToElement(li, window.innerHeight * 0.4);
                    }}
                    className="absolute inset-0 flex items-center justify-center rounded-full transition-all duration-500 hover:scale-110"
                    style={{
                      background: state === "active" ? "var(--color-coral)" : state === "completed" ? "var(--color-coral-tint)" : "var(--color-bg-1)",
                      border: `1.5px solid ${state === "upcoming" ? "var(--color-line)" : "var(--color-coral)"}`,
                      transform: state === "active" ? "scale(1.12)" : undefined,
                    }}
                  >
                    <Icon
                      size={20}
                      strokeWidth={1.75}
                      color={state === "active" ? "var(--color-on-accent)" : state === "completed" ? "var(--color-coral)" : "var(--color-text-muted)"}
                    />
                  </button>
                </div>

                <div
                  className={`row-start-1 col-start-2 ${isLeft ? "md:col-start-1 md:text-right" : "md:col-start-3"} rounded-2xl p-6 sm:p-7 transition-all duration-500`}
                  style={{
                    background: state === "active" ? "var(--color-coral-tint)" : "var(--color-card)",
                    border: `1px solid ${state === "active" ? "var(--color-coral-soft)" : "var(--color-line)"}`,
                    opacity: state === "upcoming" ? 0.45 : 1,
                    transform: state === "active" ? "translateY(-3px)" : "translateY(0)",
                    boxShadow: state === "active" ? "0 24px 48px -32px var(--color-coral-glow)" : "none",
                  }}
                >
                  <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] mb-2" style={{ color: "var(--color-coral)" }}>
                    {t.UI.journey.progress(i + 1, total)}
                  </span>
                  <h3 className="text-xl font-medium" style={{ color: "var(--color-text)" }}>
                    {step.title}
                  </h3>
                  <p className="mt-2 text-base leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                    {step.body}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
