"use client";

import type { CSSProperties } from "react";
import { useCountUp, useInView } from "@/lib/hooks";

/** Parses a leading number off a stat string ("92.4%", "4 lakh+", "2 in 3")
 *  and counts it up when scrolled into view, leaving the rest static. */
export default function StatValue({
  value,
  className = "",
  style,
}: {
  value: string;
  className?: string;
  style?: CSSProperties;
}) {
  const { ref, inView } = useInView<HTMLSpanElement>(0.4);
  const match = value.match(/^(\d+(?:\.\d+)?)/);
  const numeric = match ? parseFloat(match[1]) : 0;
  const counted = useCountUp(numeric, inView && !!match);

  if (!match) {
    return (
      <span ref={ref} className={className} style={style}>
        {value}
      </span>
    );
  }

  const decimals = match[1].includes(".") ? match[1].split(".")[1].length : 0;
  const suffix = value.slice(match[1].length);

  return (
    <span ref={ref} className={className} style={style}>
      {counted.toFixed(decimals)}
      {suffix}
    </span>
  );
}
