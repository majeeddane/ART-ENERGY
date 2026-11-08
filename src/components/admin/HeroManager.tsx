"use client";

import { useState } from "react";
import { AddButton, Card, DeleteButton, ImageField, Notice, PageHeader, SaveBar, Toggle } from "@/components/admin/ui";
import { useSiteDraft } from "@/components/admin/useSiteDraft";
import { ChevronDown } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import type { SiteData } from "@content/site";
import type { Locale } from "@content/model";

const HERO_LABELS: Record<Locale, Record<string, string>> = {
  ar: {
    title: "إدارة الصفحة الرئيسية",
    description: "عدّل عنوان الصفحة الرئيسية، الوصف، الصور، الأزرار، والتحكم في ظهور الأقسام. التغييرات تظهر على الموقع مباشرة بعد الحفظ.",
    eyebrow: "الشريط العلوي",
    titleA: "العنوان — السطر الأول",
    titleB: "العنوان — السطر الثاني",
    titleC: "العنوان — السطر الثالث",
    subtitle: "العنوان الفرعي",
    body: "النص الرئيسي",
    ctaPrimary: "نص الزر الأساسي",
    ctaSecondary: "نص الزر الثانوي",
    albumLabel: "عنوان بطاقة الشعار",
    albumSub: "وصف بطاقة الشعار",
    liveLabel: "شارة البث المباشر",
    marquee: "الشريط المتحرك",
    heroImage: "صورة الصفحة الرئيسية",
    showMarquee: "إظهار الشريط المتحرك",
    showAbout: "إظهار قسم «من نحن»",
    showCapabilities: "إظهار قسم «قدراتنا»",
    showServices: "إظهار قسم «ماذا نقدم؟»",
    showJourney: "إظهار قسم «رحلة الفكرة»",
    showPackages: "إظهار قسم «الباقات»",
    showProduction: "إظهار قسم «الإنتاج»",
    showCampaigns: "إظهار قسم «الحملات»",
    showWhy: "إظهار قسم «لماذا نحن»",
    showContact: "إظهار قسم «تواصل معنا»",
    addMarqueeItem: "إضافة عنصر للشريط",
    deleteMarqueeItem: "حذف هذا العنصر",
    moveMarqueeUp: "تحريك لأعلى",
    moveMarqueeDown: "تحريك لأسفل",
    noItems: "لا توجد عناصر بعد.",
    imageHint: "يُفضّل صورة أفقية عريضة بجودة عالية (مثل 1920×1080) لأنها تملأ الشاشة كخلفية.",
  },
  en: {
    title: "Home Page Management",
    description: "Edit hero title, description, images, buttons, and section visibility. Changes appear on the website after saving.",
    eyebrow: "Eyebrow",
    titleA: "Title — Line 1",
    titleB: "Title — Line 2",
    titleC: "Title — Line 3",
    subtitle: "Subtitle",
    body: "Main Body",
    ctaPrimary: "Primary Button Text",
    ctaSecondary: "Secondary Button Text",
    albumLabel: "Album Card Title",
    albumSub: "Album Card Subtitle",
    liveLabel: "Live Label",
    marquee: "Marquee",
    heroImage: "Hero Image",
    showMarquee: "Show Marquee",
    showAbout: "Show «About Us»",
    showCapabilities: "Show «Capabilities»",
    showServices: "Show «What We Do»",
    showJourney: "Show «Journey»",
    showPackages: "Show «Packages»",
    showProduction: "Show «Production»",
    showCampaigns: "Show «Campaigns»",
    showWhy: "Show «Why Us»",
    showContact: "Show «Contact Us»",
    addMarqueeItem: "Add Marquee Item",
    deleteMarqueeItem: "Delete this item",
    moveMarqueeUp: "Move up",
    moveMarqueeDown: "Move down",
    noItems: "No items yet.",
    imageHint: "Wide high-quality image (e.g. 1920×1080) is preferred as it fills the screen as background.",
  },
};

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="admin-label">{label}</span>
      {children}
    </label>
  );
}

function MarqueeItemShell({
  index,
  onMove,
  canMoveUp,
  canMoveDown,
  onDelete,
  children,
}: {
  index: number;
  onMove: (direction: -1 | 1) => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onDelete: () => void;
  children: React.ReactNode;
}) {
  return (
    <details
      open
      className="admin-shell-item group"
    >
      <summary className="admin-shell-summary">
        <span className="flex min-w-0 items-center gap-2">
          <ChevronDown
            size={14}
            className="shrink-0 text-[#8A9797] transition group-open:rotate-180"
          />
          <span className="font-grotesk text-[9px] text-[#9AA5A5]">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="truncate text-xs font-semibold text-[#14262B]">
            عنصر الشريط المتحرك
          </span>
        </span>
        <span className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            disabled={!canMoveUp}
            onClick={(event) => {
              event.preventDefault();
              onMove(-1);
            }}
            aria-label="تحريك لأعلى"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#DED5C4] text-[#6A7D80] disabled:opacity-30 transition-all"
          >
            ↑
          </button>
          <button
            type="button"
            disabled={!canMoveDown}
            onClick={(event) => {
              event.preventDefault();
              onMove(1);
            }}
            aria-label="تحريك لأسفل"
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#DED5C4] text-[#6A7D80] disabled:opacity-30 transition-all"
          >
            ↓
          </button>
          <DeleteButton onClick={(event) => { event.preventDefault(); onDelete(); }} />
        </span>
      </summary>
      <div className="border-t border-[#E7E0D3] bg-white p-3.5">
        <div className="grid gap-3 sm:grid-cols-2">{children}</div>
      </div>
    </details>
  );
}

export function HeroManager({ initialData }: { initialData: SiteData }) {
  const { draft, setDraft, dirty, saving, message, save, discard } =
    useSiteDraft(initialData);
  const [locale, setLocale] = useState<Locale>("ar");
  const L = HERO_LABELS[locale];

  const dict = draft.content[locale];
  const hero = dict.hero as {
    eyebrow: string;
    titleA: string;
    titleB: string;
    titleC: string;
    subtitle: string;
    body: string;
    ctaPrimary: string;
    ctaSecondary: string;
    albumLabel: string;
    albumSub: string;
    liveLabel: string;
    marquee: string[];
  };

  const settings = draft.settings;

  const updateHero = (patch: Partial<typeof hero>) =>
    setDraft((current) => {
      const next = {
        ...current.content[locale],
        hero: { ...current.content[locale].hero, ...patch },
      };
      return {
        ...current,
        content: {
          ...current.content,
          [locale]: next,
        },
      };
    });

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

  const moveMarquee = (index: number, direction: -1 | 1) => {
    setDraft((current) => {
      const next = { ...current.content[locale], hero: { ...current.content[locale].hero } };
      const items = [...next.hero.marquee];
      const target = index + direction;
      if (target < 0 || target >= items.length) return current;
      [items[index], items[target]] = [items[target], items[index]];
      next.hero.marquee = items;
      return {
        ...current,
        content: {
          ...current.content,
          [locale]: next,
        },
      };
    });
  };

  const deleteMarquee = (index: number) => {
    setDraft((current) => {
      const next = { ...current.content[locale], hero: { ...current.content[locale].hero } };
      const items = [...next.hero.marquee];
      items.splice(index, 1);
      next.hero.marquee = items;
      return {
        ...current,
        content: {
          ...current.content,
          [locale]: next,
        },
      };
    });
  };

  const addMarquee = () => {
    setDraft((current) => {
      const next = { ...current.content[locale], hero: { ...current.content[locale].hero } };
      next.hero.marquee = [...next.hero.marquee, "عنصر جديد"];
      return {
        ...current,
        content: {
          ...current.content,
          [locale]: next,
        },
      };
    });
  };

  return (
    <div>
      <PageHeader
        eyebrow="HERO / الصفحة الرئيسية"
        title={L.title}
        description={L.description}
      />

      <div className="admin-tabs mb-4">
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
        {/* النصوص والعنوان */}
        <Card title="النصوص والعنوان">
          <div className="admin-field-row">
            <Field label={L.eyebrow}>
              <input
                className="admin-input"
                dir="ltr"
                value={hero.eyebrow}
                onChange={(event) => updateHero({ eyebrow: event.target.value })}
              />
            </Field>
            <Field label={L.titleA}>
              <input
                className="admin-input"
                value={hero.titleA}
                onChange={(event) => updateHero({ titleA: event.target.value })}
              />
            </Field>
            <Field label={L.titleB}>
              <input
                className="admin-input"
                value={hero.titleB}
                onChange={(event) => updateHero({ titleB: event.target.value })}
              />
            </Field>
            <Field label={L.titleC}>
              <input
                className="admin-input"
                value={hero.titleC}
                onChange={(event) => updateHero({ titleC: event.target.value })}
              />
            </Field>
            <Field label={L.subtitle}>
              <input
                className="admin-input"
                value={hero.subtitle}
                onChange={(event) => updateHero({ subtitle: event.target.value })}
              />
            </Field>
            <Field label={L.body} className="sm:col-span-2">
              <textarea
                className="admin-textarea"
                value={hero.body}
                onChange={(event) => updateHero({ body: event.target.value })}
              />
            </Field>
          </div>
        </Card>

        {/* الأزرار */}
        <Card title="الأزرار">
          <div className="admin-field-row">
            <Field label={L.ctaPrimary}>
              <input
                className="admin-input"
                value={hero.ctaPrimary}
                onChange={(event) => updateHero({ ctaPrimary: event.target.value })}
              />
            </Field>
            <Field label={L.ctaSecondary}>
              <input
                className="admin-input"
                value={hero.ctaSecondary}
                onChange={(event) => updateHero({ ctaSecondary: event.target.value })}
              />
            </Field>
          </div>
        </Card>

        {/* بطاقة الشعار */}
        <Card title="بطاقة الشعار (Album)">
          <div className="admin-field-row">
            <Field label={L.albumLabel}>
              <input
                className="admin-input"
                dir="ltr"
                value={hero.albumLabel}
                onChange={(event) => updateHero({ albumLabel: event.target.value })}
              />
            </Field>
            <Field label={L.albumSub}>
              <input
                className="admin-input"
                dir="ltr"
                value={hero.albumSub}
                onChange={(event) => updateHero({ albumSub: event.target.value })}
              />
            </Field>
            <Field label={L.liveLabel}>
              <input
                className="admin-input"
                dir="ltr"
                value={hero.liveLabel}
                onChange={(event) => updateHero({ liveLabel: event.target.value })}
              />
            </Field>
          </div>
        </Card>

        {/* صورة الهيرو */}
        <Card title={L.heroImage}>
          <div className="max-w-xl">
            <ImageField
              label="صورة الصفحة الرئيسية"
              value={settings.heroImage}
              onChange={(value) => updateSetting("heroImage", value)}
              hint={L.imageHint}
            />
          </div>
        </Card>

        {/* الشريط المتحرك */}
        <Card title={L.marquee}>
          <div className="space-y-4">
            {hero.marquee.map((item, index) => (
              <MarqueeItemShell
                key={index}
                index={index}
                onMove={(direction) => moveMarquee(index, direction)}
                canMoveUp={index > 0}
                canMoveDown={index < hero.marquee.length - 1}
                onDelete={() => deleteMarquee(index)}
              >
                <Field label={`عنصر ${index + 1}`}>
                  <input
                    className="admin-input"
                    value={item}
                    onChange={(event) => {
                      const items = [...hero.marquee];
                      items[index] = event.target.value;
                      updateHero({ marquee: items });
                    }}
                  />
                </Field>
              </MarqueeItemShell>
            ))}
            {hero.marquee.length === 0 && (
              <p className="text-xs text-[#8A9797]">{L.noItems}</p>
            )}
            <AddButton label={L.addMarqueeItem} onClick={addMarquee} className="mt-2" />
          </div>
        </Card>

        {/* إظهار/إخفاء الأقسام */}
        <Card title="إظهار وإخفاء الأقسام">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { key: "marquee", label: L.showMarquee, flag: "work" },
              { key: "about", label: L.showAbout, flag: "work" },
              { key: "capabilities", label: L.showCapabilities, flag: "work" },
              { key: "services", label: L.showServices, flag: "work" },
              { key: "journey", label: L.showJourney, flag: "work" },
              { key: "packages", label: L.showPackages, flag: "work" },
              { key: "production", label: L.showProduction, flag: "work" },
              { key: "campaigns", label: L.showCampaigns, flag: "work" },
              { key: "why", label: L.showWhy, flag: "work" },
              { key: "contact", label: L.showContact, flag: "work" },
            ].map((section) => (
              <Toggle
                key={section.key}
                label={section.label}
                checked={draft.flags[section.flag as keyof typeof draft.flags] ?? false}
                onChange={(value) => updateFlag(section.flag as keyof typeof draft.flags, value)}
              />
            ))}
          </div>
          <Notice tone="info">
            يتحكم هذا في ظهور الأقسام في الصفحة الرئيسية. الأقسام المخفية لا تُزال بياناتها، بل تُخفي فقط من العرض.
          </Notice>
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
