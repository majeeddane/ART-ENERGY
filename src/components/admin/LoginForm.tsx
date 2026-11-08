"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { BrandMark } from "@/components/brand/Logo";
import { ArrowUpRight, Lock, Mail } from "@/components/ui/Icons";

export function LoginForm({ configured }: { configured: boolean }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!configured || loading) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "البريد الإلكتروني أو كلمة المرور غير صحيحة.");
        setLoading(false);
        return;
      }
      await router.replace("/admin");
      router.refresh();
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "تعذر تسجيل الدخول.");
      setLoading(false);
    }
  };

  return (
    <main className="admin-login">
      <div className="admin-login-card">
        <aside className="admin-login-aside">
          <div>
            <BrandMark idPrefix="ae-login" className="h-20 w-20 drop-shadow-[0_16px_28px_rgba(7,30,37,0.5)]" />
            <h1 className="admin-login-title">
              لوحة تحكم
              <br />
              ارت إنيرجي
            </h1>
            <p className="admin-login-lead">
              عدّل النصوص والأسعار والصور، أضف الأعمال والعملاء والفريق، وتحكم
              بالأقسام المخفية — كل ذلك من مكان واحد.
            </p>
          </div>
          <div>
            <p className="admin-login-kicker" dir="ltr">
              ART ENERGY / CONTROL ROOM
            </p>
            <div className="admin-login-eq" aria-hidden>
              {[18, 34, 12, 42, 26, 48, 16, 36, 22, 44, 14, 30].map((height, index) => (
                <span key={index} style={{ height }} />
              ))}
            </div>
          </div>
        </aside>

        <section className="admin-login-form">
          <div className="flex items-center justify-between gap-3">
            <span className="admin-eyebrow" style={{ marginBottom: 0 }}>
              ADMIN ACCESS
            </span>
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-[10px] font-medium text-[#6c8085] transition hover:text-[#071e25]"
            >
              عرض الموقع
              <ArrowUpRight size={12} />
            </Link>
          </div>

          <h2 className="mt-7 text-2xl font-bold tracking-tight text-[#071e25]">
            تسجيل الدخول
          </h2>
          <p className="mt-2 text-xs leading-7 text-[#6c8085]">
            أدخل بريدك الإلكتروني وكلمة المرور للمتابعة.
          </p>

          {!configured && (
            <div className="mt-6">
              <div className="admin-notice admin-notice-warn" role="alert">
                <div>
                  <strong className="block">لم يتم إعداد كلمة المرور بعد.</strong>
                  أضف <code className="font-grotesk">ADMIN_PASSWORD</code> و
                  <code className="mx-1 font-grotesk">ADMIN_SESSION_SECRET</code>
                  إلى ملف <code className="font-grotesk">.env.local</code> ثم أعد
                  تشغيل السيرفر. راجع README — قسم لوحة التحكم.
                </div>
              </div>
            </div>
          )}

          <form onSubmit={submit} className="mt-7 space-y-4">
            <div>
              <label htmlFor="admin-email" className="admin-label">
                البريد الإلكتروني
              </label>
              <div className="relative">
                <Mail
                  size={15}
                  className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-[#94a3a5]"
                />
                <input
                  id="admin-email"
                  type="email"
                  autoComplete="email"
                  dir="ltr"
                  className="admin-input ps-9"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@artenergy.sa"
                  disabled={!configured || loading}
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-password" className="admin-label">
                كلمة المرور
              </label>
              <div className="relative">
                <Lock
                  size={15}
                  className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-[#94a3a5]"
                />
                <input
                  id="admin-password"
                  type="password"
                  autoComplete="current-password"
                  dir="ltr"
                  className="admin-input ps-9"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••••••"
                  disabled={!configured || loading}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="admin-notice admin-notice-danger" role="alert">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={!configured || loading || !email || !password}
              className="admin-btn admin-btn-primary min-h-11 w-full"
            >
              {loading ? "جارٍ التحقق…" : "دخول إلى اللوحة"}
              <ArrowUpRight size={15} className="rtl:-scale-x-100" />
            </button>
          </form>

          <p className="mt-6 text-[10px] leading-5 text-[#94a3a5]">
            الجلسة محفوظة في كوكي آمن لمدة 7 أيام. لا تشارك كلمة المرور مع أي
            شخص.
          </p>
        </section>
      </div>
    </main>
  );
}
