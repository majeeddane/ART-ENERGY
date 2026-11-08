"use client";

import { useState } from "react";
import { Card, ImageField, Notice, PageHeader, SaveBar, Toggle } from "@/components/admin/ui";
import { useSiteDraft } from "@/components/admin/useSiteDraft";
import { cn } from "@/lib/utils";
import type { SiteData } from "@content/site";
import type { Locale } from "@content/model";

const APPEARANCE_LABELS: Record<Locale, Record<string, string>> = {
  ar: {
    title: "إدارة المظهر والتصميم",
    description: "عدّل الشعار، الأيقونة، الصور، والألوان القابلة للتخصيص. التغييرات تظهر على الموقع مباشرة بعد الحفظ.",
    logo: "الشعار",
    logoHint: "اتركه فارغًا لاستخدام شعار ART ENERGY المرسوم. يُفضّل PNG بخلفية شفافة.",
    favicon: "الأيقونة (Favicon)",
    faviconHint: "يمكن استخدام SVG أو PNG. تُعرض في تبويب المتصفح.",
    heroImage: "صورة الصفحة الرئيسية",
    heroImageHint: "صورة أفقية عريضة بجودة عالية تملأ الشاشة كخلفية.",
    ogImage: "صورة المشاركة (OG)",
    ogImageHint: "تظهر عند مشاركة الموقع على وسائل التواصل. المقاس المثالي 1200×630.",
    siteUrl: "رابط الموقع",
    siteUrlHint: "مثال: https://artenergy.sa — يُستخدم في SEO وsitemap.",
    colors: "الألوان القابلة للتخصيص",
    primaryColor: "اللون الأساسي",
    accentColor: "لون التمييز",
    sections: "إظهار وإخفاء الأقسام",
    sectionHint: "يتحكم هذا في ظهور الأقسام في الصفحة الرئيسية.",
  },
  en: {
    title: "Appearance & Design Management",
    description: "Edit logo, icon, images, and customizable colors. Changes appear on the website after saving.",
    logo: "Logo",
    logoHint: "Leave empty to use the drawn ART ENERGY logo. PNG with transparent background preferred.",
    favicon: "Favicon",
    faviconHint: "SVG or PNG accepted. Displayed in browser tab.",
    heroImage: "Hero Image",
    heroImageHint: "Wide high-quality image that fills the screen as background.",
    ogImage: "OG Image",
    ogImageHint: "Shown when sharing the website on social media. Ideal size: 1200×630.",
    siteUrl: "Site URL",
    siteUrlHint: "Example: https://artenergy.sa — used for SEO and sitemap.",
    colors: "Customizable Colors",
    primaryColor: "Primary Color",
    accentColor: "Accent Color",
    sections: "Show/Hide Sections",
    sectionHint: "Controls section visibility on the homepage.",
  },
};

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="admin-label">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-[10px] leading-5 text-[#8A9797]">{hint}</span>}
    </label>
  );
}

const COLOR_PRESETS = [
  { name: "ART ENERGY Default", primary: "#139CAA", accent: "#F2E04E" },
  { name: "Deep Teal", primary: "#0E6D79", accent: "#D1A246" },
  { name: "Warm Gold", primary: "#D1A246", accent: "#F7A24E" },
  { name: "Ocean Blue", primary: "#3DC1C5", accent: "#139CAA" },
];

export function AppearanceManager({ initialData }: { initialData: SiteData }) {
  const { draft, setDraft, dirty, saving, message, save, discard } =
    useSiteDraft(initialData);
  const [locale, setLocale] = useState<Locale>("ar");
  const L = APPEARANCE_LABELS[locale];

  const settings = draft.settings;

  const updateSetting = (key: string, value: string) =>
    setDraft((current) => {
      const next = {
        ...current,
        settings: { ...current.settings, [key]: value },
      };
      return next;
    });

  const updateFlag = (key: string, value: boolean) =>
    setDraft((current) => {
      const next = {
        ...current,
        flags: { ...current.flags, [key]: value },
      };
      return next;
    });

  const flagMap: Record<string, string> = {
    work: "work",
    clients: "clients",
    team: "team",
    journal: "journal",
  };

  return (
    <div>
      <PageHeader
        eyebrow="APPEARANCE / المظهر والتصميم"
        title={L.title}
        description={L.description}
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setLocale("ar")}
          className={cn("admin-tab", locale === "ar" && "admin-tab-active")}
        >
          عربية
        </button>
        <button
          type="button"
          onClick={() => setLocale("en")}
          className={cn("admin-tab", locale === "en" && "admin-tab-active")}
        >
          English
        </button>
      </div>

      <div className="space-y-6">
        {/* الشعار والأيقونة */}
        <Card title="الشعار والأيقونة">
          <div className="admin-field-row">
            <Field label={L.logo} hint={L.logoHint}>
              <ImageField
                label="الشعار"
                value={settings.logoUrl}
                onChange={(value) => updateSetting("logoUrl", value)}
                hint="اتركه فارغًا لاستخدام شعار ART ENERGY المرسوم."
              />
            </Field>
            <Field label={L.favicon} hint={L.faviconHint}>
              <ImageField
                label="الأيقونة (Favicon)"
                value={settings.favicon}
                onChange={(value) => updateSetting("favicon", value)}
              />
            </Field>
          </div>
        </Card>

        {/* الصور */}
        <Card title="الصور والبنرات">
          <div className="admin-field-row">
            <Field label={L.heroImage} hint={L.heroImageHint}>
              <ImageField
                label="صورة الصفحة الرئيسية"
                value={settings.heroImage}
                onChange={(value) => updateSetting("heroImage", value)}
                hint="يُفضّل صورة أفقية عريضة بجودة عالية (مثل 1920×1080)."
              />
            </Field>
            <Field label={L.ogImage} hint={L.ogImageHint}>
              <ImageField
                label="صورة المشاركة (OG)"
                value={settings.ogImage}
                onChange={(value) => updateSetting("ogImage", value)}
                hint="المقاس المثالي 1200×630."
              />
            </Field>
          </div>
        </Card>

        {/* رابط الموقع */}
        <Card title="رابط الموقع">
          <div className="admin-field-row">
            <Field label={L.siteUrl} hint={L.siteUrlHint}>
              <input
                className="admin-input"
                dir="ltr"
                type="url"
                value={settings.url}
                onChange={(event) => updateSetting("url", event.target.value)}
              />
            </Field>
          </div>
        </Card>

        {/* الألوان */}
        <Card title={L.colors}>
          <div className="admin-field-row">
            <Field label={L.primaryColor}>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value="#139CAA"
                  onChange={(event) => updateSetting("primaryColor", event.target.value)}
                  className="w-10 h-8 cursor-pointer border-none bg-transparent"
                />
                <span className="text-xs text-[#6A7D80]">#139CAA (تيل أساسي)</span>
              </div>
            </Field>
            <Field label={L.accentColor}>
              <div className="flex items-center gap-3">
                <input
                  type="color"
                  value="#F2E04E"
                  onChange={(event) => updateSetting("accentColor", event.target.value)}
                  className="w-10 h-8 cursor-pointer border-none bg-transparent"
                />
                <span className="text-xs text-[#6A7D80]">#F2E04E (أصفر تمييز)</span>
              </div>
            </Field>
          </div>
          <div className="mt-4 grid gap-2 sm:grid-cols-4">
            {COLOR_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => {
                  updateSetting("primaryColor", preset.primary);
                  updateSetting("accentColor", preset.accent);
                }}
                className="flex h-10 w-10 flex-col items-center justify-center rounded-lg border border-line bg-white transition hover:border-[#139CAA]"
              >
                <div
                  className="h-6 w-6 rounded-full border border-white"
                  style={{
                    background: `linear-gradient(135deg, ${preset.primary}, ${preset.accent})`,
                  }}
                />
                <span className="text-[9px] text-[#6A7D80]">{preset.name}</span>
              </button>
            ))}
          </div>
          <Notice tone="info">
            الألوان القابلة للتخصيص تُستخدم في العناصر التفاعلية والبطاقات عبر الموقع.
          </Notice>
        </Card>

        {/* إظهار/إخفاء الأقسام */}
        <Card title={L.sections}>
          <p className="text-[10px] text-[#6A7D80]">{L.sectionHint}</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {(Object.keys(flagMap) as Array<keyof typeof flagMap>).map((key) => (
              <Toggle
                key={key}
                label={
                  key === "work"
                    ? "قسم الأعمال"
                    : key === "clients"
                      ? "قسم العملاء"
                      : key === "team"
                        ? "قسم الفريق"
                        : "قسم المدونة"
                }
                checked={draft.flags[key as keyof typeof draft.flags]}
                onChange={(value) => updateFlag(key as keyof typeof draft.flags, value)}
              />
            ))}
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
