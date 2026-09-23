"use client";

import { useEffect, useRef, useState } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { useLanguage } from "@/lib/language";

// A single stylized cross-section, healthy on the left, narrowing under a
// fat/cholesterol + calcium buildup on the right — illustrative only, not a
// medical scan. Colors are fixed (not theme-reactive) since this is anatomy
// artwork, same treatment as the hero video's overlay.
const VESSEL_FILL = "#E8C4B8";
const VESSEL_STROKE = "#C99A87";
const LUMEN_FILL = "#FBEAE3";
const PLAQUE_FILL = "#D9B36A";
const CALCIUM_COLOR = "#F4F1EC";
const CELL_COLOR = "#C8705C";

const CELL_COUNT = 6;
const CYCLE = 4; // seconds per lap

// severity: 0 = healthy (no narrowing) → 1 = severe (fully narrowed, matches
// the "anything above 70%" figure this section talks about elsewhere).
const HEALTHY_Y = 70;
const SEVERE_TOP_Y = 118;
const SEVERE_BOTTOM_Y = 190 - (SEVERE_TOP_Y - HEALTHY_Y); // 142, mirrored

function narrowY(severity: number, side: "top" | "bottom") {
  return side === "top"
    ? HEALTHY_Y + severity * (SEVERE_TOP_Y - HEALTHY_Y)
    : 190 - severity * (190 - SEVERE_BOTTOM_Y);
}

function lumenPath(severity: number) {
  const top = narrowY(severity, "top");
  const bottom = narrowY(severity, "bottom");
  return `M35,70 L380,70 C 460,70 460,70 520,${top} L860,${top} L860,${bottom} L520,${bottom} C 460,190 460,190 380,190 L35,190 Z`;
}

function plaqueTopPath(severity: number) {
  const top = narrowY(severity, "top");
  return `M380,70 L860,70 L860,${top} C 680,${top} 520,${top} 380,70 Z`;
}

function plaqueBottomPath(severity: number) {
  const bottom = narrowY(severity, "bottom");
  return `M380,190 L860,190 L860,${bottom} C 680,${bottom} 520,${bottom} 380,190 Z`;
}

function BloodCells({ animate, minRadius }: { animate: boolean; minRadius: number }) {
  const radiusValues = `6;6;${minRadius};${minRadius};6;6`;
  return (
    <>
      {Array.from({ length: CELL_COUNT }).map((_, i) => {
        const begin = -((i * CYCLE) / CELL_COUNT);
        if (!animate) {
          const t = i / CELL_COUNT;
          const cx = 20 + t * 860;
          const narrow = t > 0.42 && t < 0.68;
          return <circle key={i} cx={cx} cy={130} r={narrow ? minRadius : 6} fill={CELL_COLOR} opacity={0.9} />;
        }
        return (
          <circle key={i} r={6} fill={CELL_COLOR} opacity={0.9}>
            <animateMotion dur={`${CYCLE}s`} begin={`${begin}s`} repeatCount="indefinite" path="M20,130 L880,130" />
            <animate
              attributeName="r"
              dur={`${CYCLE}s`}
              begin={`${begin}s`}
              repeatCount="indefinite"
              keyTimes="0;0.4;0.47;0.6;0.67;1"
              values={radiusValues}
            />
            <animate
              attributeName="opacity"
              dur={`${CYCLE}s`}
              begin={`${begin}s`}
              repeatCount="indefinite"
              keyTimes="0;0.04;0.96;1"
              values="0;0.9;0.9;0"
            />
          </circle>
        );
      })}
    </>
  );
}

export default function ArteryBlockageDiagram() {
  const { t } = useLanguage();
  const reducedMotion = usePrefersReducedMotion();
  const diagram = t.CONDITION_INTRO.diagram;

  const STAGES = [
    { key: "healthy", label: diagram.stageHealthy, severity: 0 },
    { key: "buildup", label: diagram.stageBuildup, severity: 0.55 },
    { key: "severe", label: diagram.stageSevere, severity: 1 },
  ];

  const [stageIndex, setStageIndex] = useState(0);
  const [animatedSeverity, setAnimatedSeverity] = useState(STAGES[0].severity);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    if (reducedMotion) return;

    const target = STAGES[stageIndex].severity;
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    const tick = () => {
      setAnimatedSeverity((current) => {
        const next = current + (target - current) * 0.14;
        if (Math.abs(target - next) < 0.002) {
          return target;
        }
        rafRef.current = requestAnimationFrame(tick);
        return next;
      });
    };
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stageIndex, reducedMotion]);

  const severity = reducedMotion ? STAGES[stageIndex].severity : animatedSeverity;

  const calciumOpacity = Math.max(0, Math.min(1, (severity - 0.7) / 0.3));
  const minCellRadius = 6 - severity * 2.5;

  return (
    <div className="mt-12 mx-auto max-w-2xl">
      <p className="mb-4 text-xs sm:text-sm text-center" style={{ color: "var(--color-text-muted)", opacity: 0.8 }}>
        {diagram.instruction}
      </p>

      <div className="mb-6 flex items-center justify-center gap-2" role="tablist" aria-label={diagram.instruction}>
        {STAGES.map((stage, i) => {
          const active = i === stageIndex;
          return (
            <button
              key={stage.key}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setStageIndex(i)}
              className="px-3.5 py-2.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.06em] transition-colors"
              style={{
                background: active ? "var(--color-coral)" : "var(--color-card)",
                color: active ? "var(--color-on-accent)" : "var(--color-text-muted)",
                border: `1px solid ${active ? "var(--color-coral)" : "var(--color-line)"}`,
              }}
            >
              {stage.label}
            </button>
          );
        })}
      </div>

      <svg viewBox="0 0 900 260" className="w-full h-auto" role="img" aria-label={`${diagram.plaque}. ${diagram.calcium}. ${diagram.flow}.`}>
        <rect x={20} y={50} width={860} height={160} rx={30} fill={VESSEL_FILL} stroke={VESSEL_STROKE} strokeWidth={1.5} />

        <path d={lumenPath(severity)} fill={LUMEN_FILL} />

        <path d={plaqueTopPath(severity)} fill={PLAQUE_FILL} />
        <path d={plaqueBottomPath(severity)} fill={PLAQUE_FILL} />

        <g opacity={calciumOpacity}>
          <path
            d="M520,118 L560,115 L600,119 L640,115 L680,119 L720,115 L760,119 L800,115 L860,118"
            fill="none"
            stroke={CALCIUM_COLOR}
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M520,142 L560,145 L600,141 L640,145 L680,141 L720,145 L760,141 L800,145 L860,142"
            fill="none"
            stroke={CALCIUM_COLOR}
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>

        <BloodCells key={stageIndex} animate={!reducedMotion} minRadius={minCellRadius} />
      </svg>

      <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2">
        <span className="inline-flex items-center gap-2 text-xs" style={{ color: "var(--color-text-muted)" }}>
          <span className="inline-block rounded-full shrink-0" style={{ width: 9, height: 9, background: PLAQUE_FILL }} />
          {diagram.plaque}
        </span>
        <span className="inline-flex items-center gap-2 text-xs" style={{ color: "var(--color-text-muted)" }}>
          <span
            className="inline-block rounded-full shrink-0"
            style={{ width: 9, height: 9, background: CALCIUM_COLOR, border: "1px solid var(--color-line)" }}
          />
          {diagram.calcium}
        </span>
        <span className="inline-flex items-center gap-2 text-xs" style={{ color: "var(--color-text-muted)" }}>
          <span className="inline-block rounded-full shrink-0" style={{ width: 9, height: 9, background: CELL_COLOR }} />
          {diagram.flow}
        </span>
      </div>
    </div>
  );
}
