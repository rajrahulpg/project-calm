"use client";

import { createContext, useContext, useMemo, useSyncExternalStore, type ReactNode } from "react";
import * as en from "@/data/content";
import * as hi from "@/data/content.hi";

export type Lang = "en" | "hi";

const BUNDLES = { en, hi };

// English's string/number literals get inferred narrowly (e.g. "Know Your
// Risk" instead of `string`); widen them so the Hindi bundle — same shape,
// different literal values — structurally satisfies the same type.
type Widen<T> = T extends (...args: never[]) => unknown
  ? T
  : T extends string
    ? string
    : T extends number
      ? number
      : T extends boolean
        ? boolean
        : T extends readonly (infer U)[]
          ? Widen<U>[]
          : T extends object
            ? { [K in keyof T]: Widen<T[K]> }
            : T;

export type ContentBundle = Widen<typeof en>;

const STORAGE_KEY = "calm-lang";

// A tiny module-level store (rather than useState+effect) so the language
// switch is reflected immediately in the same tab and stays hydration-safe:
// getServerSnapshot always matches the server-rendered English output, and
// React reconciles to the real stored value right after mount.
let currentLang: Lang | null = null;
const listeners = new Set<() => void>();

function readStoredLang(): Lang {
  try {
    return localStorage.getItem(STORAGE_KEY) === "hi" ? "hi" : "en";
  } catch {
    return "en";
  }
}

function subscribe(callback: () => void) {
  listeners.add(callback);
  return () => listeners.delete(callback);
}

function getSnapshot(): Lang {
  if (currentLang === null) currentLang = readStoredLang();
  return currentLang;
}

function getServerSnapshot(): Lang {
  return "en";
}

function setStoredLang(next: Lang) {
  currentLang = next;
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // ignore — the in-memory switch still works for this session
  }
  listeners.forEach((listener) => listener());
}

type LanguageContextValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: ContentBundle;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const value = useMemo(() => ({ lang, setLang: setStoredLang, t: BUNDLES[lang] }), [lang]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within a LanguageProvider");
  return ctx;
}
