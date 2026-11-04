import Link from "next/link";
import type { ReactNode } from "react";
import { PageHeader, Card, Notice } from "@/components/admin/ui";
import { ArrowUpRight, ImageIcon, Note, Sparkle } from "@/components/ui/Icons";
import { adminConfigured } from "@/lib/auth";
import { getSiteData, storageSummary, uploadsKind } from "@/lib/store";

export const dynamic = "force-dynamic";

function dateLabel(value: string) {
  if (!value) return "لم يُحفظ بعد";
  try {
    return new Intl.DateTimeFormat("ar-SA", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  } catch {
    return value;
  }
}

function Stat({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <div className="rounded-xl border border-[#E7E0D3] bg-[#FCFAF5] p-3.5">
      <p className="text-[10px] font-semibold text-[#6A7D80]">{label}</p>
      <p className="mt-1.5 font-display text-2xl leading-none text-[#0B2730]">
        {value}
      </p>
      {hint && <p className="mt-1.5 text-[10px] text-[#8A9797]">{hint}</p>}
    </div>
  );
}

function Action({
  href,
  title,
  text,
  icon,
}: {
  href: string;
  title: string;
  text: string;
  icon: ReactNode;
}) {
  return (
    <Link
      href={href}
      className="group flex items-start gap-3 rounded-xl border border-[#E7E0D3] bg-white p-3.5 transition hover:border-[#139CAA] hover:shadow-[0_18px_40px_-30px_rgba(11,39,48,0.5)]"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#0B2730] text-[#F2E04E]">
        {icon}
      </span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-[#0B2730]">{title}</span>
          <ArrowUpRight
            size={13}
            className="text-[#8A9797] transition group-hover:text-[#139CAA]"
          />
        </span>
        <span className="mt-1 block text-[10px] leading-5 text-[#6A7D80]">
          {text}
        </span>
      </span>
    </Link>
  );
}

export default async function AdminOverviewPage() {
  const data = await getSiteData();
  const storage = storageSummary();
  const uploads = uploadsKind();
  const dict = data.content.ar;

  const hiddenCount =
    data.hidden.work.length +
    data.hidden.clients.length +
    data.hidden.team.length +
    data.hidden.journal.length;

  const enabledFlags = (
    Object.keys(data.flags) as Array<keyof typeof data.flags>
  ).filter((key) => data.flags[key]);

  const flagLabels: Record<keyof typeof data.flags, string> = {
    work: "الأعمال",
    clients: "العملاء",
    team: "الفريق",
    journal: "المدونة",
  };

  return (
    <div>
      <PageHeader
        eyebrow="DASHBOARD / لوحة التحكم"
        title="نظرة عامة"
        description="كل ما يظهر في الموقع يُدار من هنا: النصوص، الأسعار، الصور، بيانات التواصل، والأقسام المخفية."
      >
        <Link
          href="/"
          target="_blank"
          className="admin-btn admin-btn-primary min-h-9 px-4 text-[10px]"
        >
          عرض الموقع
          <ArrowUpRight size={13} />
        </Link>
      </PageHeader>

      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Stat
            label="الخدمات"
            value={dict.services.items.length}
            hint="خدمات رئيسية في الموقع"
          />
          <Stat
            label="الباقات"
            value={dict.packages.plans.length}
            hint="باقات شهرية جاهزة"
          />
          <Stat
            label="خدمات الإنتاج"
            value={dict.production.items.length}
            hint="أسعار ابتداءً من"
          />
          <Stat
            label="عناصر الأقسام المخفية"
            value={hiddenCount}
            hint={`${enabledFlags.length} من 4 أقسام مفعّلة`}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <Card
            title="حالة النظام"
            description="تأكد من أن التخزين سحابي قبل النشر حتى لا تضيع التعديلات."
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between gap-3 rounded-xl border border-[#E7E0D3] bg-[#FCFAF5] px-3.5 py-3">
                <span className="text-xs font-semibold text-[#14262B]">
                  تخزين المحتوى
                </span>
                <span
                  className={
                    storage.persistent
                      ? "inline-flex items-center gap-1.5 rounded-full bg-[#EFF9F2] px-2.5 py-1 text-[10px] font-medium text-[#2C6B44]"
                      : "inline-flex items-center gap-1.5 rounded-full bg-[#FBF3DD] px-2.5 py-1 text-[10px] font-medium text-[#73551A]"
                  }
                >
                  <span
                    className={
                      storage.persistent
                        ? "h-1.5 w-1.5 rounded-full bg-[#3BA66B]"
                        : "h-1.5 w-1.5 rounded-full bg-[#D1A246]"
                    }
                  />
                  {storage.persistent ? "Postgres" : "ملف محلي"}
                </span>
              </div>
              <p className="px-1 text-[10px] leading-5 text-[#8A9797]">
                {storage.label}
              </p>

              <div className="flex items-center justify-between gap-3 rounded-xl border border-[#E7E0D3] bg-[#FCFAF5] px-3.5 py-3">
                <span className="text-xs font-semibold text-[#14262B]">
                  رفع الصور
                </span>
                <span className="admin-chip">
                  {uploads === "blob"
                    ? "Vercel Blob"
                    : uploads === "cloudinary"
                      ? "Cloudinary"
                      : "public/uploads"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 rounded-xl border border-[#E7E0D3] bg-[#FCFAF5] px-3.5 py-3">
                <span className="text-xs font-semibold text-[#14262B]">
                  كلمة مرور المدير
                </span>
                <span
                  className={
                    adminConfigured()
                      ? "admin-chip border-[#B9DCC4] text-[#2C6B44]"
                      : "admin-chip border-[#E7D19A] text-[#73551A]"
                  }
                >
                  {adminConfigured() ? "مُعدّة" : "غير مُعدّة"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 rounded-xl border border-[#E7E0D3] bg-[#FCFAF5] px-3.5 py-3">
                <span className="text-xs font-semibold text-[#14262B]">
                  آخر حفظ
                </span>
                <span className="text-[10px] text-[#6A7D80]">
                  {dateLabel(data.updatedAt)}
                </span>
              </div>
            </div>

            {!storage.persistent && (
              <div className="mt-3">
                <Notice tone="warn">
                  أنت تستخدم التخزين المحلي. على Vercel أو Netlify أضف{" "}
                  <code className="font-grotesk">DATABASE_URL</code> (Neon أو
                  Postgres) و<code className="font-grotesk">BLOB_READ_WRITE_TOKEN</code>{" "}
                  قبل النشر. راجع README.
                </Notice>
              </div>
            )}
          </Card>

          <Card
            title="الأقسام المخفية"
            description="تظهر بين «لماذا نحن» و«تواصل معنا» عند تفعيلها."
          >
            <div className="space-y-2">
              {(Object.keys(flagLabels) as Array<keyof typeof flagLabels>).map(
                (key) => (
                  <div
                    key={key}
                    className="flex items-center justify-between gap-3 rounded-xl border border-[#E7E0D3] bg-[#FCFAF5] px-3.5 py-2.5"
                  >
                    <span className="flex items-center gap-2 text-xs font-semibold text-[#14262B]">
                      <Note size={13} className="text-[#8A9797]" />
                      {flagLabels[key]}
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="font-grotesk text-[9px] text-[#9AA5A5]">
                        {data.hidden[key].length} عناصر
                      </span>
                      <span
                        className={
                          data.flags[key]
                            ? "rounded-full bg-[#EFF9F2] px-2 py-0.5 text-[9px] font-medium text-[#2C6B44]"
                            : "rounded-full bg-[#F1EEE7] px-2 py-0.5 text-[9px] font-medium text-[#8A9797]"
                        }
                      >
                        {data.flags[key] ? "مفعّل" : "مخفي"}
                      </span>
                    </span>
                  </div>
                ),
              )}
            </div>
            <Link
              href="/admin/sections"
              className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-semibold text-[#139CAA] transition hover:text-[#0B2730]"
            >
              إدارة الأقسام
              <ArrowUpRight size={11} />
            </Link>
          </Card>
        </div>

        <Card title="اختصارات" description="ابدأ من القسم الذي تريد تعديله.">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Action
              href="/admin/content"
              title="محتوى الموقع"
              text="كل النصوص العربية والإنجليزية، الأسعار، والقوائم."
              icon={<Note size={15} />}
            />
            <Action
              href="/admin/sections"
              title="الأقسام المخفية"
              text="أعمال، عملاء، فريق، ومقالات — إضافة وترتيب."
              icon={<Sparkle size={15} />}
            />
            <Action
              href="/admin/settings"
              title="الإعدادات والهوية"
              text="التواصل، الشعار، الصور، السوشيال، والتفعيل."
              icon={<Sparkle size={15} />}
            />
            <Action
              href="/admin/media"
              title="الصور والملفات"
              text={`${data.media.length} صورة في المكتبة. ارفع وانسخ الروابط.`}
              icon={<ImageIcon size={15} />}
            />
          </div>
        </Card>

        <Notice tone="info">
          جميع النصوص والأسعار والأقسام هنا مبنية على بروفايل ART ENERGY. لا
          تُضاف إحصاءات أو عملاء أو شهادات غير موثّقة — أضف فقط ما لديك مصدر له.
        </Notice>
      </div>
    </div>
  );
}
