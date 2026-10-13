"use client";

import { useState } from "react";
import Image from "next/image";
import { useLanguage } from "@/lib/language";

// Campaign hashtag shown under the logo (navbar + admin panel). Same in every
// language, so it isn't in content.ts.
// `onDark` is for when it sits over the dark hero video, where the brand red
// and mid grey both sink into the red artery footage.
export function SiteHashtag({ className = "", onDark = false }: { className?: string; onDark?: boolean }) {
  const accent = onDark ? "#FF9AAB" : "var(--color-coral)";
  return (
    <span
      className={`mt-1 text-[10px] sm:text-xs font-semibold tracking-[0.02em] whitespace-nowrap transition-colors ${className}`}
      style={{ color: onDark ? "#D4D6D9" : "#898A8D", textShadow: onDark ? "0 1px 3px rgba(0,0,0,0.7)" : undefined }}
    >
      <span style={{ color: accent }}>#</span>Har <span style={{ color: accent }}>Blockage</span> Same Nahi Hota
    </span>
  );
}

// Drop a file named exactly "site-logo.png" into /public/assets to have it
// picked up here automatically — no code change needed. Until that file
// exists, this falls back to the text wordmark.
export default function SiteLogo({
  color = "var(--color-text)",
  className = "h-8 w-auto sm:h-10",
  priority = false,
}: {
  color?: string;
  className?: string;
  priority?: boolean;
}) {
  const { t } = useLanguage();
  const [logoFailed, setLogoFailed] = useState(false);

  if (logoFailed) {
    return (
      <span className="text-lg sm:text-xl font-bold tracking-[0.08em] uppercase" style={{ color }}>
        {t.SITE.name}
      </span>
    );
  }

  return (
    <Image
      src="/assets/site-logo.png"
      alt={t.SITE.name}
      width={200}
      height={44}
      className={className}
      priority={priority}
      unoptimized
      onError={() => setLogoFailed(true)}
    />
  );
}
