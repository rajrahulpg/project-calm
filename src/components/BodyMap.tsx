"use client";

import { useState } from "react";
import { Footprints, Heart } from "lucide-react";
import SectionReveal from "./SectionReveal";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { useLanguage } from "@/lib/language";

type Region = "cad" | "pad";

const BODY_OUTLINE =
  "M72,70 L128,70 C144,70 152,82 154,96 L166,176 C168,188 156,194 150,184 L138,116 L140,210 L134,290 L130,400 L106,400 L102,300 L100,240 L98,300 L94,400 L70,400 L66,290 L60,210 L62,116 L50,184 C44,194 32,188 34,176 L46,96 C48,82 56,70 72,70 Z";
const HEART_SHAPE = "M100,152 C84,141 78,124 90,116 C96,112 100,118 100,121 C100,118 104,112 110,116 C122,124 116,141 100,152 Z";

const CAD_ARTERIES = ["M100,86 L100,116", "M95,120 C88,128 90,140 97,147", "M105,120 C112,128 110,140 103,147"];
const PAD_ARTERIES = ["M100,152 L100,214", "M100,214 C94,240 88,300 84,388", "M100,214 C106,240 112,300 116,388"];

function FlowDots({ paths, animate }: { paths: string[]; animate: boolean }) {
  if (!animate) return null;
  return (
    <>
      {paths.map((d, i) =>
        [0, 1].map((j) => (
          <circle key={`${i}-${j}`} r={2.4} fill="var(--color-coral)">
            <animateMotion dur="2.6s" begin={`${i * 0.4 + j * 1.3}s`} repeatCount="indefinite" path={d} />
            <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.1;0.9;1" dur="2.6s" begin={`${i * 0.4 + j * 1.3}s`} repeatCount="indefinite" />
          </circle>
        ))
      )}
    </>
  );
}

function Hotspot({ cx, cy, active, label, onSelect, animate }: { cx: number; cy: number; active: boolean; label: string; onSelect: () => void; animate: boolean }) {
  return (
    <g
      role="button"
      tabIndex={0}
      aria-label={label}
      aria-pressed={active}
      onClick={onSelect}
      onMouseEnter={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      style={{ cursor: "pointer", outline: "none" }}
    >
      <circle cx={cx} cy={cy} r={22} fill="transparent" />
      {animate && (
        <circle cx={cx} cy={cy} r={9} fill="none" stroke="var(--color-coral)" strokeWidth={1.5}>
          <animate attributeName="r" values="9;24" dur="2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.7;0" dur="2s" repeatCount="indefinite" />
        </circle>
      )}
      <circle cx={cx} cy={cy} r={active ? 9 : 7} fill={active ? "var(--color-coral)" : "var(--color-bg-0)"} stroke="var(--color-coral)" strokeWidth={2} style={{ transition: "r 0.3s, fill 0.3s" }} />
    </g>
  );
}

export default function BodyMap() {
  const { t } = useLanguage();
  const reducedMotion = usePrefersReducedMotion();
  const [region, setRegion] = useState<Region>("cad");
  const animate = !reducedMotion;

  const CARDS: Array<{ key: Region; title: string; body: string; icon: typeof Heart }> = [
    { key: "cad", title: t.CAD_PAD.cad.title, body: t.CAD_PAD.cad.body, icon: Heart },
    { key: "pad", title: t.CAD_PAD.pad.title, body: t.CAD_PAD.pad.body, icon: Footprints },
  ];

  const activePaths = region === "cad" ? CAD_ARTERIES : PAD_ARTERIES;

  return (
    <section style={{ background: "var(--color-bg-1)", padding: "var(--section-py) 0" }}>
      <div className="max-w-5xl mx-auto px-6 md:px-12 grid md:grid-cols-[0.75fr_1.25fr] gap-10 md:gap-16 items-center">
        <SectionReveal className="flex flex-col items-center">
          <p className="text-xs sm:text-sm mb-4" style={{ color: "var(--color-text-muted)", opacity: 0.8 }}>
            {t.UI.bodyMap.hint}
          </p>
          <svg viewBox="0 0 200 420" className="w-full max-w-[220px] h-auto" role="group" aria-label={t.UI.bodyMap.hint}>
            <circle cx={100} cy={36} r={24} fill="var(--color-card)" stroke="var(--color-text-muted)" strokeWidth={1.2} opacity={0.7} />
            <path d={BODY_OUTLINE} fill="var(--color-card)" stroke="var(--color-text-muted)" strokeWidth={1.2} opacity={0.7} />

            <g fill="none" stroke="var(--color-text-muted)" strokeWidth={1.5} strokeLinecap="round" opacity={0.35}>
              {[...CAD_ARTERIES, ...PAD_ARTERIES].map((d) => <path key={d} d={d} />)}
            </g>

            <path
              d={HEART_SHAPE}
              className={region === "cad" && animate ? "heartbeat" : ""}
              fill={region === "cad" ? "var(--color-coral)" : "var(--color-coral-soft)"}
              style={{ transition: "fill 0.4s" }}
              opacity={region === "cad" ? 0.9 : 0.6}
            />

            <g key={region} fill="none" stroke="var(--color-coral)" strokeWidth={2.4} strokeLinecap="round">
              {activePaths.map((d) => (
                <path key={d} d={d} pathLength={600} className={animate ? "draw-in" : ""} />
              ))}
            </g>
            <FlowDots key={`dots-${region}`} paths={activePaths} animate={animate} />

            <Hotspot cx={100} cy={132} active={region === "cad"} label={t.UI.bodyMap.heart} onSelect={() => setRegion("cad")} animate={animate && region !== "cad"} />
            <Hotspot cx={84} cy={330} active={region === "pad"} label={t.UI.bodyMap.legs} onSelect={() => setRegion("pad")} animate={animate && region !== "pad"} />
            <Hotspot cx={116} cy={330} active={region === "pad"} label={t.UI.bodyMap.legs} onSelect={() => setRegion("pad")} animate={false} />
          </svg>
        </SectionReveal>

        <div className="flex flex-col gap-5">
          {CARDS.map((card, i) => {
            const Icon = card.icon;
            const isActive = region === card.key;
            return (
              <SectionReveal key={card.key} delay={i * 120}>
                <button
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setRegion(card.key)}
                  onMouseEnter={() => setRegion(card.key)}
                  className="w-full text-left flex items-start gap-5 rounded-2xl p-6 sm:p-8 transition-all duration-500"
                  style={{
                    background: isActive ? "var(--color-coral-tint)" : "var(--color-card)",
                    border: `1px solid ${isActive ? "var(--color-coral)" : "var(--color-line)"}`,
                    transform: isActive ? "translateY(-3px)" : "translateY(0)",
                    boxShadow: isActive ? "0 24px 48px -30px var(--color-coral-glow)" : "none",
                    opacity: isActive ? 1 : 0.78,
                  }}
                >
                  <span
                    className="shrink-0 flex items-center justify-center rounded-full transition-colors duration-300"
                    style={{ width: 52, height: 52, background: isActive ? "var(--color-coral)" : "var(--color-coral-tint)" }}
                  >
                    <Icon size={24} color={isActive ? "var(--color-on-accent)" : "var(--color-coral)"} strokeWidth={1.75} />
                  </span>
                  <span>
                    <span className="block text-xl sm:text-2xl font-medium" style={{ color: "var(--color-text)" }}>
                      {card.title}
                    </span>
                    <span className="block mt-2 text-base leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                      {card.body}
                    </span>
                  </span>
                </button>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
