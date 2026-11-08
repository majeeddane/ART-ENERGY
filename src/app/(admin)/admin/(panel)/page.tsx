import Link from "next/link";
import type { ReactNode } from "react";
import { Card, Notice, PageHeader, StatCard } from "@/components/admin/ui";
import { ArrowUpRight, ImageIcon, PenTool, Sparkle } from "@/components/ui/Icons";
import { adminConfigured } from "@/lib/auth";
import { getSiteData, storageSummary, uploadsKind, getContactInquiryCount } from "@/lib/store";

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

function ActionCard({
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
    <Link href={href} className="admin-action">
      <span className="admin-action-icon">{icon}</span>
      <span className="min-w-0 flex-1">
        <span className="admin-action-title">
          <span className="truncate">{title}</span>
          <ArrowUpRight size={13} className="shrink-0 text-[#94a3a5]" />
        </span>
        <span className="admin-action-text">{text}</span>
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

  const inquiriesCount = await getContactInquiryCount({});
  const clientsCount = data.hidden.clients.length;
  const teamCount = data.hidden.team.length;
  const journalCount = data.hidden.journal.length;

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
          className="admin-btn admin-btn-primary admin-btn-sm"
        >
          عرض الموقع
          <ArrowUpRight size={13} />
        </Link>
      </PageHeader>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          label="الخدمات"
          value={dict.services.items.length}
          hint="خدمات رئيسية في الموقع"
          tone="teal"
          icon={<PenTool size={16} />}
        />
        <StatCard
          label="الباقات"
          value={dict.packages.plans.length}
          hint="باقات شهرية جاهزة"
          tone="gold"
          icon={<Sparkle size={16} />}
        />
        <StatCard
          label="خدمات الإنتاج"
          value={dict.production.items.length}
          hint="أسعار ابتداءً من"
          tone="ink"
          icon={<ImageIcon size={16} />}
        />
        <StatCard
          label="عناصر الأقسام المخفية"
          value={hiddenCount}
          hint={`${enabledFlags.length} من 4 أقسام مفعّلة`}
          tone="orange"
          icon={<ArrowUpRight size={16} />}
        />
        <StatCard
          label="استفسارات التواصل"
          value={inquiriesCount}
          hint="طلبات جديدة من نموذج التواصل"
          tone="ink"
          icon={<ArrowUpRight size={16} />}
        />
        <StatCard
          label="العملاء"
          value={clientsCount}
          hint="شعارات العملاء في المعرض"
          tone="gold"
          icon={<ImageIcon size={16} />}
        />
        <StatCard
          label="أعضاء الفريق"
          value={teamCount}
          hint="أعضاء الفريق المعروضون"
          tone="green"
          icon={<ImageIcon size={16} />}
        />
        <StatCard
          label="مقالات المدونة"
          value={journalCount}
          hint="مقالات منشورة في المدونة"
          tone="teal"
          icon={<PenTool size={16} />}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
        <Card
          title="حالة النظام"
          description="تأكد من أن التخزين سحابي قبل النشر حتى لا تضيع التعديلات."
        >
          <div className="space-y-2">
            <div className="admin-row">
              <span className="admin-row-label">تخزين المحتوى</span>
              <span
                className={
                  storage.persistent
                    ? "admin-badge admin-badge-success"
                    : "admin-badge admin-badge-warn"
                }
              >
                <span className="admin-badge-dot" />
                {storage.persistent ? "Postgres" : "ملف محلي"}
              </span>
            </div>
            <p className="px-1 text-[10px] leading-5 text-[#94a3a5]">
              {storage.label}
            </p>

            <div className="admin-row">
              <span className="admin-row-label">رفع الصور</span>
              <span className="admin-chip">
                {uploads === "blob"
                  ? "Vercel Blob"
                  : uploads === "cloudinary"
                    ? "Cloudinary"
                    : "public/uploads"}
              </span>
            </div>

            <div className="admin-row">
              <span className="admin-row-label">كلمة مرور المدير</span>
              <span
                className={
                  adminConfigured()
                    ? "admin-badge admin-badge-success"
                    : "admin-badge admin-badge-warn"
                }
              >
                <span className="admin-badge-dot" />
                {adminConfigured() ? "مُعدّة" : "غير مُعدّة"}
              </span>
            </div>

            <div className="admin-row">
              <span className="admin-row-label">آخر حفظ</span>
              <span className="text-[10px] text-[#6c8085]">
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
                <div key={key} className="admin-row">
                  <span className="admin-row-label">
                    <PenTool size={13} className="text-[#94a3a5]" />
                    {flagLabels[key]}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="font-grotesk text-[9px] text-[#94a3a5]">
                      {data.hidden[key].length} عناصر
                    </span>
                    <span
                      className={
                        data.flags[key]
                          ? "admin-badge admin-badge-success"
                          : "admin-badge admin-badge-neutral"
                      }
                    >
                      <span className="admin-badge-dot" />
                      {data.flags[key] ? "مفعّل" : "مخفي"}
                    </span>
                  </span>
                </div>
              ),
            )}
          </div>
          <Link
            href="/admin/sections"
            className="mt-3 inline-flex items-center gap-1.5 text-[10px] font-semibold text-[#0f97a4] transition hover:text-[#071e25]"
          >
            إدارة الأقسام
            <ArrowUpRight size={11} />
          </Link>
        </Card>
      </div>

      <div className="mt-6">
        <Card title="اختصارات" description="ابدأ من القسم الذي تريد تعديله.">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <ActionCard
              href="/admin/content"
              title="محتوى الموقع"
              text="كل النصوص العربية والإنجليزية، الأسعار، والقوائم."
              icon={<PenTool size={15} />}
            />
            <ActionCard
              href="/admin/sections"
              title="الأقسام المخفية"
              text="أعمال، عملاء، فريق، ومقالات — إضافة وترتيب."
              icon={<Sparkle size={15} />}
            />
            <ActionCard
              href="/admin/settings"
              title="الإعدادات والهوية"
              text="التواصل، الشعار، الصور، السوشيال، والتفعيل."
              icon={<Sparkle size={15} />}
            />
            <ActionCard
              href="/admin/media"
              title="الصور والملفات"
              text={`${data.media.length} صورة في المكتبة. ارفع وانسخ الروابط.`}
              icon={<ImageIcon size={15} />}
            />
          </div>
        </Card>
      </div>

      <div className="mt-4">
        <Notice tone="info">
          جميع النصوص والأسعار والأقسام هنا مبنية على بروفايل ART ENERGY. لا
          تُضاف إحصاءات أو عملاء أو شهادات غير موثّقة — أضف فقط ما لديك مصدر له.
        </Notice>
      </div>
    </div>
  );
}
