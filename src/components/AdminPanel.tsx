"use client";

import { useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { CheckCircle2, ChevronDown, ChevronUp, ExternalLink, Eye, GripVertical, Loader2, Lock, LogOut, Plus, Trash2, Upload, X, XCircle } from "lucide-react";
import SiteLogo, { SiteHashtag } from "./SiteLogo";
import type { DoctorVideo } from "@/lib/videos";

// The PIN is only held in React state — never stored — so a page refresh
// always asks for it again. The API re-checks it on every request.
async function api(pin: string, init?: RequestInit & { query?: string }) {
  const res = await fetch(`/api/admin/videos${init?.query ?? ""}`, {
    ...init,
    headers: { "Content-Type": "application/json", "x-admin-pin": pin, ...init?.headers },
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw Object.assign(new Error(data.error ?? "Something went wrong."), { status: res.status });
  return data as { videos: DoctorVideo[]; results?: AddResult[] };
}

type AddResult = { input: string; ok: boolean; title?: string; error?: string };

// Links can be pasted one per line, or separated by spaces/commas.
const splitLinks = (text: string) => text.split(/[\s,]+/).map((s) => s.trim()).filter(Boolean);

const dateFmt = new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" });

function PinScreen({ onUnlock }: { onUnlock: (pin: string, videos: DoctorVideo[]) => void }) {
  const [pin, setPin] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!pin) return;
    setBusy(true);
    setError("");
    try {
      const { videos } = await api(pin);
      onUnlock(pin, videos);
    } catch (err) {
      setError((err as Error).message);
      setPin("");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-dvh flex items-center justify-center px-6" style={{ background: "var(--color-bg-0)" }}>
      <form
        onSubmit={submit}
        className="w-full max-w-sm rounded-2xl p-8 flex flex-col items-center text-center"
        style={{ background: "var(--color-bg-1)", border: "1px solid var(--color-line)" }}
      >
        <div className="flex flex-col items-center mb-8">
          <SiteLogo className="h-9 w-auto" />
          <SiteHashtag />
        </div>
        <span className="flex items-center justify-center rounded-full mb-4" style={{ width: 48, height: 48, background: "var(--color-coral-tint)" }}>
          <Lock size={20} color="var(--color-coral)" />
        </span>
        <h1 className="text-xl font-medium mb-1" style={{ color: "var(--color-heading)" }}>Admin Panel</h1>
        <p className="text-sm mb-6" style={{ color: "var(--color-text-muted)" }}>Enter your PIN to continue.</p>
        <input
          type="password"
          inputMode="numeric"
          autoComplete="off"
          autoFocus
          maxLength={8}
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          aria-label="PIN"
          placeholder="••••"
          className="w-full text-center text-2xl tracking-[0.6em] rounded-xl py-3 mb-3 border border-[var(--color-line)] focus:border-[var(--color-coral)]"
          style={{ background: "var(--color-bg-0)", color: "var(--color-text)", outline: "none" }}
        />
        {error && <p className="text-sm mb-3" style={{ color: "var(--color-coral)" }}>{error}</p>}
        <button
          type="submit"
          disabled={busy || !pin}
          className="btn-accent w-full inline-flex items-center justify-center gap-2 py-3 rounded-full text-xs font-semibold uppercase tracking-[0.14em] disabled:opacity-50"
        >
          {busy ? <Loader2 size={15} className="animate-spin" /> : null}
          Unlock
        </button>
      </form>
    </div>
  );
}

function NewResourceForm({ pin, onAdded, onCancel }: { pin: string; onAdded: (videos: DoctorVideo[], addedCount: number) => void; onCancel: () => void }) {
  const [text, setText] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [results, setResults] = useState<AddResult[]>([]);
  const links = splitLinks(text);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!links.length) return;
    setBusy(true);
    setError("");
    setResults([]);
    try {
      const { videos, results = [] } = await api(pin, { method: "POST", body: JSON.stringify({ urls: links }) });
      const okCount = results.filter((r) => r.ok).length;
      const failed = results.filter((r) => !r.ok);
      if (okCount) onAdded(videos, okCount);
      if (failed.length) {
        // Keep the form open with just the links that didn't go in, so they
        // can be fixed and retried; the result list shows why each failed.
        setResults(results);
        setText(failed.map((r) => r.input).join("\n"));
      } else {
        onCancel();
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="rounded-2xl p-5 sm:p-6 mb-8" style={{ background: "var(--color-bg-1)", border: "1px solid var(--color-coral-soft)" }}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-medium" style={{ color: "var(--color-text)" }}>New Resource</h2>
        <button type="button" onClick={onCancel} aria-label="Cancel">
          <X size={18} color="var(--color-text-muted)" />
        </button>
      </div>
      <label className="block text-xs font-semibold uppercase tracking-[0.12em] mb-2" style={{ color: "var(--color-text-muted)" }} htmlFor="yt-url">
        YouTube links <span className="normal-case tracking-normal font-normal">— one per line</span>
      </label>
      <textarea
        id="yt-url"
        autoFocus
        rows={5}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={"https://youtu.be/…\nhttps://youtu.be/…\nhttps://youtu.be/…"}
        spellCheck={false}
        className="w-full rounded-xl px-4 py-3 text-sm leading-relaxed font-mono resize-y border border-[var(--color-line)] focus:border-[var(--color-coral)]"
        style={{ background: "var(--color-bg-0)", color: "var(--color-text)", outline: "none" }}
      />
      <div className="mt-3 flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
        <span className="text-xs tabular-nums" style={{ color: "var(--color-text-muted)" }}>
          {links.length === 0 ? "Paste one or more links" : `${links.length} ${links.length === 1 ? "link" : "links"} ready`}
        </span>
        <button
          type="submit"
          disabled={busy || links.length === 0}
          className="btn-accent inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-xs font-semibold uppercase tracking-[0.14em] disabled:opacity-50"
        >
          {busy ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
          {busy ? `Fetching ${links.length}…` : links.length > 1 ? `Upload ${links.length}` : "Upload"}
        </button>
      </div>
      {error && <p className="mt-3 text-sm" style={{ color: "var(--color-coral)" }}>{error}</p>}
      {results.length > 0 && (
        <ul className="mt-4 flex flex-col gap-1.5 text-xs">
          {results.map((r, i) => (
            <li key={i} className="flex items-start gap-2">
              {r.ok ? <CheckCircle2 size={14} className="shrink-0 mt-px" color="#1F9D55" /> : <XCircle size={14} className="shrink-0 mt-px" color="var(--color-coral)" />}
              <span className="min-w-0" style={{ color: "var(--color-text)" }}>
                <span className="break-all">{r.ok ? r.title : r.input}</span>
                {!r.ok && <span style={{ color: "var(--color-coral)" }}> — {r.error}</span>}
              </span>
            </li>
          ))}
        </ul>
      )}
      <p className="mt-3 text-xs" style={{ color: "var(--color-text-muted)" }}>
        The title, thumbnail, views and upload date are fetched from YouTube automatically.
      </p>
    </form>
  );
}

export default function AdminPanel() {
  const [pin, setPin] = useState<string | null>(null);
  const [videos, setVideos] = useState<DoctorVideo[]>([]);
  const [adding, setAdding] = useState(false);
  const [notice, setNotice] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);
  const [dragId, setDragId] = useState<string | null>(null);
  const [savingOrder, setSavingOrder] = useState(false);
  const orderBeforeDrag = useRef<DoctorVideo[]>([]);
  const noticeTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  const flash = (msg: string) => {
    setNotice(msg);
    clearTimeout(noticeTimer.current);
    noticeTimer.current = setTimeout(() => setNotice(""), 4000);
  };

  if (!pin) {
    return <PinScreen onUnlock={(p, v) => { setPin(p); setVideos(v); }} />;
  }

  // Order changes apply on screen immediately, then save; if the save fails
  // the list snaps back to `previous`.
  const saveOrder = async (next: DoctorVideo[], previous: DoctorVideo[]) => {
    if (next.every((v, i) => v.id === previous[i]?.id)) return;
    setVideos(next);
    setSavingOrder(true);
    try {
      await api(pin, { method: "PUT", body: JSON.stringify({ order: next.map((v) => v.id) }) });
      flash("Order saved. The Resources page now shows videos in this order.");
    } catch (err) {
      setVideos(previous);
      flash((err as Error).message);
    } finally {
      setSavingOrder(false);
    }
  };

  const move = (from: number, to: number) => {
    if (to < 0 || to >= videos.length) return;
    const next = [...videos];
    next.splice(to, 0, next.splice(from, 1)[0]);
    saveOrder(next, videos);
  };

  // Drag and drop (desktop): reorder live while dragging, save on drop.
  // The up/down arrows do the same job on touch screens.
  const onDragEnter = (overId: string) => {
    if (!dragId || dragId === overId) return;
    setVideos((list) => {
      const from = list.findIndex((v) => v.id === dragId);
      const to = list.findIndex((v) => v.id === overId);
      const next = [...list];
      next.splice(to, 0, next.splice(from, 1)[0]);
      return next;
    });
  };

  const remove = async (video: DoctorVideo) => {
    if (!window.confirm(`Remove "${video.doctor}" from the Resources page?`)) return;
    setDeleting(video.id);
    try {
      const { videos: next } = await api(pin, { method: "DELETE", query: `?id=${encodeURIComponent(video.id)}` });
      setVideos(next);
      flash("Video removed.");
    } catch (err) {
      flash((err as Error).message);
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="min-h-dvh" style={{ background: "var(--color-bg-0)" }}>
      {/* Three columns (1fr / auto / 1fr) so the title stays truly centered
          regardless of how wide the logo and buttons are. */}
      <header className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-4 px-4 sm:px-6 md:px-12 py-5" style={{ borderBottom: "1px solid var(--color-line)" }}>
        <div className="flex flex-col items-start min-w-0">
          <SiteLogo className="h-6 sm:h-8 w-auto" />
          <SiteHashtag className="hidden sm:block" />
        </div>
        <span className="text-[11px] sm:text-sm font-semibold uppercase tracking-[0.16em] sm:tracking-[0.2em] whitespace-nowrap" style={{ color: "var(--color-text-muted)" }}>
          Admin Panel
        </span>
        <div className="flex items-center justify-end gap-2">
          <Link
            href="/resources"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.12em]"
            style={{ color: "var(--color-text-muted)", border: "1px solid var(--color-line)" }}
          >
            <ExternalLink size={13} />
            <span className="hidden sm:inline">View site</span>
          </Link>
          <button
            type="button"
            onClick={() => { setPin(null); setVideos([]); setAdding(false); }}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-full text-[11px] font-semibold uppercase tracking-[0.12em]"
            style={{ color: "var(--color-text-muted)", border: "1px solid var(--color-line)" }}
          >
            <LogOut size={13} />
            <span className="hidden sm:inline">Lock</span>
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 md:px-12 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-medium" style={{ color: "var(--color-heading)" }}>Resources</h1>
            <p className="text-sm mt-1" style={{ color: "var(--color-text-muted)" }}>
              {videos.length} {videos.length === 1 ? "video" : "videos"} in “Hear It From Your Doctors”
            </p>
            {videos.length > 1 && (
              <p className="text-xs mt-1 inline-flex items-center gap-1.5" style={{ color: "var(--color-text-muted)", opacity: 0.8 }}>
                {savingOrder && <Loader2 size={11} className="animate-spin" />}
                Drag or use the arrows to set the order shown on the site.
              </p>
            )}
          </div>
          {!adding && (
            <button
              type="button"
              onClick={() => setAdding(true)}
              className="btn-accent inline-flex items-center gap-2 px-5 py-3 rounded-full text-xs font-semibold uppercase tracking-[0.14em]"
            >
              <Plus size={15} />
              New Resource
            </button>
          )}
        </div>

        {notice && (
          <p className="modal-fade mb-6 rounded-xl px-4 py-3 text-sm" style={{ background: "var(--color-coral-tint)", color: "var(--color-text)" }}>
            {notice}
          </p>
        )}

        {adding && (
          <NewResourceForm
            pin={pin}
            onCancel={() => setAdding(false)}
            onAdded={(next, count) => {
              setVideos(next);
              flash(`Added ${count} ${count === 1 ? "video" : "videos"}. ${count === 1 ? "It's" : "They're"} now live on the Resources page.`);
            }}
          />
        )}

        <ul className="flex flex-col gap-3">
          {videos.map((v, i) => (
            <li
              key={v.id}
              draggable={!savingOrder}
              onDragStart={(e) => {
                e.dataTransfer.effectAllowed = "move";
                orderBeforeDrag.current = videos;
                setDragId(v.id);
              }}
              onDragEnter={() => onDragEnter(v.id)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => e.preventDefault()}
              onDragEnd={() => {
                setDragId(null);
                saveOrder(videos, orderBeforeDrag.current);
              }}
              className="flex items-center gap-2 sm:gap-3 rounded-2xl p-2 sm:p-3 sm:pr-4 transition-[opacity,box-shadow]"
              style={{
                background: "var(--color-card)",
                border: `1px solid ${dragId === v.id ? "var(--color-coral)" : "var(--color-line)"}`,
                opacity: dragId === v.id ? 0.55 : 1,
              }}
            >
              <div className="shrink-0 flex flex-col items-center gap-0.5">
                <button
                  type="button"
                  onClick={() => move(i, i - 1)}
                  disabled={i === 0 || savingOrder}
                  aria-label={`Move ${v.doctor} up`}
                  className="flex items-center justify-center rounded-md disabled:opacity-25 hover:bg-[var(--color-coral-tint)]"
                  style={{ width: 26, height: 22 }}
                >
                  <ChevronUp size={15} color="var(--color-text-muted)" />
                </button>
                <span className="flex items-center gap-0.5 text-[11px] font-semibold tabular-nums cursor-grab active:cursor-grabbing" style={{ color: "var(--color-text-muted)" }} title="Drag to reorder">
                  <GripVertical size={12} className="hidden sm:block" />
                  {i + 1}
                </span>
                <button
                  type="button"
                  onClick={() => move(i, i + 1)}
                  disabled={i === videos.length - 1 || savingOrder}
                  aria-label={`Move ${v.doctor} down`}
                  className="flex items-center justify-center rounded-md disabled:opacity-25 hover:bg-[var(--color-coral-tint)]"
                  style={{ width: 26, height: 22 }}
                >
                  <ChevronDown size={15} color="var(--color-text-muted)" />
                </button>
              </div>
              <a
                href={`https://www.youtube.com/watch?v=${v.id}`}
                target="_blank"
                rel="noreferrer"
                draggable={false}
                className="relative shrink-0 rounded-xl overflow-hidden w-20 sm:w-32"
                style={{ aspectRatio: "16 / 9", background: "var(--color-bg-2)" }}
              >
                <Image src={v.thumbnail} alt="" fill draggable={false} className="object-cover" sizes="128px" />
              </a>
              <div className="flex-1 min-w-0">
                <p className="text-sm sm:text-base font-medium truncate" style={{ color: "var(--color-text)" }}>{v.doctor}</p>
                <p className="text-xs truncate" style={{ color: "var(--color-text-muted)" }}>{v.title}</p>
                <p className="mt-1 flex flex-wrap items-center gap-x-3 text-[11px] tabular-nums" style={{ color: "var(--color-text-muted)" }}>
                  <span className="inline-flex items-center gap-1"><Eye size={11} />{v.views}</span>
                  <span>{dateFmt.format(new Date(`${v.uploaded}T00:00:00`))}</span>
                  {v.duration && <span>{v.duration}</span>}
                </p>
              </div>
              <button
                type="button"
                onClick={() => remove(v)}
                disabled={deleting === v.id}
                aria-label={`Remove ${v.doctor}`}
                className="shrink-0 flex items-center justify-center rounded-full transition-colors hover:bg-[var(--color-coral-tint)] disabled:opacity-50"
                style={{ width: 38, height: 38 }}
              >
                {deleting === v.id ? <Loader2 size={16} className="animate-spin" color="var(--color-text-muted)" /> : <Trash2 size={16} color="var(--color-coral)" />}
              </button>
            </li>
          ))}
        </ul>

        {videos.length === 0 && !adding && (
          <p className="text-center text-sm py-16" style={{ color: "var(--color-text-muted)" }}>
            No videos yet. Click “New Resource” to add one.
          </p>
        )}
      </main>
    </div>
  );
}
