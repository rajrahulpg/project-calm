"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { CircleDot, Disc3, RotateCcw, Waves, type LucideIcon } from "lucide-react";
import SectionReveal from "./SectionReveal";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { useLanguage } from "@/lib/language";

// Anatomy artwork keeps fixed colours (not theme-reactive), same as the
// blockage diagram on the home page. The device is a deep ink blue rather
// than the brand accent so it doesn't blend into the red blood cells and the
// warm vessel around it.
const VESSEL_FILL = "#E8C4B8";
const VESSEL_STROKE = "#C99A87";
const LUMEN_FILL = "#FBEAE3";
const PLAQUE_FILL = "#D9B36A";
const CALCIUM_COLOR = "#F4F1EC";
const CRACK_COLOR = "#A57F3E";
const CELL_COLOR = "#C8705C";
const DEVICE_SHAFT = "#5B6B7A";
const DEVICE_ACCENT = "#1B2A41";

const CX = 450;
const CY = 150;
const CELL_COUNT = 5;
const CYCLE = 4.5;
const AUTO_ADVANCE_MS = 7000;

const ICONS: Record<string, LucideIcon> = { ivl: Waves, balloons: CircleDot, atherectomy: Disc3 };

const LUMEN_PATH =
  "M30,80 L250,80 C320,80 330,122 400,122 L500,122 C570,122 580,80 650,80 L870,80 L870,220 L650,220 C580,220 570,178 500,178 L400,178 C330,178 320,220 250,220 L30,220 Z";
const PLAQUE_TOP = "M250,80 C320,80 330,122 400,122 L500,122 C570,122 580,80 650,80 Z";
const PLAQUE_BOTTOM = "M250,220 C320,220 330,178 400,178 L500,178 C570,178 580,220 650,220 Z";
const CALCIUM_TOP = "M340,118 L370,113 L400,119 L430,114 L460,119 L490,114 L520,119 L550,113 L575,116";
const CALCIUM_BOTTOM = "M340,182 L370,187 L400,181 L430,186 L460,181 L490,186 L520,181 L550,187 L575,184";

const CRACKS: Array<[number, number, number, number]> = [
  [372, 112, 368, 124], [430, 112, 434, 124], [490, 112, 486, 124], [548, 112, 552, 124],
  [372, 188, 368, 176], [430, 188, 434, 176], [490, 188, 486, 176], [548, 188, 552, 176],
];
const SCORES: Array<[number, number, number, number]> = [
  [400, 112, 400, 124], [450, 112, 450, 124], [500, 112, 500, 124],
  [400, 188, 400, 176], [450, 188, 450, 176], [500, 188, 500, 176],
];

function BloodCells({ animate }: { animate: boolean }) {
  return (
    <>
      {Array.from({ length: CELL_COUNT }).map((_, i) => {
        const begin = -((i * CYCLE) / CELL_COUNT);
        if (!animate) {
          const t = i / CELL_COUNT;
          const narrow = t > 0.4 && t < 0.65;
          return <circle key={i} cx={30 + t * 840} cy={CY} r={narrow ? 3.5 : 6} fill={CELL_COLOR} opacity={0.9} />;
        }
        return (
          <circle key={i} r={6} fill={CELL_COLOR} opacity={0.9}>
            <animateMotion dur={`${CYCLE}s`} begin={`${begin}s`} repeatCount="indefinite" path={`M30,${CY} L870,${CY}`} />
            <animate attributeName="r" dur={`${CYCLE}s`} begin={`${begin}s`} repeatCount="indefinite" keyTimes="0;0.36;0.42;0.62;0.68;1" values="6;6;3.5;3.5;6;6" />
            <animate attributeName="opacity" dur={`${CYCLE}s`} begin={`${begin}s`} repeatCount="indefinite" keyTimes="0;0.04;0.96;1" values="0;0.9;0.9;0" />
          </circle>
        );
      })}
    </>
  );
}

function IvlDevice({ animate }: { animate: boolean }) {
  return (
    <g>
      <line x1={20} y1={CY} x2={CX - 14} y2={CY} stroke={DEVICE_SHAFT} strokeWidth={5} strokeLinecap="round" />
      <rect x={CX - 14} y={CY - 7} width={28} height={14} rx={5} fill={DEVICE_ACCENT} />
      {[0, 1, 2].map((i) =>
        animate ? (
          <circle key={i} cx={CX} cy={CY} r={6} fill="none" stroke={DEVICE_ACCENT} strokeWidth={2}>
            <animate attributeName="r" values="6;95" dur="2.4s" begin={`${i * 0.8}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.9;0" dur="2.4s" begin={`${i * 0.8}s`} repeatCount="indefinite" />
          </circle>
        ) : (
          <circle key={i} cx={CX} cy={CY} r={24 + i * 26} fill="none" stroke={DEVICE_ACCENT} strokeWidth={1.5} opacity={0.6 - i * 0.18} />
        )
      )}
      <g stroke={CRACK_COLOR} strokeWidth={2} strokeLinecap="round">
        {CRACKS.map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}>
            {animate && (
              <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.25;0.45;0.9;1" dur="4.8s" begin={`${i * 0.12}s`} repeatCount="indefinite" />
            )}
          </line>
        ))}
      </g>
    </g>
  );
}

function BalloonDevice({ animate }: { animate: boolean }) {
  return (
    <g>
      <line x1={20} y1={CY} x2={CX + 100} y2={CY} stroke={DEVICE_SHAFT} strokeWidth={3} strokeLinecap="round" />
      <g transform={`translate(${CX} ${CY})`}>
        <g>
          {animate && (
            <animateTransform attributeName="transform" type="scale" values="0.12 0.2;1 1;1 1;0.12 0.2" keyTimes="0;0.4;0.75;1" dur="3.6s" repeatCount="indefinite" />
          )}
          <ellipse rx={96} ry={26} fill={DEVICE_ACCENT} opacity={0.88} />
          {[-14, 0, 14].map((y) => (
            <line key={y} x1={-84} y1={y} x2={84} y2={y} stroke={CALCIUM_COLOR} strokeWidth={2} opacity={0.8} />
          ))}
        </g>
      </g>
      <g stroke={CRACK_COLOR} strokeWidth={2.5} strokeLinecap="round">
        {SCORES.map(([x1, y1, x2, y2], i) => (
          <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}>
            {animate && <animate attributeName="opacity" values="0;0;1;1;0" keyTimes="0;0.35;0.45;0.8;1" dur="3.6s" repeatCount="indefinite" />}
          </line>
        ))}
      </g>
    </g>
  );
}

function BurrDevice({ animate }: { animate: boolean }) {
  return (
    <g>
      <line x1={20} y1={CY} x2={animate ? 330 : CX} y2={CY} stroke={DEVICE_SHAFT} strokeWidth={4} strokeLinecap="round">
        {animate && <animate attributeName="x2" values="330;570;570;330" keyTimes="0;0.6;0.88;1" dur="5s" repeatCount="indefinite" />}
      </line>
      <g>
        {animate && <animateMotion dur="5s" repeatCount="indefinite" path={`M330,${CY} L570,${CY}`} keyPoints="0;1;1;0" keyTimes="0;0.6;0.88;1" calcMode="linear" />}
        <g transform={animate ? undefined : `translate(${CX} ${CY})`}>
          {animate && <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="0.7s" repeatCount="indefinite" />}
          <circle r={13} fill={DEVICE_ACCENT} />
          {Array.from({ length: 8 }).map((_, i) => (
            <rect key={i} x={-2} y={-20} width={4} height={9} rx={1} fill={DEVICE_ACCENT} transform={`rotate(${i * 45})`} />
          ))}
        </g>
      </g>
    </g>
  );
}

export default function TreatmentExplorer() {
  const { t } = useLanguage();
  const ui = t.UI.treatmentExplorer;
  const reducedMotion = usePrefersReducedMotion();
  const [activeKey, setActiveKey] = useState(t.TREATMENTS[0].key);
  const [replay, setReplay] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);
  const [inView, setInView] = useState(false);
  const pausedRef = useRef(false);
  const barRef = useRef<HTMLSpanElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const animate = !reducedMotion;

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.35 });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Idle showcase: cycle through the three treatments while the section is on
  // screen and untouched, with a thin progress bar on the active tab. Any tap
  // hands control to the visitor for good.
  useEffect(() => {
    if (!autoPlay || !animate || !inView) return;
    let raf = 0;
    let last = performance.now();
    let elapsed = 0;
    const tick = (now: number) => {
      if (!pausedRef.current) elapsed += now - last;
      last = now;
      const p = Math.min(1, elapsed / AUTO_ADVANCE_MS);
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      if (p >= 1) {
        const idx = t.TREATMENTS.findIndex((tr) => tr.key === activeKey);
        setActiveKey(t.TREATMENTS[(idx + 1) % t.TREATMENTS.length].key);
        setReplay((r) => r + 1);
        return;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [autoPlay, animate, inView, activeKey, replay, t]);

  const select = (key: string) => {
    setActiveKey(key);
    setReplay((r) => r + 1);
    setAutoPlay(false);
  };

  const onTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    const n = t.TREATMENTS.length;
    let next = i;
    if (e.key === "ArrowDown" || e.key === "ArrowRight") next = (i + 1) % n;
    else if (e.key === "ArrowUp" || e.key === "ArrowLeft") next = (i - 1 + n) % n;
    else return;
    e.preventDefault();
    select(t.TREATMENTS[next].key);
    tabRefs.current[next]?.focus();
  };

  const active = t.TREATMENTS.find((tr) => tr.key === activeKey) ?? t.TREATMENTS[0];
  const shaving = activeKey === "atherectomy";

  return (
    <section ref={sectionRef} style={{ background: "var(--color-bg-0)", padding: "var(--section-py) 0" }}>
      <div className="max-w-6xl mx-auto px-6 md:px-12">
        <SectionReveal>
          <h2 className="text-3xl sm:text-4xl md:text-[2.4rem] font-medium mb-4 text-center max-w-2xl mx-auto" style={{ color: "var(--color-heading)" }}>
            {t.TREATMENT_SECTION_TITLE}
          </h2>
          <p className="text-sm sm:text-base text-center mb-12" style={{ color: "var(--color-text-muted)", opacity: 0.8 }}>
            {ui.hint}
          </p>
        </SectionReveal>

        <div
          className="grid md:grid-cols-[0.85fr_1.35fr] gap-6 items-stretch"
          onMouseEnter={() => {
            pausedRef.current = true;
          }}
          onMouseLeave={() => {
            pausedRef.current = false;
          }}
        >
          <SectionReveal className="order-2 md:order-1">
            <div className="flex flex-col gap-3 h-full" role="tablist" aria-orientation="vertical" aria-label={t.TREATMENT_SECTION_TITLE}>
              {t.TREATMENTS.map((treatment, i) => {
                const Icon = ICONS[treatment.key];
                const isActive = treatment.key === activeKey;
                return (
                  <button
                    key={treatment.key}
                    ref={(el) => {
                      tabRefs.current[i] = el;
                    }}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    tabIndex={isActive ? 0 : -1}
                    onClick={() => select(treatment.key)}
                    onKeyDown={(e) => onTabKeyDown(e, i)}
                    className="group relative flex-1 text-left flex items-start gap-4 p-5 pb-6 rounded-2xl overflow-hidden transition-all duration-400"
                    style={{
                      background: isActive ? "var(--color-coral-tint)" : "var(--color-card)",
                      border: `1px solid ${isActive ? "var(--color-coral)" : "var(--color-line)"}`,
                      transform: isActive ? "translateX(6px)" : "translateX(0)",
                    }}
                  >
                    <span
                      className="shrink-0 flex items-center justify-center rounded-full transition-colors duration-300"
                      style={{ width: 44, height: 44, background: isActive ? "var(--color-coral)" : "var(--color-coral-tint)" }}
                    >
                      {Icon && <Icon size={20} color={isActive ? "var(--color-on-accent)" : "var(--color-coral)"} strokeWidth={1.75} />}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-base font-medium leading-snug" style={{ color: "var(--color-text)" }}>
                        {treatment.title}
                      </span>
                      <span className="block mt-1 text-sm leading-relaxed" style={{ color: "var(--color-text-muted)" }}>
                        {treatment.body}
                      </span>
                    </span>
                    {isActive && autoPlay && animate && (
                      <span
                        ref={barRef}
                        className="absolute left-0 right-0 bottom-0 h-[3px] origin-left"
                        style={{ background: "var(--color-coral)", transform: "scaleX(0)", opacity: 0.8 }}
                        aria-hidden="true"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </SectionReveal>

          <SectionReveal delay={120} className="order-1 md:order-2">
            <div className="h-full rounded-2xl p-5 sm:p-7 flex flex-col" style={{ background: "var(--color-card)", border: "1px solid var(--color-line)" }}>
              <div className="flex items-center justify-between gap-4 mb-4">
                <span className="text-[10px] font-semibold uppercase tracking-[0.2em]" style={{ color: "var(--color-coral)" }}>
                  {ui.howItWorks}
                </span>
                {animate && (
                  <button
                    type="button"
                    onClick={() => setReplay((r) => r + 1)}
                    className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-full text-[11px] uppercase tracking-[0.12em] transition-all hover:-translate-y-0.5"
                    style={{ border: "1px solid var(--color-line)", color: "var(--color-text-muted)" }}
                  >
                    <RotateCcw size={12} />
                    {ui.replay}
                  </button>
                )}
              </div>

              <svg
                key={`${activeKey}-${replay}`}
                viewBox="0 0 900 300"
                className="w-full h-auto rounded-xl"
                style={{ background: "var(--color-bg-1)" }}
                role="img"
                aria-label={`${active.title}: ${active.body}`}
              >
                <defs>
                  <clipPath id="explorer-vessel-clip">
                    <rect x={20} y={40} width={860} height={220} rx={40} />
                  </clipPath>
                  <clipPath id="explorer-calcium-clip">
                    <rect x={335} y={100} width={250} height={100}>
                      {shaving && animate && (
                        <>
                          <animate attributeName="x" values="335;580;580;335" keyTimes="0;0.6;0.88;1" dur="5s" repeatCount="indefinite" />
                          <animate attributeName="width" values="250;0;0;250" keyTimes="0;0.6;0.88;1" dur="5s" repeatCount="indefinite" />
                        </>
                      )}
                    </rect>
                  </clipPath>
                </defs>

                <rect x={20} y={40} width={860} height={220} rx={40} fill={VESSEL_FILL} stroke={VESSEL_STROKE} strokeWidth={1.5} />
                <path d={LUMEN_PATH} fill={LUMEN_FILL} />
                <path d={PLAQUE_TOP} fill={PLAQUE_FILL} />
                <path d={PLAQUE_BOTTOM} fill={PLAQUE_FILL} />

                <g clipPath={shaving ? "url(#explorer-calcium-clip)" : undefined} stroke={CALCIUM_COLOR} strokeWidth={5} strokeLinecap="round" strokeLinejoin="round" fill="none">
                  <path d={CALCIUM_TOP} />
                  <path d={CALCIUM_BOTTOM} />
                </g>

                <g clipPath="url(#explorer-vessel-clip)">
                  <BloodCells animate={animate} />
                  {activeKey === "ivl" && <IvlDevice animate={animate} />}
                  {activeKey === "balloons" && <BalloonDevice animate={animate} />}
                  {activeKey === "atherectomy" && <BurrDevice animate={animate} />}
                </g>
              </svg>

              <p key={activeKey} className="celebrate-pop mt-6 text-lg sm:text-xl font-medium leading-snug" style={{ color: "var(--color-text)" }}>
                {active.title}
                <span className="block mt-1 text-sm sm:text-base font-normal" style={{ color: "var(--color-text-muted)" }}>
                  {active.body}
                </span>
              </p>

              <div className="mt-auto pt-6 flex flex-wrap gap-x-6 gap-y-2">
                {[
                  { color: CALCIUM_COLOR, label: ui.legendCalcium, ring: true },
                  { color: DEVICE_ACCENT, label: ui.legendDevice, ring: false },
                  { color: CELL_COLOR, label: ui.legendFlow, ring: false },
                ].map((item) => (
                  <span key={item.label} className="inline-flex items-center gap-2 text-xs" style={{ color: "var(--color-text-muted)" }}>
                    <span
                      className="inline-block rounded-full shrink-0"
                      style={{ width: 9, height: 9, background: item.color, border: item.ring ? "1px solid var(--color-line)" : "none" }}
                    />
                    {item.label}
                  </span>
                ))}
              </div>
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
