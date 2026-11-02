// Server-only: uses the filesystem and the database. Import from route
// handlers / server components only — client components get the data as props.
import { promises as fs } from "fs";
import path from "path";
import mysql from "mysql2/promise";
import { slugify } from "./doctor-slug";

// The doctor-video list behind the Resources page, kept out of content.ts so
// the /admin panel can add and remove videos at runtime without a rebuild.
// Hindi names exist only for the original five — videos added from the admin
// panel show their English name in both languages.
export type DoctorVideo = {
  id: string;
  doctor: string;
  doctorHi?: string;
  // Locked at upload — it's the /resources/<slug> link inside the doctor's QR.
  slug?: string;
  // Part of the doctor's QR page? Missing = yes (see hasQr).
  qr?: boolean;
  title: string;
  thumbnail: string;
  views: number;
  likes: number;
  uploaded: string; // YYYY-MM-DD
  duration: string; // m:ss
};

// Where the list is stored:
// - With DB_HOST, DB_NAME and DB_USER set (the live site — see DEPLOYMENT.md),
//   in MySQL, so videos added from /admin survive every redeploy.
// - Otherwise (local development), in data/doctor-videos.json.
// The JSON file also seeds the database the first time the site connects to
// an empty one, so a fresh deployment starts with every video in the repo.
const FILE = path.join(process.cwd(), "data", "doctor-videos.json");
const useDatabase = Boolean(process.env.DB_HOST && process.env.DB_NAME && process.env.DB_USER);

// The whole list is one JSON document in a single row: every admin action
// rewrites the full list (that's what keeps the order), so a row per video
// would only add work.
const TABLE = "site_data";
const KEY = "doctor-videos";

// One pool per server process — kept on globalThis so dev hot-reloads don't
// open a new pool on every edit.
const globalForDb = globalThis as unknown as { videoPool?: mysql.Pool; videoTableReady?: Promise<void> };

function pool() {
  globalForDb.videoPool ??= mysql.createPool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectionLimit: 5,
  });
  return globalForDb.videoPool;
}

async function readFile(): Promise<DoctorVideo[]> {
  try {
    return JSON.parse(await fs.readFile(FILE, "utf8")) as DoctorVideo[];
  } catch {
    return [];
  }
}

// Creates the table and, if it has no list yet, copies in the repo's JSON.
// Runs once per process; a failure is retried on the next request.
function tableReady() {
  globalForDb.videoTableReady ??= (async () => {
    await pool().query(
      `CREATE TABLE IF NOT EXISTS ${TABLE} (
        name VARCHAR(64) PRIMARY KEY,
        value LONGTEXT NOT NULL,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) CHARACTER SET utf8mb4`,
    );
    await pool().query(`INSERT IGNORE INTO ${TABLE} (name, value) VALUES (?, ?)`, [KEY, JSON.stringify(await readFile())]);
  })().catch((e) => {
    globalForDb.videoTableReady = undefined;
    throw e;
  });
  return globalForDb.videoTableReady;
}

// In database mode a connection problem throws rather than returning [] —
// otherwise the admin could save on top of an "empty" list and wipe it.
export async function readVideos(): Promise<DoctorVideo[]> {
  if (!useDatabase) return readFile();
  await tableReady();
  const [rows] = await pool().query<mysql.RowDataPacket[]>(`SELECT value FROM ${TABLE} WHERE name = ?`, [KEY]);
  return rows.length ? (JSON.parse(rows[0].value) as DoctorVideo[]) : [];
}

// For the public pages: if the database is unreachable, show the page
// without videos instead of an error screen.
export async function readPublicVideos(): Promise<DoctorVideo[]> {
  try {
    return await readVideos();
  } catch (e) {
    console.error("Couldn't load the doctor videos:", e);
    return [];
  }
}

export async function writeVideos(videos: DoctorVideo[]) {
  if (useDatabase) {
    await tableReady();
    await pool().query(
      `INSERT INTO ${TABLE} (name, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = VALUES(value)`,
      [KEY, JSON.stringify(videos)],
    );
    return;
  }
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(videos, null, 2) + "\n", "utf8");
}

// Shown in /admin so whoever deploys can confirm the database is connected.
export const storageMode = (): "database" | "file" => (useDatabase ? "database" : "file");

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
    slug: slugify(doctor),
    title: cleanTitle,
    thumbnail: hasMaxres ? maxres : `https://i.ytimg.com/vi/${id}/hqdefault.jpg`,
    views,
    likes,
    uploaded,
    duration,
  };
}
