"use client";

import { useEffect, useRef } from "react";
import { X, type LucideIcon } from "lucide-react";
import { usePrefersReducedMotion } from "@/lib/hooks";
import { useLanguage } from "@/lib/language";

export default function PlaceholderModal({
  title,
  note,
  icon: Icon,
  onClose,
}: {
  title: string;
  note: string;
  icon: LucideIcon;
  onClose: () => void;
}) {
  const { t } = useLanguage();
  const reducedMotion = usePrefersReducedMotion();
  const closeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    closeRef.current?.focus();
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      className="modal-fade fixed inset-0 z-50 flex items-center justify-center px-6"
      style={{ background: "rgba(5,6,8,0.72)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="placeholder-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="celebrate-pop w-full max-w-lg rounded-2xl p-6 sm:p-8"
        style={{ background: "var(--color-bg-1)", border: "1px solid var(--color-line)" }}
      >
        <div className="flex items-start justify-between gap-4 mb-6">
          <h3 id="placeholder-modal-title" className="text-lg font-medium leading-snug" style={{ color: "var(--color-text)" }}>
            {title}
          </h3>
          <button
            ref={closeRef}
            type="button"
            aria-label={t.UI.media.close}
            onClick={onClose}
            className="shrink-0 flex items-center justify-center rounded-full transition-transform hover:rotate-90"
            style={{ width: 32, height: 32, background: "var(--color-card)" }}
          >
            <X size={16} color="var(--color-text-muted)" />
          </button>
        </div>

        <div
          className="relative flex items-center justify-center rounded-xl overflow-hidden"
          style={{ aspectRatio: "16 / 9", background: "linear-gradient(140deg, var(--color-bg-2) 0%, color-mix(in srgb, var(--color-coral) 22%, var(--color-bg-2)) 100%)" }}
        >
          {!reducedMotion &&
            [0, 1].map((i) => (
              <span
                key={i}
                className="node-pulse absolute rounded-full"
                style={{ width: 64, height: 64, border: "1.5px solid var(--color-coral)", animationDelay: `${i}s` }}
                aria-hidden="true"
              />
            ))}
          <span className="relative flex items-center justify-center rounded-full" style={{ width: 64, height: 64, background: "var(--color-coral)" }}>
            <Icon size={24} color="var(--color-on-accent)" fill="var(--color-on-accent)" />
          </span>
        </div>

        <p className="mt-6 text-sm leading-relaxed text-center" style={{ color: "var(--color-text-muted)" }}>
          {note}
        </p>
      </div>
    </div>
  );
}
