"use client";

import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "@/lib/hooks";

export type HeroVariant = "ecg" | "network";

export function AuroraBlobs({ intensity = 0.16 }: { intensity?: number }) {
  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <span className="aurora-blob aurora-a" style={{ width: "60vw", height: "60vw", left: "-16%", top: "-30%", opacity: intensity * 1.4 }} />
      <span className="aurora-blob aurora-b" style={{ width: "50vw", height: "50vw", right: "-14%", bottom: "-32%", opacity: intensity * 1.1 }} />
    </div>
  );
}

// `scale` shrinks every excursion from the baseline proportionally, so the
// same waveform silhouette can be pre-flattened for a short, wide viewBox
// instead of relying on the browser to squash a tall one — non-uniform CSS
// scaling (which is what preserveAspectRatio="none" does when the target
// box is far wider/shorter than the viewBox) turns round stroke joins into
// flattened blobs, chopping the sharp peaks off. Baking the correct aspect
// ratio into the path itself avoids that distortion entirely.
function ecgPath(baseline: number, scale: number) {
  const p = (delta: number) => baseline + delta * scale;
  let d = `M0,${baseline}`;
  [120, 520, 920].forEach((x) => {
    d += ` L${x},${baseline} C${x + 10},${baseline} ${x + 14},${p(-12)} ${x + 24},${p(-12)} C${x + 34},${p(-12)} ${x + 38},${baseline} ${x + 48},${baseline}`;
    d += ` L${x + 72},${baseline} L${x + 82},${p(10)} L${x + 96},${p(-98)} L${x + 112},${p(96)} L${x + 124},${baseline}`;
    d += ` L${x + 160},${baseline} C${x + 176},${baseline} ${x + 184},${p(-32)} ${x + 204},${p(-32)} C${x + 224},${p(-32)} ${x + 232},${baseline} ${x + 248},${baseline}`;
  });
  return d + ` L1200,${baseline}`;
}

export const ECG_D = ecgPath(150, 1);
// A version natively proportioned for a short, wide strip (e.g. a footer
// band) rather than the hero's tall backdrop — see the comment above.
export const ECG_D_THIN = ecgPath(30, 0.2);

function EcgBackdrop({ still, mask }: { still: boolean; mask?: string }) {
  return (
    <svg
      viewBox="0 0 1200 300"
      preserveAspectRatio="none"
      className="absolute inset-x-0 w-full"
      style={{
        top: "50%",
        height: "42%",
        transform: "translateY(-40%)",
        ...(mask ? { maskImage: mask, WebkitMaskImage: mask } : undefined),
      }}
      aria-hidden="true"
    >
      <path d={ECG_D} fill="none" stroke="var(--color-coral)" strokeWidth={1.5} opacity={0.12} />
      {!still && (
        <>
          <path d={ECG_D} pathLength={1300} className="ecg-trace" fill="none" stroke="var(--color-coral)" strokeWidth={10} opacity={0.12} strokeLinecap="round" />
          <path d={ECG_D} pathLength={1300} className="ecg-trace" fill="none" stroke="var(--color-coral)" strokeWidth={2.5} opacity={0.7} strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
    </svg>
  );
}

const NODES: Array<[number, number, number]> = [
  [8, 22, 8], [22, 66, 6], [38, 32, 10], [55, 72, 7], [70, 24, 9],
  [86, 60, 6], [94, 18, 8], [48, 48, 12], [30, 88, 5], [78, 86, 7],
];
const LINKS: Array<[number, number]> = [
  [0, 2], [1, 2], [2, 7], [3, 7], [4, 7], [4, 5], [5, 6], [3, 5], [1, 7], [2, 4], [1, 8], [3, 8], [3, 9], [5, 9],
];
const DRIFT = ["drift-a", "drift-b", "drift-c"];

function NetworkBackdrop({ still }: { still: boolean }) {
  return (
    <div className="absolute inset-0" aria-hidden="true" style={{ opacity: 0.9 }}>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
        {LINKS.map(([a, b]) => (
          <line
            key={`${a}-${b}`}
            x1={NODES[a][0]} y1={NODES[a][1]} x2={NODES[b][0]} y2={NODES[b][1]}
            stroke="var(--color-coral)" strokeWidth={1} vectorEffect="non-scaling-stroke" opacity={0.22}
          />
        ))}
      </svg>
      {NODES.map(([x, y, size], i) => (
        <span
          key={i}
          className={`absolute ${still ? "" : DRIFT[i % 3]}`}
          style={{ left: `${x}%`, top: `${y}%`, width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2 }}
        >
          <span className="absolute inset-0 rounded-full" style={{ background: "var(--color-coral)", opacity: 0.55 }} />
          {!still && i % 3 === 0 && (
            <span className="node-pulse absolute inset-0 rounded-full" style={{ border: "1px solid var(--color-coral)" }} />
          )}
        </span>
      ))}
    </div>
  );
}

export default function HeroBackdrop({ variant, mask }: { variant: HeroVariant; mask?: string }) {
  const reducedMotion = usePrefersReducedMotion();
  const backRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);

  // Gentle two-layer parallax that follows the pointer (desktop only).
  useEffect(() => {
    if (reducedMotion || !window.matchMedia("(hover: hover)").matches) return;
    let raf = 0;
    const onMove = (e: MouseEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const x = e.clientX / window.innerWidth - 0.5;
        const y = e.clientY / window.innerHeight - 0.5;
        if (backRef.current) backRef.current.style.transform = `translate3d(${x * -26}px, ${y * -18}px, 0)`;
        if (frontRef.current) frontRef.current.style.transform = `translate3d(${x * 16}px, ${y * 12}px, 0)`;
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reducedMotion]);

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <div ref={backRef} className="parallax-layer absolute inset-0">
        <AuroraBlobs intensity={0.14} />
      </div>
      <div ref={frontRef} className="parallax-layer absolute inset-0">
        {variant === "ecg" ? <EcgBackdrop still={reducedMotion} mask={mask} /> : <NetworkBackdrop still={reducedMotion} />}
      </div>
      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, transparent 0%, transparent 55%, var(--color-bg-0) 100%)" }}
      />
    </div>
  );
}
