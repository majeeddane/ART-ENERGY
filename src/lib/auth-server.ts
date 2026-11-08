"use server";

import { cookies } from "next/headers";
import {
  verifyAdminPassword,
  type AdminUserWithRole,
} from "@/lib/store";
import {
  ADMIN_COOKIE,
  decodeSessionToken,
  verifyPassword,
  verifySessionToken,
} from "@/lib/auth";

/**
 * تسجيل دخول متعدد المستخدمين: يتحقق من قاعدة البيانات أولاً،
 * ثم يعود إلى كلمة مرور واحدة (ADMIN_PASSWORD) للتطوير المحلي.
 */
export async function verifyAdminLogin(input: {
  email: string;
  password: string;
}): Promise<AdminUserWithRole | null> {
  // 먼저 시도: قاعدة البيانات
  const dbUser = await verifyAdminPassword(input.email, input.password);
  if (dbUser) return dbUser;

  // 돌려: كلمة مرور واحدة (للتطوير المحلي أو التوافق مع الإعداد القديم)
  if (input.email === "admin@artenergy.sa" && verifyPassword(input.password)) {
    return {
      id: "admin_legacy",
      email: input.email,
      name: "مدير النظام",
      role: "admin",
      password_hash: "",
      is_active: true,
      last_login_at: null,
      created_at: "",
      updated_at: "",
      role_permissions: {
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
    };
  }

  return null;
}

export async function isAuthenticated() {
  const jar = await cookies();
  return verifySessionToken(jar.get(ADMIN_COOKIE)?.value);
}

export async function getCurrentUser(): Promise<AdminUserWithRole | null> {
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (!token) return null;

  const payload = decodeSessionToken(token);
  if (!payload || !payload.userId) return null;

  // إذا كان مستخدم قديم (legacy)، أعد كائن بسيط
  if (payload.userId === "admin_legacy") {
    return {
      id: "admin_legacy",
      email: payload.email ?? "admin@artenergy.sa",
      name: "مدير النظام",
      role: (payload.role ?? "admin") as "admin" | "editor" | "viewer",
      password_hash: "",
      is_active: true,
      last_login_at: null,
      created_at: "",
      updated_at: "",
      role_permissions: {
        role: (payload.role ?? "admin") as "admin" | "editor" | "viewer",
        can_view_dashboard: true,
        can_edit_content: true,
        can_manage_sections: true,
        can_manage_settings: true,
        can_manage_media: true,
        can_manage_users: true,
        can_manage_inquiries: true,
        can_view_audit_log: true,
      },
    };
  }

  // للمستخدمين الجدد، جلب من قاعدة البيانات
  const { getAdminUserByEmail } = await import("@/lib/store");
  if (payload.email) {
    return getAdminUserByEmail(payload.email);
  }
  return null;
}
