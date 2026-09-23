"use client";

import { useSyncExternalStore } from "react";
import { Moon, Sun } from "lucide-react";
import { useLanguage } from "@/lib/language";

type Theme = "dark" | "light";

let currentTheme: Theme | null = null;
const listeners = new Set<() => void>();

function readStoredTheme(): Theme {
  const attr = document.documentElement.getAttribute("data-theme");
  if (attr === "light" || attr === "dark") return attr;
  try {
    return localStorage.getItem("calm-theme") === "dark" ? "dark" : "light";
  } catch {
    return "light";
  }
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot(): Theme {
  if (currentTheme === null) currentTheme = readStoredTheme();
  return currentTheme;
}

function getServerSnapshot(): Theme {
  return "light";
}

function setTheme(next: Theme) {
  currentTheme = next;
  document.documentElement.setAttribute("data-theme", next);
  try {
    localStorage.setItem("calm-theme", next);
  } catch {
    // ignore — the in-memory switch still works for this session
  }
  listeners.forEach((listener) => listener());
}

// `forceLight`: for use over the transparent, still-dark hero video (before
// the navbar has a solid background) — the icon needs to stay light-toned
// regardless of the page theme, since it isn't sitting on the page bg yet.
export default function ThemeToggle({ forceLight = false }: { forceLight?: boolean }) {
  const { t } = useLanguage();
  const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const isLight = theme === "light";

  return (
    <button
      type="button"
      onClick={() => setTheme(isLight ? "dark" : "light")}
      aria-label={isLight ? t.UI.theme.switchToDark : t.UI.theme.switchToLight}
      className="flex items-center justify-center rounded-full transition-colors"
      style={{
        width: 40,
        height: 40,
        border: forceLight ? "1px solid rgba(245,245,242,0.35)" : "1px solid var(--color-line)",
        color: forceLight ? "#F5F5F2" : "var(--color-text)",
      }}
    >
      {isLight ? <Moon size={17} /> : <Sun size={17} />}
    </button>
  );
}
