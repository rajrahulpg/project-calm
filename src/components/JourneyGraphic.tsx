import type { ReactNode } from "react";

// Small looping illustrations for each journey step, drawn in the brand red
// (var(--color-coral)) with a muted base. Animations live in globals.css
// (.jg-*) and are disabled under prefers-reduced-motion.
const C = "var(--color-coral)";
const M = "var(--color-line)";

function Diagnosis() {
  // ECG trace drawing itself repeatedly.
  return (
    <>
      <path d="M4 52 H26 L33 34 L43 72 L52 24 L60 52 H92" fill="none" stroke={M} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
      <path className="jg-ecg" d="M4 52 H26 L33 34 L43 72 L52 24 L60 52 H92" fill="none" stroke={C} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" pathLength={100} />
    </>
  );
}

function Angiography() {
  // Artery with a narrowing and a scanner line sweeping across it.
  return (
    <>
      <path d="M4 34 H30 Q42 34 48 42 Q54 34 66 34 H92 M4 62 H30 Q42 62 48 54 Q54 62 66 62 H92" fill="none" stroke={M} strokeWidth="3" strokeLinecap="round" />
      <path d="M30 34 Q42 34 48 42 Q54 34 66 34 M30 62 Q42 62 48 54 Q54 62 66 62" fill="none" stroke={C} strokeWidth="3" strokeLinecap="round" opacity="0.55" />
      <g className="jg-scan">
        <rect x="-2" y="20" width="4" height="56" rx="2" fill={C} opacity="0.85" />
      </g>
    </>
  );
}

function Decision() {
  // Two circles (patient + doctor) drawing together, then a tick.
  return (
    <>
      <circle className="jg-meet-l" cx="30" cy="48" r="18" fill="none" stroke={C} strokeWidth="3" />
      <circle className="jg-meet-r" cx="66" cy="48" r="18" fill="none" stroke={M} strokeWidth="3" style={{ stroke: "var(--color-text-muted)" }} />
      <path className="jg-tick" d="M38 49 L47 58 L60 40" fill="none" stroke={C} strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" pathLength={100} />
    </>
  );
}

function Procedure() {
  // Artery with a balloon inflating inside the narrowing.
  return (
    <>
      <path d="M4 30 H92 M4 66 H92" stroke={M} strokeWidth="3" strokeLinecap="round" />
      <path d="M36 30 Q48 44 60 30 M36 66 Q48 52 60 66" fill={C} opacity="0.35" stroke="none" />
      <line x1="4" y1="48" x2="48" y2="48" stroke="var(--color-text-muted)" strokeWidth="2.5" strokeLinecap="round" />
      <ellipse className="jg-balloon" cx="48" cy="48" rx="14" ry="10" fill={C} opacity="0.85" />
    </>
  );
}

function Recovery() {
  // Bars rising step by step: gradual return to strength.
  return (
    <>
      {[0, 1, 2, 3].map((i) => (
        <rect key={i} className="jg-bar" x={14 + i * 20} y={72 - (i + 1) * 14} width="12" height={(i + 1) * 14} rx="3" fill={C} style={{ animationDelay: `${i * 0.35}s` }} />
      ))}
      <line x1="6" y1="76" x2="90" y2="76" stroke={M} strokeWidth="3" strokeLinecap="round" />
    </>
  );
}

function Healthy() {
  // A beating heart with a soft pulse ring.
  return (
    <>
      <circle className="jg-ring" cx="48" cy="48" r="26" fill="none" stroke={C} strokeWidth="2" />
      <path
        className="jg-heart"
        d="M48 70 C20 50 26 28 40 28 C45 28 48 32 48 35 C48 32 51 28 56 28 C70 28 76 50 48 70 Z"
        fill={C}
      />
    </>
  );
}

const GRAPHICS: ReactNode[] = [<Diagnosis key="0" />, <Angiography key="1" />, <Decision key="2" />, <Procedure key="3" />, <Recovery key="4" />, <Healthy key="5" />];

export default function JourneyGraphic({ index }: { index: number }) {
  return (
    <svg viewBox="0 0 96 96" width="96" height="96" aria-hidden="true" className="jg shrink-0 overflow-visible">
      {GRAPHICS[index % GRAPHICS.length]}
    </svg>
  );
}
