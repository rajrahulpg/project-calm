// Server-only: uses the filesystem. Import from route handlers / server
// components only — client components get the data as props.
import { promises as fs } from "fs";
import path from "path";

// The doctor-video list behind the Resources page. It lives in a JSON file
// (not content.ts) so the /admin panel can add and remove videos at runtime
// without a rebuild. Hindi names exist only for the original five — videos
// added from the admin panel show their English name in both languages.
export type DoctorVideo = {
  id: string;
  doctor: string;
  doctorHi?: string;
  title: string;
  thumbnail: string;
  views: number;
  likes: number;
  uploaded: string; // YYYY-MM-DD
  duration: string; // m:ss
};

const FILE = path.join(process.cwd(), "data", "doctor-videos.json");

export async function readVideos(): Promise<DoctorVideo[]> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8")) as DoctorVideo[];
  } catch {
    return [];
  }
}

export async function writeVideos(videos: DoctorVideo[]) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(videos, null, 2) + "\n", "utf8");
}

export function checkPin(pin: string | null) {
  return pin !== null && pin === (process.env.ADMIN_PIN ?? "1234");
}

// Accepts youtu.be/ID, youtube.com/watch?v=ID, /shorts/ID, /embed/ID, /live/ID
// (with or without https://).
export function parseYouTubeId(input: string): string | null {
  let url: URL;
  const raw = input.trim();
  try {
    url = new URL(/^https?:\/\//i.test(raw) ? raw : `https://${raw}`);
  } catch {
    return null;
  }
  const host = url.hostname.replace(/^(www\.|m\.)/, "");
  let id: string | null = null;
  if (host === "youtu.be") id = url.pathname.slice(1).split("/")[0];
  else if (host === "youtube.com" || host === "youtube-nocookie.com") {
    id = url.searchParams.get("v") ?? url.pathname.match(/^\/(?:shorts|embed|live)\/([^/]+)/)?.[1] ?? null;
  }
  return id && /^[\w-]{11}$/.test(id) ? id : null;
}

const formatDuration = (s: number) => {
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = String(s % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${sec}` : `${m}:${sec}`;
};

// Title comes from YouTube's public oEmbed endpoint (fails for private or
// deleted videos, which is the check we want). Views, likes, upload date and
// length are read from the public watch page, since there is no API key —
// if YouTube changes that page, those fall back to 0 / today / blank rather
// than blocking the upload.
export async function fetchYouTubeVideo(id: string): Promise<DoctorVideo> {
  const watchUrl = `https://www.youtube.com/watch?v=${id}`;
  const oembed = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(watchUrl)}&format=json`, { cache: "no-store" });
  if (!oembed.ok) throw new Error("Couldn't find that video on YouTube. Check the link and that the video is public.");
  const { title } = (await oembed.json()) as { title: string };
  const cleanTitle = title.replace(/\s+/g, " ").trim();

  let views = 0, likes = 0, duration = "", uploaded = new Date().toISOString().slice(0, 10);
  try {
    const html = await (await fetch(watchUrl, { cache: "no-store", headers: { "User-Agent": "Mozilla/5.0", "Accept-Language": "en-US" } })).text();
    views = Number(html.match(/"viewCount":"(\d+)"/)?.[1] ?? 0);
    likes = Number(html.match(/"likeCount":"?(\d+)/)?.[1] ?? 0);
    const secs = Number(html.match(/"lengthSeconds":"(\d+)"/)?.[1] ?? 0);
    if (secs) duration = formatDuration(secs);
    uploaded = html.match(/"publishDate":"(\d{4}-\d{2}-\d{2})/)?.[1] ?? uploaded;
  } catch {
    // keep fallbacks
  }

  const maxres = `https://i.ytimg.com/vi/${id}/maxresdefault.jpg`;
  const hasMaxres = await fetch(maxres, { method: "HEAD", cache: "no-store" }).then((r) => r.ok).catch(() => false);

  // "…Featuring Dr Sarita Rao" → "Dr Sarita Rao"; otherwise use the full title.
  const doctor = cleanTitle.match(/featuring\s+(.+)$/i)?.[1].trim() ?? cleanTitle;

  return {
    id,
    doctor,
    title: cleanTitle,
    thumbnail: hasMaxres ? maxres : `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    views,
    likes,
    uploaded,
    duration,
  };
}
