"use client";

import { useEffect, useRef, useState } from "react";
import { Wind } from "lucide-react";
import SectionReveal from "./SectionReveal";
import { AuroraBlobs } from "./HeroBackdrop";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { useLanguage } from "@/lib/language";

type Phase = "inhale" | "hold" | "exhale";

const INHALE_MS = 4000;
const HOLD_MS = 2000;
const EXHALE_MS = 6000;
const CYCLE_MS = INHALE_MS + HOLD_MS + EXHALE_MS;

const easeInOut = (x: number) => 0.5 - Math.cos(Math.PI * x) / 2;

function BreathingCircle() {
  const { t } = useLanguage();
  const ui = t.UI.breathing;
  const reducedMotion = usePrefersReducedMotion();
  const [running, setRunning] = useState(false);
  const [phase, setPhase] = useState<Phase>("inhale");
  const phaseRef = useRef<Phase>("inhale");
  const circleRef = useRef<HTMLDivElement>(null);
  const haloRef = useRef<HTMLDivElement>(null);

  const stop = () => {
    setRunning(false);
    phaseRef.current = "inhale";
    setPhase("inhale");
    if (circleRef.current) circleRef.current.style.transform = "scale(1)";
    if (haloRef.current) haloRef.current.style.transform = "scale(1)";
  };

  useEffect(() => {
    if (!running) return;
    const circle = circleRef.current;
    const halo = haloRef.current;

    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const elapsed = (now - start) % CYCLE_MS;
      let next: Phase;
      let scale: number;
      if (elapsed < INHALE_MS) {
        next = "inhale";
        scale = 1 + 0.55 * easeInOut(elapsed / INHALE_MS);
      } else if (elapsed < INHALE_MS + HOLD_MS) {
        next = "hold";
        scale = 1.55;
      } else {
        next = "exhale";
        scale = 1.55 - 0.55 * easeInOut((elapsed - INHALE_MS - HOLD_MS) / EXHALE_MS);
      }
      if (next !== phaseRef.current) {
        phaseRef.current = next;
        setPhase(next);
      }
      if (!reducedMotion) {
        if (circle) circle.style.transform = `scale(${scale})`;
        if (halo) halo.style.transform = `scale(${1 + (scale - 1) * 1.6})`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, reducedMotion]);

  const label = running ? ui[phase] : "";

  return (
    <div className="mt-14 flex flex-col items-center">
      <div className="relative flex items-center justify-center" style={{ width: 260, height: 260 }}>
        <div
          ref={haloRef}
          className="absolute rounded-full"
          style={{ width: 150, height: 150, background: "var(--color-coral)", opacity: 0.1, transition: "transform 0.1s linear", willChange: "transform" }}
          aria-hidden="true"
        />
        <div
          className="absolute rounded-full"
          style={{ width: 236, height: 236, border: "1px dashed var(--color-coral-soft)" }}
          aria-hidden="true"
        />
        <div
          ref={circleRef}
          className="relative flex items-center justify-center rounded-full"
          style={{
            width: 150,
            height: 150,
            background: "radial-gradient(circle at 35% 30%, color-mix(in srgb, var(--color-coral) 80%, white) 0%, var(--color-coral) 70%)",
            boxShadow: "0 30px 60px -30px var(--color-coral-glow)",
            transition: "transform 0.1s linear",
            willChange: "transform",
          }}
        >
          <span
            key={label}
            className="celebrate-pop text-[11px] font-semibold uppercase tracking-[0.18em] text-center px-4"
            style={{ color: "var(--color-on-accent)" }}
            aria-live="polite"
          >
            {label}
          </span>
        </div>
      </div>

      <button
        type="button"
        onClick={() => (running ? stop() : setRunning(true))}
        className="mt-6 inline-flex items-center gap-2 px-7 py-3 rounded-full text-[12px] font-semibold uppercase tracking-[0.14em] transition-all hover:-translate-y-0.5"
        style={
          running
            ? { border: "1px solid var(--color-coral)", color: "var(--color-coral)" }
            : { background: "var(--color-coral)", color: "var(--color-on-accent)" }
        }
      >
        <Wind size={15} />
        {running ? ui.stop : ui.cta}
      </button>
      <p className="mt-4 text-xs" style={{ color: "var(--color-text-muted)", opacity: 0.8 }}>
        {ui.hint}
      </p>
    </div>
  );
}

export default function EmotionalSection() {
  const { t } = useLanguage();
  const EMOTIONAL_SECTION = t.EMOTIONAL_SECTION;
  return (
    <section
      className="relative overflow-hidden flex items-center justify-center"
      style={{ background: "var(--color-bg-0)", minHeight: "80vh", padding: "var(--section-py-sm) 0" }}
    >
      <AuroraBlobs intensity={0.1} />
      <div className="relative z-10 max-w-2xl mx-auto px-6 text-center">
        <SectionReveal>
          <h2 className="text-3xl sm:text-4xl md:text-[2.6rem] font-medium leading-tight" style={{ color: "var(--color-heading)" }}>
            {EMOTIONAL_SECTION.title}
          </h2>
        </SectionReveal>
        <SectionReveal delay={150}>
          <p className="mt-8 text-base sm:text-lg leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
            {EMOTIONAL_SECTION.body}
          </p>
        </SectionReveal>
        <SectionReveal delay={300}>
          <BreathingCircle />
        </SectionReveal>
      </div>
    </section>
  );
}
