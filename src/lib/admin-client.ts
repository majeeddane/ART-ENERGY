"use client";

import type { MediaItem } from "@content/model";
import type { SiteData } from "@content/site";

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    headers: {
      ...(init?.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...init?.headers,
    },
  });

  const data = (await response.json().catch(() => null)) as
    | (T & { message?: string; error?: string })
    | null;

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("انتهت الجلسة. أعد تسجيل الدخول.");
    }
    throw new Error(
      data?.message ||
        data?.error ||
        `فشل الطلب (${response.status}). حاول مرة أخرى.`,
    );
  }

  return data as T;
}

export function saveContent(data: SiteData) {
  return request<{ ok: true; data: SiteData }>("/api/admin/content", {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export function uploadImage(file: File) {
  const form = new FormData();
  form.append("file", file);
  return request<{ ok: true; item: MediaItem; data: SiteData }>(
    "/api/admin/upload",
    { method: "POST", body: form },
  );
}

export function listMedia() {
  return request<{ ok: true; media: MediaItem[] }>("/api/admin/media");
}

export function deleteMedia(url: string, force = false) {
  return request<{ ok: true; data: SiteData }>(
    `/api/admin/media?url=${encodeURIComponent(url)}${force ? "&force=1" : ""}`,
    { method: "DELETE" },
  );
}

export function login(password: string) {
  return request<{ ok: true }>("/api/admin/auth", {
    method: "POST",
    body: JSON.stringify({ password }),
  });
}

export function logout() {
  return request<{ ok: true }>("/api/admin/auth", { method: "DELETE" });
}

export function newId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}
