import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { cache } from "react";
import { Pool } from "pg";
import { createDefaultSiteData, type SiteData } from "@content/site";
import { normalizeSiteData } from "@/lib/site-data";

const ROW_ID = "site";
const DATA_FILE = path.join(process.cwd(), "content", "runtime.json");

type GlobalStore = typeof globalThis & {
  __artEnergyPool?: Pool;
  __artEnergyTableReady?: Promise<void>;
};

const globalStore = globalThis as GlobalStore;

function databaseUrl() {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || "";
}

export function storageKind(): "postgres" | "file" {
  return databaseUrl() ? "postgres" : "file";
}

export function uploadsKind(): "blob" | "cloudinary" | "local" {
  if (process.env.BLOB_READ_WRITE_TOKEN) return "blob";
  if (
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_UPLOAD_PRESET
  )
    return "cloudinary";
  return "local";
}

function getPool() {
  if (!globalStore.__artEnergyPool) {
    const url = databaseUrl();
    const local = /localhost|127\.0\.0\.1/.test(url);
    globalStore.__artEnergyPool = new Pool({
      connectionString: url,
      max: 3,
      ssl: local ? undefined : { rejectUnauthorized: false },
    });
  }
  return globalStore.__artEnergyPool;
}

async function ensureTable(pool: Pool) {
  if (!globalStore.__artEnergyTableReady) {
    globalStore.__artEnergyTableReady = pool
      .query(
        `create table if not exists site_content (
          id text primary key,
          data jsonb not null,
          updated_at timestamptz not null default now()
        )`,
      )
      .then(() => undefined);
  }
  await globalStore.__artEnergyTableReady;
}

async function readFileStore(): Promise<SiteData> {
  try {
    const raw = await readFile(DATA_FILE, "utf8");
    return normalizeSiteData(JSON.parse(raw));
  } catch {
    return createDefaultSiteData();
  }
}

export async function readSiteData(): Promise<SiteData> {
  if (!databaseUrl()) return readFileStore();

  try {
    const pool = getPool();
    await ensureTable(pool);
    const result = await pool.query<{ data: SiteData }>(
      "select data from site_content where id = $1 limit 1",
      [ROW_ID],
    );
    if (result.rows[0]?.data) {
      return normalizeSiteData(result.rows[0].data);
    }
    return createDefaultSiteData();
  } catch (error) {
    console.error(
      "[art-energy] Postgres read failed, falling back to local file:",
      error,
    );
    return readFileStore();
  }
}

/** Deduplicated per request in server components. */
export const getSiteData = cache(readSiteData);

export async function saveSiteData(input: unknown): Promise<SiteData> {
  const data = normalizeSiteData(input);
  data.updatedAt = new Date().toISOString();

  if (databaseUrl()) {
    const pool = getPool();
    await ensureTable(pool);
    await pool.query(
      `insert into site_content (id, data, updated_at)
       values ($1, $2::jsonb, now())
       on conflict (id) do update set data = excluded.data, updated_at = now()`,
      [ROW_ID, JSON.stringify(data)],
    );
    return data;
  }

  if (process.env.VERCEL) {
    throw new Error(
      "DATABASE_URL is required on Vercel. Add a Postgres connection string before saving.",
    );
  }

  await mkdir(path.dirname(DATA_FILE), { recursive: true });
  const temp = `${DATA_FILE}.${process.pid}.${Date.now()}.tmp`;
  await writeFile(temp, JSON.stringify(data, null, 2), "utf8");
  await rename(temp, DATA_FILE);
  return data;
}

export function storageSummary() {
  const kind = storageKind();
  return {
    kind,
    label:
      kind === "postgres"
        ? "Postgres (سحابي — آمن على Vercel/Netlify)"
        : "ملف محلي content/runtime.json (للتطوير فقط)",
    persistent: kind === "postgres",
    uploads: uploadsKind(),
  };
}
