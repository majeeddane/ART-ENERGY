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
    <main className="flex min-h-screen items-center justify-center px-4 py-10">
      <div className="grid w-full max-w-4xl overflow-hidden rounded-[2rem] border border-[#E7E0D3] bg-white shadow-[0_40px_100px_-50px_rgba(11,39,48,0.6)] lg:grid-cols-[1fr_1.05fr]">
        <aside className="relative hidden overflow-hidden bg-[#0B2730] p-10 text-[#F7F2E9] lg:flex lg:flex-col lg:justify-between">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_15%,rgba(19,156,170,0.35),transparent_50%)]" />
          <div className="pointer-events-none absolute -bottom-20 -end-16 h-72 w-72 rounded-full bg-[#D1A246]/20 blur-3xl" />
          <div className="relative">
            <BrandMark idPrefix="ae-login" className="h-20 w-20 drop-shadow-[0_16px_28px_rgba(11,39,48,0.45)]" />
            <h1 className="mt-8 font-display text-4xl leading-tight tracking-tight">
              لوحة تحكم
              <br />
              ارت إنيرجي
            </h1>
            <p className="mt-4 max-w-xs text-sm leading-8 text-white/55">
              عدّل النصوص والأسعار والصور، أضف الأعمال والعملاء والفريق، وتحكم
              بالأقسام المخفية — كل ذلك من مكان واحد.
            </p>
          </div>
          <div className="relative mt-8">
            <p className="font-grotesk text-[9px] uppercase tracking-[0.26em] text-[#F2E04E]/70" dir="ltr">
              ART ENERGY / CONTROL ROOM
            </p>
            <div className="mt-4 flex items-end gap-1.5 opacity-70" aria-hidden>
              {[18, 34, 12, 42, 26, 48, 16, 36, 22, 44, 14, 30].map((height, index) => (
                <span
                  key={index}
                  className="w-1.5 rounded-t-sm bg-gradient-to-t from-[#139CAA] to-[#F2E04E]"
                  style={{ height }}
                />
              ))}
            </div>
          </div>
        </aside>

        <section className="p-7 sm:p-10">
          <div className="flex items-center justify-between">
            <span className="eyebrow text-[9px] text-[#8A6A25] uppercase">
              ADMIN ACCESS
            </span>
            <Link
              href="/"
              className="inline-flex items-center gap-1 text-[10px] font-medium text-[#6A7D80] transition hover:text-[#0B2730]"
            >
              عرض الموقع
              <ArrowUpRight size={12} />
            </Link>
          </div>

          <h2 className="mt-7 text-2xl font-bold text-[#0B2730] tracking-tight">
            تسجيل الدخول
          </h2>
          <p className="mt-2 text-sm leading-7 text-[#6A7D80]">
            أدخل بريدك الإلكتروني وكلمة المرور للمتابعة.
          </p>

          {!configured && (
            <div className="mt-6 rounded-xl border border-[#D1A246]/50 bg-[#FBF3DD] p-4 text-xs leading-6 text-[#73551A]">
              <strong className="block">لم يتم إعداد كلمة المرور بعد.</strong>
              أضف <code className="font-grotesk">ADMIN_PASSWORD</code> و
              <code className="mx-1 font-grotesk">ADMIN_SESSION_SECRET</code>
              إلى ملف <code className="font-grotesk">.env.local</code> ثم أعد
              تشغيل السيرفر. راجع README — قسم لوحة التحكم.
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
                  className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-[#8A9797]"
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
                  className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 text-[#8A9797]"
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
              <p
                role="alert"
                className="rounded-xl border border-[#E7B9B5] bg-[#FDF3F2] px-3 py-2.5 text-xs text-[#A9362E] shadow-soft"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={!configured || loading || !email || !password}
              className="admin-btn admin-btn-primary w-full transition-all duration-200 hover:shadow-[0_0_0_6px_color-mix(in_srgb,#0B2730_20%,transparent)]"
            >
              {loading ? "جارٍ التحقق…" : "دخول إلى اللوحة"}
              <ArrowUpRight size={15} className="rtl:-scale-x-100 transition-transform duration-200" />
            </button>
          </form>

          <p className="mt-6 text-[10px] leading-5 text-[#8A9797]">
            الجلسة محفوظة في كوكي آمن لمدة 7 أيام. لا تشارك كلمة المرور مع أي
            شخص.
          </p>
        </section>
      </div>
    </main>
  );
}
