"use client";

import type { ReactNode } from "react";
import { Card, ImageField, Notice, PageHeader, SaveBar, Toggle } from "@/components/admin/ui";
import { useSiteDraft } from "@/components/admin/useSiteDraft";
import type { SiteData } from "@content/site";
import type { FeatureFlags, SiteSettings, SocialLinks } from "@content/model";

const FLAG_COPY: Record<keyof FeatureFlags, { label: string; description: string }> = {
  work: {
    label: "قسم الأعمال",
    description: "معرض المشاريع وحالات العمل. يظهر في الصفحة بعد إضافة عناصر.",
  },
  clients: {
    label: "قسم العملاء",
    description: "شعارات العملاء والشراكات.",
  },
  team: {
    label: "قسم الفريق",
    description: "بطاقات أعضاء الفريق والأدوار والنبذات.",
  },
  journal: {
    label: "قسم المدونة",
    description: "المقالات والرؤى والأخبار.",
  },
};

const SOCIAL_FIELDS: Array<[keyof SocialLinks, string]> = [
  ["instagram", "Instagram"],
  ["x", "X (Twitter)"],
  ["linkedin", "LinkedIn"],
  ["tiktok", "TikTok"],
  ["youtube", "YouTube"],
  ["behance", "Behance"],
  ["facebook", "Facebook"],
];

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="admin-label">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[10px] leading-5 text-[#8A9797]">{hint}</span>}
    </label>
  );
}

export function SettingsEditor({ initialData }: { initialData: SiteData }) {
  const { draft, setDraft, dirty, saving, message, save, discard } =
    useSiteDraft(initialData);

  const setSettings = (patch: Partial<SiteSettings>) => {
    setDraft((current) => ({
      ...current,
      settings: { ...current.settings, ...patch },
    }));
  };

  const setSocial = (key: keyof SocialLinks, value: string) => {
    setDraft((current) => ({
      ...current,
      settings: {
        ...current.settings,
        social: { ...current.settings.social, [key]: value },
      },
    }));
  };

  const setFlag = (key: keyof FeatureFlags, value: boolean) => {
    setDraft((current) => ({
      ...current,
      flags: { ...current.flags, [key]: value },
    }));
  };

  const settings = draft.settings;

  return (
    <div>
      <PageHeader
        eyebrow="SETTINGS / الإعدادات"
        title="الإعدادات والهوية"
        description="بيانات التواصل، الروابط الاجتماعية، الشعار والصور، الكلمات المفتاحية، وتشغيل الأقسام المخفية."
      />

      <div className="space-y-4">
        <Card
          title="الهوية"
          description="الأسماء التي تظهر في SEO وبيانات المنظمة."
        >
          <div className="admin-field-row">
            <Field label="الاسم بالعربية">
              <input
                className="admin-input"
                value={settings.nameAr}
                onChange={(event) => setSettings({ nameAr: event.target.value })}
              />
            </Field>
            <Field label="الاسم بالإنجليزية">
              <input
                className="admin-input"
                dir="ltr"
                value={settings.nameEn}
                onChange={(event) => setSettings({ nameEn: event.target.value })}
              />
            </Field>
            <Field label="الاسم القانوني / الكامل">
              <input
                className="admin-input"
                dir="ltr"
                value={settings.legalName}
                onChange={(event) => setSettings({ legalName: event.target.value })}
              />
            </Field>
            <Field
              label="رابط الموقع"
              hint="مثال: https://artenergy.sa — يُستخدم في SEO وsitemap."
            >
              <input
                className="admin-input"
                dir="ltr"
                type="url"
                value={settings.url}
                onChange={(event) => setSettings({ url: event.target.value })}
              />
            </Field>
            <Field label="العنوان (عربي)">
              <input
                className="admin-input"
                value={settings.addressAr}
                onChange={(event) => setSettings({ addressAr: event.target.value })}
                placeholder="اختياري"
              />
            </Field>
            <Field label="العنوان (إنجليزي)">
              <input
                className="admin-input"
                dir="ltr"
                value={settings.addressEn}
                onChange={(event) => setSettings({ addressEn: event.target.value })}
                placeholder="Optional"
              />
            </Field>
          </div>
        </Card>

        <Card
          title="بيانات التواصل"
          description="تظهر في الهيدر، الفوتر، صفحة التواصل، وأزرار واتساب."
        >
          <div className="admin-field-row">
            <Field label="البريد الإلكتروني">
              <input
                className="admin-input"
                dir="ltr"
                type="email"
                value={settings.email}
                onChange={(event) => setSettings({ email: event.target.value })}
              />
            </Field>
            <Field label="رقم الهاتف (كما يظهر)">
              <input
                className="admin-input"
                dir="ltr"
                value={settings.phoneDisplay}
                onChange={(event) => setSettings({ phoneDisplay: event.target.value })}
              />
            </Field>
            <Field label="رابط الهاتف" hint="مثال: tel:+966557897425">
              <input
                className="admin-input"
                dir="ltr"
                value={settings.phoneHref}
                onChange={(event) => setSettings({ phoneHref: event.target.value })}
              />
            </Field>
            <Field
              label="رقم واتساب"
              hint="أرقام فقط مع رمز الدولة، بدون + أو مسافات. مثال: 966557897425"
            >
              <input
                className="admin-input"
                dir="ltr"
                value={settings.whatsapp}
                onChange={(event) => setSettings({ whatsapp: event.target.value })}
              />
            </Field>
            <Field label="رمز الدولة">
              <input
                className="admin-input max-w-[120px]"
                dir="ltr"
                value={settings.country}
                onChange={(event) => setSettings({ country: event.target.value })}
              />
            </Field>
          </div>
        </Card>

        <Card
          title="نطاق الحملة"
          description="السعران المستخدمان في قسم الحملات ومنشئ الباقات."
        >
          <div className="admin-field-row max-w-xl">
            <Field label="الحد الأدنى (ريال)">
              <input
                className="admin-input"
                dir="ltr"
                type="number"
                min={0}
                value={settings.campaignMin}
                onChange={(event) =>
                  setSettings({ campaignMin: Number(event.target.value) })
                }
              />
            </Field>
            <Field label="الحد الأعلى (ريال)">
              <input
                className="admin-input"
                dir="ltr"
                type="number"
                min={0}
                value={settings.campaignMax}
                onChange={(event) =>
                  setSettings({ campaignMax: Number(event.target.value) })
                }
              />
            </Field>
          </div>
        </Card>

        <Card title="الشعار والصور">
          <div className="grid gap-5 md:grid-cols-2">
            <ImageField
              label="الشعار"
              value={settings.logoUrl}
              onChange={(value) => setSettings({ logoUrl: value })}
              hint="اتركه فارغًا لاستخدام شعار ART ENERGY المرسوم. يُفضّل PNG بخلفية شفافة."
            />
            <ImageField
              label="صورة الهيرو"
              value={settings.heroImage}
              onChange={(value) => setSettings({ heroImage: value })}
              hint="تظهر داخل بطاقة الهيرو. الافتراضي: /images/wave-art.webp"
            />
            <ImageField
              label="صورة المشاركة (OG)"
              value={settings.ogImage}
              onChange={(value) => setSettings({ ogImage: value })}
              hint="تظهر عند مشاركة الموقع. المقاس المثالي 1200×630."
            />
            <ImageField
              label="الأيقونة (Favicon)"
              value={settings.favicon}
              onChange={(value) => setSettings({ favicon: value })}
              hint="يمكن استخدام SVG أو PNG. الافتراضي: /icon.svg"
            />
          </div>
        </Card>

        <Card
          title="روابط التواصل الاجتماعي"
          description="اترك الحقل فارغًا لإخفاء المنصة. لا تظهر أي روابط غير مضافة."
        >
          <div className="admin-field-row">
            {SOCIAL_FIELDS.map(([key, label]) => (
              <Field key={key} label={label}>
                <input
                  className="admin-input"
                  dir="ltr"
                  type="url"
                  value={settings.social[key]}
                  onChange={(event) => setSocial(key, event.target.value)}
                  placeholder="https://…"
                />
              </Field>
            ))}
          </div>
        </Card>

        <Card
          title="الكلمات المفتاحية (SEO)"
          description="كلمة أو عبارة في كل سطر."
        >
          <div className="admin-field-row">
            <Field label="عربي">
              <textarea
                className="admin-textarea"
                value={settings.keywordsAr.join("\n")}
                onChange={(event) =>
                  setSettings({
                    keywordsAr: event.target.value
                      .split("\n")
                      .map((item) => item.trim())
                      .filter(Boolean),
                  })
                }
              />
            </Field>
            <Field label="إنجليزي">
              <textarea
                className="admin-textarea"
                dir="ltr"
                value={settings.keywordsEn.join("\n")}
                onChange={(event) =>
                  setSettings({
                    keywordsEn: event.target.value
                      .split("\n")
                      .map((item) => item.trim())
                      .filter(Boolean),
                  })
                }
              />
            </Field>
          </div>
        </Card>

        <Card
          title="الأقسام المخفية"
          description="شغّل القسم بعد إضافة عناصره من صفحة «الأقسام المخفية»."
        >
          <div className="grid gap-3 sm:grid-cols-2">
            {(Object.keys(FLAG_COPY) as Array<keyof FeatureFlags>).map((key) => (
              <Toggle
                key={key}
                label={FLAG_COPY[key].label}
                description={FLAG_COPY[key].description}
                checked={draft.flags[key]}
                onChange={(value) => setFlag(key, value)}
              />
            ))}
          </div>
          <div className="mt-4">
            <Notice tone="info">
              الأقسام تظهر بين «لماذا نحن» و«تواصل معنا». إذا كان القسم مفعّلًا
              وبدون عناصر، يظهر مكان بديل أنيق بدلًا من مساحة فارغة.
            </Notice>
          </div>
        </Card>
      </div>

      <SaveBar
        dirty={dirty}
        saving={saving}
        message={message}
        onSave={save}
        onDiscard={discard}
      />
    </div>
  );
}
