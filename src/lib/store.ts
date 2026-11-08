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
  __artEnergyInquiriesReady?: Promise<void>;
  __artEnergyAdminTablesReady?: Promise<void>;
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

  if (!globalStore.__artEnergyInquiriesReady) {
    globalStore.__artEnergyInquiriesReady = pool
      .query(
        `create table if not exists contact_inquiries (
          id text primary key,
          name text not null,
          phone text not null,
          email text not null,
          service text not null,
          message text not null,
          locale text not null default 'ar',
          quote jsonb default '[]'::jsonb,
          status text not null default 'new',
          internal_notes text default '',
          created_at timestamptz not null default now(),
          updated_at timestamptz not null default now()
        )`,
      )
      .then(() => undefined);
  }
  await globalStore.__artEnergyInquiriesReady;
}

export type ContactInquiry = {
  id: string;
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  locale: string;
  quote: Array<{ label?: string; price?: number; priceMax?: number; suffix?: string }>;
  status: "new" | "reviewing" | "contacted" | "completed" | "closed";
  internal_notes: string;
  created_at: string;
  updated_at: string;
};

export async function createContactInquiry(input: {
  name: string;
  phone: string;
  email: string;
  service: string;
  message: string;
  locale?: string;
  quote?: Array<{ label?: string; price?: number; priceMax?: number; suffix?: string }>;
}): Promise<ContactInquiry> {
  const id = `inq_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const pool = getPool();
  await ensureTable(pool);
  const result = await pool.query<ContactInquiry>(
    `insert into contact_inquiries (id, name, phone, email, service, message, locale, quote, status, internal_notes)
     values ($1, $2, $3, $4, $5, $6, $7, $8::jsonb, 'new', '')
     returning *`,
    [id, input.name, input.phone, input.email, input.service, input.message, input.locale ?? "ar", JSON.stringify(input.quote ?? [])],
  );
  return result.rows[0];
}

export async function listContactInquiries({
  status,
  search,
  limit = 50,
  offset = 0,
}: {
  status?: ContactInquiry["status"];
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<ContactInquiry[]> {
  const pool = getPool();
  await ensureTable(pool);
  let query = "select * from contact_inquiries";
  const params: Array<string | number> = [];
  const conditions: Array<string> = [];

  if (status) {
    conditions.push(`status = $${params.push(status)}`);
  }
  if (search) {
    conditions.push(`(name ILIKE $${params.push(`%${search}%`)} OR email ILIKE $${params.push(`%${search}%`)} OR phone ILIKE $${params.push(`%${search}%`)})`);
  }

  if (conditions.length) {
    query += " where " + conditions.join(" and ");
  }

  query += ` order by created_at desc limit $${params.push(limit)} offset $${params.push(offset)}`;

  const result = await pool.query<ContactInquiry>(query, params);
  return result.rows;
}

export async function getContactInquiryCount({
  status,
  search,
}: {
  status?: ContactInquiry["status"];
  search?: string;
}): Promise<number> {
  const pool = getPool();
  await ensureTable(pool);
  let query = "select count(*)::int as c from contact_inquiries";
  const params: Array<string | number> = [];
  const conditions: Array<string> = [];

  if (status) {
    conditions.push(`status = $${params.push(status)}`);
  }
  if (search) {
    conditions.push(`(name ILIKE $${params.push(`%${search}%`)} OR email ILIKE $${params.push(`%${search}%`)} OR phone ILIKE $${params.push(`%${search}%`)})`);
  }

  if (conditions.length) {
    query += " where " + conditions.join(" and ");
  }

  const result = await pool.query<{ c: number }>(query, params);
  return result.rows[0]?.c ?? 0;
}

export async function updateContactInquiryStatus(id: string, status: ContactInquiry["status"], internal_notes?: string): Promise<ContactInquiry | null> {
  const pool = getPool();
  await ensureTable(pool);
  const result = await pool.query<ContactInquiry>(
    `update contact_inquiries set status = $2, internal_notes = coalesce($3, internal_notes), updated_at = now() where id = $1 returning *`,
    [id, status, internal_notes ?? null],
  );
  return result.rows[0] ?? null;
}

export async function deleteContactInquiry(id: string): Promise<boolean> {
  const pool = getPool();
  await ensureTable(pool);
  const result = await pool.query("delete from contact_inquiries where id = $1 returning id", [id]);
  return (result.rowCount ?? 0) > 0;
}

/* --------------------------------------------------------------
   نظام المستخدمين والأمان - جداول وأدوار وصلاحيات
   -------------------------------------------------------------- */

export type AdminUserRole = "admin" | "editor" | "viewer";

export type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: AdminUserRole;
  password_hash: string;
  is_active: boolean;
  last_login_at: string | null;
  created_at: string;
  updated_at: string;
};

export type AdminUserRolePermission = {
  role: AdminUserRole;
  can_view_dashboard: boolean;
  can_edit_content: boolean;
  can_manage_sections: boolean;
  can_manage_settings: boolean;
  can_manage_media: boolean;
  can_manage_users: boolean;
  can_manage_inquiries: boolean;
  can_view_audit_log: boolean;
};

export const DEFAULT_ROLE_PERMISSIONS: Record<AdminUserRole, AdminUserRolePermission> = {
  admin: {
    role: "admin",
    can_view_dashboard: true,
    can_edit_content: true,
    can_manage_sections: true,
    can_manage_settings: true,
    can_manage_media: true,
    can_manage_users: true,
    can_manage_inquiries: true,
    can_view_audit_log: true,
  },
  editor: {
    role: "editor",
    can_view_dashboard: true,
    can_edit_content: true,
    can_manage_sections: true,
    can_manage_settings: false,
    can_manage_media: true,
    can_manage_users: false,
    can_manage_inquiries: true,
    can_view_audit_log: false,
  },
  viewer: {
    role: "viewer",
    can_view_dashboard: true,
    can_edit_content: false,
    can_manage_sections: false,
    can_manage_settings: false,
    can_manage_media: false,
    can_manage_users: false,
    can_manage_inquiries: false,
    can_view_audit_log: false,
  },
};

export type AdminAuditLog = {
  id: string;
  user_id: string;
  user_email: string;
  action: string;
  target_type: string;
  target_id: string | null;
  details: string | null;
  ip_address: string | null;
  created_at: string;
};

async function ensureAdminTables(pool: Pool) {
  if (!globalStore.__artEnergyAdminTablesReady) {
    globalStore.__artEnergyAdminTablesReady = pool
      .query(`
        create table if not exists admin_users (
          id text primary key,
          email text unique not null,
          name text not null,
          role text not null default 'viewer',
          password_hash text not null,
          is_active boolean not null default true,
          last_login_at timestamptz,
          created_at timestamptz not null default now(),
          updated_at timestamptz not null default now()
        );
        create table if not exists admin_audit_log (
          id text primary key,
          user_id text not null,
          user_email text not null,
          action text not null,
          target_type text not null,
          target_id text,
          details text,
          ip_address text,
          created_at timestamptz not null default now()
        );
        create index if not exists idx_admin_audit_log_user_id on admin_audit_log(user_id);
        create index if not exists idx_admin_audit_log_created_at on admin_audit_log(created_at desc);
        create index if not exists idx_admin_users_email on admin_users(email);
      `)
      .then(() => undefined);
  }
  await globalStore.__artEnergyAdminTablesReady;
}

async function ensureAdminSeed(pool: Pool) {
  const existing = await pool.query("select count(*)::int as c from admin_users");
  if (Number(existing.rows[0]?.c ?? 0) > 0) return;

  const { createHmac } = await import("node:crypto");
  const hash = (password: string) =>
    createHmac("sha256", process.env.ADMIN_SESSION_SECRET || "default-change-me")
      .update(password)
      .digest("hex");

  await pool.query(
    `insert into admin_users (id, email, name, role, password_hash, is_active)
     values ($1, $2, $3, $4, $5, true)`,
    [
      "admin_1",
      "admin@artenergy.sa",
      "مدير النظام",
      "admin",
      hash("art2026"),
    ],
  );
}

async function writeAuditLog({
  pool,
  userId,
  userEmail,
  action,
  targetType,
  targetId,
  details,
  ipAddress,
}: {
  pool: Pool;
  userId: string;
  userEmail: string;
  action: string;
  targetType: string;
  targetId?: string | null;
  details?: string | null;
  ipAddress?: string | null;
}) {
  const id = `audit_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  await pool.query(
    `insert into admin_audit_log (id, user_id, user_email, action, target_type, target_id, details, ip_address)
     values ($1, $2, $3, $4, $5, $6, $7, $8)`,
    [id, userId, userEmail, action, targetType, targetId ?? null, details ?? null, ipAddress ?? null],
  );
}

export type AdminUserWithRole = AdminUser & { role_permissions: AdminUserRolePermission };

export async function listAdminUsers(): Promise<AdminUserWithRole[]> {
  const pool = getPool();
  await ensureAdminTables(pool);
  await ensureAdminSeed(pool);
  const result = await pool.query<AdminUser>(
    "select id, email, name, role, is_active, last_login_at, created_at, updated_at from admin_users order by created_at asc",
  );
  return result.rows.map((row) => ({
    ...row,
    role_permissions: DEFAULT_ROLE_PERMISSIONS[row.role as AdminUserRole] ?? DEFAULT_ROLE_PERMISSIONS.viewer,
  }));
}

export async function getAdminUserByEmail(email: string): Promise<AdminUserWithRole | null> {
  const pool = getPool();
  await ensureAdminTables(pool);
  await ensureAdminSeed(pool);
  const result = await pool.query<AdminUser>(
    "select * from admin_users where email = $1 limit 1",
    [email],
  );
  const row = result.rows[0];
  if (!row) return null;
  return {
    ...row,
    role_permissions: DEFAULT_ROLE_PERMISSIONS[row.role as AdminUserRole] ?? DEFAULT_ROLE_PERMISSIONS.viewer,
  };
}

export async function verifyAdminPassword(email: string, password: string): Promise<AdminUserWithRole | null> {
  const user = await getAdminUserByEmail(email);
  if (!user || !user.is_active) return null;
  const { createHmac } = await import("node:crypto");
  const hash = createHmac("sha256", process.env.ADMIN_SESSION_SECRET || "default-change-me")
    .update(password)
    .digest("hex");
  if (hash !== user.password_hash) return null;
  await poolUpdateLastLogin(user.id);
  return user;
}

async function poolUpdateLastLogin(userId: string) {
  const pool = getPool();
  await pool.query("update admin_users set last_login_at = now() where id = $1", [userId]);
}

export async function createAdminUser(input: {
  email: string;
  name: string;
  role: AdminUserRole;
  password: string;
}): Promise<AdminUser> {
  const pool = getPool();
  await ensureAdminTables(pool);
  const { createHmac } = await import("node:crypto");
  const hash = createHmac("sha256", process.env.ADMIN_SESSION_SECRET || "default-change-me")
    .update(input.password)
    .digest("hex");
  const id = `user_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  const result = await pool.query<AdminUser>(
    `insert into admin_users (id, email, name, role, password_hash, is_active)
     values ($1, $2, $3, $4, $5, true)
     returning id, email, name, role, is_active, last_login_at, created_at, updated_at`,
    [id, input.email, input.name, input.role, hash],
  );
  return result.rows[0];
}

export async function updateAdminUserRole(id: string, role: AdminUserRole, is_active: boolean): Promise<AdminUser | null> {
  const pool = getPool();
  await ensureAdminTables(pool);
  const result = await pool.query<AdminUser>(
    `update admin_users set role = $2, is_active = $3, updated_at = now() where id = $1 returning id, email, name, role, is_active, last_login_at, created_at, updated_at`,
    [id, role, is_active],
  );
  return result.rows[0] ?? null;
}

export async function deleteAdminUser(id: string): Promise<boolean> {
  const pool = getPool();
  await ensureAdminTables(pool);
  const result = await pool.query("delete from admin_users where id = $1 returning id", [id]);
  return (result.rowCount ?? 0) > 0;
}

export async function listAdminAuditLog({
  limit = 50,
  offset = 0,
  userId,
  action,
}: {
  limit?: number;
  offset?: number;
  userId?: string;
  action?: string;
}): Promise<AdminAuditLog[]> {
  const pool = getPool();
  await ensureAdminTables(pool);
  let query = "select * from admin_audit_log";
  const params: Array<string | number> = [];
  const conditions: Array<string> = [];

  if (userId) {
    conditions.push(`user_id = $${params.push(userId)}`);
  }
  if (action) {
    conditions.push(`action ILIKE $${params.push(`%${action}%`)}`);
  }

  if (conditions.length) {
    query += " where " + conditions.join(" and ");
  }

  query += ` order by created_at desc limit $${params.push(limit)} offset $${params.push(offset)}`;

  const result = await pool.query<AdminAuditLog>(query, params);
  return result.rows;
}

export async function countAdminAuditLog({
  userId,
  action,
}: {
  userId?: string;
  action?: string;
}): Promise<number> {
  const pool = getPool();
  await ensureAdminTables(pool);
  let query = "select count(*)::int as c from admin_audit_log";
  const params: Array<string | number> = [];
  const conditions: Array<string> = [];

  if (userId) {
    conditions.push(`user_id = $${params.push(userId)}`);
  }
  if (action) {
    conditions.push(`action ILIKE $${params.push(`%${action}%`)}`);
  }

  if (conditions.length) {
    query += " where " + conditions.join(" and ");
  }

  const result = await pool.query<{ c: number }>(query, params);
  return result.rows[0]?.c ?? 0;
}

export async function logAdminAction({
  userId,
  userEmail,
  action,
  targetType,
  targetId,
  details,
  ipAddress,
}: {
  userId: string;
  userEmail: string;
  action: string;
  targetType: string;
  targetId?: string | null;
  details?: string | null;
  ipAddress?: string | null;
}) {
  const pool = getPool();
  await ensureAdminTables(pool);
  await writeAuditLog({
    pool,
    userId,
    userEmail,
    action,
    targetType,
    targetId,
    details,
    ipAddress,
  });
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
