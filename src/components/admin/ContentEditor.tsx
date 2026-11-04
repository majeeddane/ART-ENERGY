"use client";

import Link from "next/link";
import { useState } from "react";
import { AddButton, DeleteButton, PageHeader, SaveBar } from "@/components/admin/ui";
import { useSiteDraft } from "@/components/admin/useSiteDraft";
import { ArrowUpRight, ChevronDown, Globe, Sparkle } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { newId } from "@/lib/admin-client";
import type { Dict, SiteData } from "@content/site";
import type { Locale } from "@content/model";

type SectionKey = keyof Dict;
type JsonRecord = Record<string, unknown>;

const SECTION_LABELS: Record<SectionKey, string> = {
  meta: "SEO والميتا",
  nav: "قائمة التنقل",
  ui: "نصوص الواجهة",
  hero: "الهيرو",
  about: "من نحن",
  capabilities: "القدرات",
  services: "الخدمات",
  journey: "رحلة الفكرة",
  packages: "الباقات",
  production: "الإنتاج",
  campaigns: "الحملات",
  why: "لماذا نحن",
  contact: "التواصل",
  footer: "الفوتر",
  hidden: "الأقسام المخفية",
};

const SECTION_ORDER: SectionKey[] = [
  "hero",
  "about",
  "capabilities",
  "services",
  "journey",
  "packages",
  "production",
  "campaigns",
  "why",
  "contact",
  "footer",
  "nav",
  "ui",
  "meta",
  "hidden",
];

const FIELD_LABELS: Record<string, string> = {
  title: "العنوان",
  titleA: "العنوان — السطر الأول",
  titleB: "العنوان — السطر الثاني",
  titleC: "العنوان — السطر الثالث",
  subtitle: "العنوان الفرعي",
  body: "النص",
  text: "النص",
  label: "التسمية",
  kicker: "السطر العلوي",
  eyebrow: "السطر العلوي",
  ctaPrimary: "زر أساسي",
  ctaSecondary: "زر ثانوي",
  cta: "زر الإجراء",
  note: "ملاحظة",
  hint: "تلميح",
  hintMobile: "تلميح الجوال",
  description: "الوصف",
  number: "الرقم",
  name: "الاسم",
  nickname: "الاسم المختصر",
  price: "السعر",
  features: "المزايا",
  items: "العناصر",
  tagline: "الوصف المختصر",
  titleAr: "العنوان (عربي)",
  titleEn: "العنوان (إنجليزي)",
  nameAr: "الاسم (عربي)",
  nameEn: "الاسم (إنجليزي)",
  roleAr: "الدور (عربي)",
  roleEn: "الدور (إنجليزي)",
  bioAr: "نبذة (عربي)",
  bioEn: "نبذة (إنجليزي)",
  categoryAr: "التصنيف (عربي)",
  categoryEn: "التصنيف (إنجليزي)",
  descriptionAr: "الوصف (عربي)",
  descriptionEn: "الوصف (إنجليزي)",
  excerptAr: "المقتطف (عربي)",
  excerptEn: "المقتطف (إنجليزي)",
  bodyAr: "المحتوى (عربي)",
  bodyEn: "المحتوى (إنجليزي)",
  phoneLabel: "تسمية الهاتف",
  emailLabel: "تسمية البريد",
  form: "نموذج التواصل",
  successTitle: "عنوان النجاح",
  successBody: "نص النجاح",
  successWhatsApp: "زر واتساب بعد الإرسال",
  another: "إرسال طلب آخر",
  errorRequired: "رسالة الحقل المطلوب",
  errorEmail: "رسالة البريد غير الصحيح",
  errorPhone: "رسالة الجوال غير الصحيح",
  errorGeneric: "رسالة الخطأ العامة",
  fallbackNote: "نص البديل",
  privacy: "نص الخصوصية",
  quoteTitle: "عنوان الاختيارات",
  requiredMark: "علامة مطلوب",
  submit: "إرسال",
  sending: "جارٍ الإرسال",
  namePlaceholder: "Placeholder الاسم",
  phonePlaceholder: "Placeholder الجوال",
  emailPlaceholder: "Placeholder البريد",
  messagePlaceholder: "Placeholder الرسالة",
  phone: "الهاتف",
  email: "البريد",
  service: "الخدمة",
  message: "الرسالة",
  whatsappCta: "زر واتساب",
  emailCta: "زر البريد",
  vision: "الرؤية",
  mission: "الرسالة",
  visionLabel: "تسمية الرؤية",
  missionLabel: "تسمية الرسالة",
  flipHint: "تلميح قلب البطاقة",
  visualTop: "شارة أعلى الرسم",
  visualBottom: "شارة أسفل الرسم",
  specialties: "التخصصات",
  groups: "المجموعات",
  ringTop: "نص المدار العلوي",
  ringBottom: "نص المدار السفلي",
  stages: "المراحل",
  stagesLabel: "تسمية المراحل",
  counter: "عدّاد المرحلة",
  plans: "الباقات",
  period: "الفترة",
  tabReady: "تبويب الباقات",
  tabBuilder: "تبويب المنشئ",
  builder: "منشئ الباقات",
  step1: "الخطوة الأولى",
  step2: "الخطوة الثانية",
  step3: "الخطوة الثالثة",
  none: "بدون اختيار",
  campaignName: "اسم الحملة",
  campaignHint: "تلميح الحملة",
  total: "الإجمالي",
  disclaimer: "إخلاء المسؤولية",
  whatsapp: "واتساب",
  useForm: "استخدام النموذج",
  reset: "إفراغ",
  empty: "فارغ",
  monthly: "شهريًا",
  once: "مرة واحدة",
  rangeNote: "ملاحظة النطاق",
  selectedLabel: "تسمية الاختيارات",
  add: "إضافة",
  rangeLabel: "تسمية النطاق",
  steps: "الخطوات",
  itemsLabel: "تسمية العناصر",
  taglineLabel: "تسمية الوصف",
  navTitle: "عنوان التنقل",
  contactTitle: "عنوان التواصل",
  rights: "حقوق النشر",
  backTop: "العودة للأعلى",
  built: "الاسم",
  menu: "القائمة",
  close: "إغلاق",
  language: "اسم اللغة",
  languageLabel: "وصف تبديل اللغة",
  themeLight: "الوضع الفاتح",
  themeDark: "الوضع الداكن",
  soundOn: "تشغيل الصوت",
  soundOff: "كتم الصوت",
  skip: "تخطي",
  loading: "التحميل",
  scroll: "التمرير",
  discover: "اكتشف",
  play: "تشغيل",
  next: "التالي",
  previous: "السابق",
  from: "ابتداءً من",
  sar: "العملة",
  services: "الخدمات",
  selected: "مختار",
  remove: "إزالة",
  skipToContent: "تخطي إلى المحتوى",
  openMenu: "فتح القائمة",
  closeMenu: "إغلاق القائمة",
  required: "مطلوب",
  home: "الرئيسية",
  about: "من نحن",
  journey: "الرحلة",
  packages: "الباقات",
  production: "الإنتاج",
  campaigns: "الحملات",
  why: "لماذا نحن",
  contact: "التواصل",
  albumLabel: "ملصق الألبوم",
  albumSub: "وصف الألبوم",
  liveLabel: "شارة البث",
  marquee: "الشريط المتحرك",
  ogAlt: "وصف صورة المشاركة",
  visionText: "نص الرؤية",
};

function isRecord(value: unknown): value is JsonRecord {
  return (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value) &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

function labelFor(key: string) {
  return FIELD_LABELS[key] || key;
}

function blankLike(value: unknown): unknown {
  if (typeof value === "string") return "";
  if (typeof value === "number") return 0;
  if (typeof value === "boolean") return false;
  if (Array.isArray(value)) return [];
  if (isRecord(value)) {
    const out: JsonRecord = {};
    for (const [key, child] of Object.entries(value)) {
      out[key] = key === "id" ? newId() : blankLike(child);
    }
    return out;
  }
  return "";
}

function MoveButtons({
  index,
  length,
  onMove,
}: {
  index: number;
  length: number;
  onMove: (from: number, to: number) => void;
}) {
  return (
    <span className="flex items-center gap-1">
      <button
        type="button"
        disabled={index === 0}
        onClick={() => onMove(index, index - 1)}
        aria-label="تحريك لأعلى"
        className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#DED5C4] text-[#6A7D80] transition hover:border-[#139CAA] disabled:opacity-30"
      >
        ↑
      </button>
      <button
        type="button"
        disabled={index === length - 1}
        onClick={() => onMove(index, index + 1)}
        aria-label="تحريك لأسفل"
        className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#DED5C4] text-[#6A7D80] transition hover:border-[#139CAA] disabled:opacity-30"
      >
        ↓
      </button>
    </span>
  );
}

function ArrayEditor({
  value,
  onChange,
  depth,
  locale,
}: {
  value: unknown[];
  onChange: (value: unknown[]) => void;
  depth: number;
  locale: Locale;
}) {
  const move = (from: number, to: number) => {
    const next = [...value];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  const add = () => {
    const template = value.length > 0 ? blankLike(value[0]) : "";
    onChange([...value, template]);
  };

  return (
    <div className="space-y-3">
      {value.length === 0 && (
        <p className="rounded-xl border border-dashed border-[#DED5C4] bg-[#FCFAF5] px-3 py-4 text-center text-[11px] text-[#8A9797]">
          القائمة فارغة. أضف عنصرًا جديدًا.
        </p>
      )}
      {value.map((item, index) => {
        const isObject = isRecord(item);
        const title = isObject
          ? String(
              item.title ||
                item.name ||
                item.nickname ||
                item.number ||
                item.label ||
                `عنصر ${index + 1}`,
            )
          : String(item || `عنصر ${index + 1}`);

        if (!isObject) {
          return (
            <div key={index} className="flex items-center gap-2">
              <span className="w-5 shrink-0 text-center font-grotesk text-[9px] text-[#9AA5A5]">
                {String(index + 1).padStart(2, "0")}
              </span>
              <div className="flex-1">
                <ValueEditor
                  value={item}
                  onChange={(next) => {
                    const list = [...value];
                    list[index] = next;
                    onChange(list);
                  }}
                  depth={depth + 1}
                  locale={locale}
                  fieldKey=""
                />
              </div>
              <MoveButtons index={index} length={value.length} onMove={move} />
              <DeleteButton
                onClick={() => onChange(value.filter((_, i) => i !== index))}
              />
            </div>
          );
        }

        return (
          <details
            key={index}
            open={depth < 1}
            className="group rounded-xl border border-[#E7E0D3] bg-[#FCFAF5]"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3 py-2.5">
              <span className="flex min-w-0 items-center gap-2">
                <ChevronDown
                  size={14}
                  className="shrink-0 text-[#8A9797] transition group-open:rotate-180"
                />
                <span className="font-grotesk text-[9px] text-[#9AA5A5]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span className="truncate text-xs font-semibold text-[#14262B]">
                  {title}
                </span>
              </span>
              <span className="flex shrink-0 items-center gap-1.5">
                <MoveButtons index={index} length={value.length} onMove={move} />
                <DeleteButton
                  onClick={(event) => {
                    event.preventDefault();
                    onChange(value.filter((_, i) => i !== index));
                  }}
                />
              </span>
            </summary>
            <div className="border-t border-[#E7E0D3] p-3.5">
              <ValueEditor
                value={item}
                onChange={(next) => {
                  const list = [...value];
                  list[index] = next;
                  onChange(list);
                }}
                depth={depth + 1}
                locale={locale}
                fieldKey=""
              />
            </div>
          </details>
        );
      })}
      <AddButton label="إضافة عنصر" onClick={add} />
    </div>
  );
}

function ObjectEditor({
  value,
  onChange,
  depth,
  locale,
}: {
  value: JsonRecord;
  onChange: (value: JsonRecord) => void;
  depth: number;
  locale: Locale;
}) {
  return (
    <div className={cn("space-y-3", depth > 1 && "border-s border-[#E7E0D3] ps-3")}>
      {Object.entries(value).map(([key, child]) => {
        const complex = Array.isArray(child) || isRecord(child);
        const update = (next: unknown) => onChange({ ...value, [key]: next });

        if (complex) {
          return (
            <details
              key={key}
              open={depth < 1}
              className="group rounded-xl border border-[#E7E0D3] bg-white"
            >
              <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-3.5 py-2.5">
                <span className="flex items-center gap-2 text-xs font-semibold text-[#14262B]">
                  <ChevronDown
                    size={13}
                    className="text-[#8A9797] transition group-open:rotate-180"
                  />
                  {labelFor(key)}
                  <span className="font-grotesk text-[9px] font-normal text-[#9AA5A5]">
                    {Array.isArray(child) ? child.length : ""}
                  </span>
                </span>
                <span className="font-grotesk text-[8px] tracking-[0.12em] text-[#B3ABA0]" dir="ltr">
                  {key}
                </span>
              </summary>
              <div className="border-t border-[#E7E0D3] bg-[#FCFAF5] p-3.5">
                <ValueEditor
                  value={child}
                  onChange={update}
                  depth={depth + 1}
                  locale={locale}
                  fieldKey={key}
                />
              </div>
            </details>
          );
        }

        const long =
          typeof child === "string" &&
          (child.length > 80 ||
            /body|text|description|vision|mission|message|disclaimer|note|hint|subtitle/i.test(
              key,
            ));

        return (
          <div key={key} className="grid gap-1.5 sm:grid-cols-[150px_1fr] sm:items-start sm:gap-3">
            <label className="flex items-center gap-1.5 pt-2 text-[10px] font-semibold text-[#456067]">
              <span className="truncate">{labelFor(key)}</span>
              <span className="font-grotesk text-[8px] font-normal text-[#B3ABA0]" dir="ltr">
                {key}
              </span>
            </label>
            <ValueEditor
              value={child}
              onChange={update}
              depth={depth + 1}
              locale={locale}
              fieldKey={key}
              long={long}
            />
          </div>
        );
      })}
    </div>
  );
}

function ValueEditor({
  value,
  onChange,
  depth,
  locale,
  fieldKey = "",
  long = false,
}: {
  value: unknown;
  onChange: (value: unknown) => void;
  depth: number;
  locale: Locale;
  fieldKey?: string;
  long?: boolean;
}) {
  if (typeof value === "string") {
    if (long) {
      return (
        <textarea
          className="admin-textarea"
          dir={locale === "en" ? "ltr" : undefined}
          value={value}
          onChange={(event) => onChange(event.target.value)}
        />
      );
    }
    return (
      <input
        className="admin-input"
        dir={locale === "en" ? "ltr" : undefined}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    );
  }

  if (typeof value === "number") {
    return (
      <input
        type="number"
        className="admin-input max-w-[220px]"
        dir="ltr"
        value={Number.isFinite(value) ? value : 0}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    );
  }

  if (typeof value === "boolean") {
    return (
      <label className="inline-flex items-center gap-2 text-xs text-[#456067]">
        <input
          type="checkbox"
          checked={value}
          onChange={(event) => onChange(event.target.checked)}
          className="h-4 w-4 accent-[#139CAA]"
        />
        {value ? "مفعّل" : "متوقف"}
      </label>
    );
  }

  if (Array.isArray(value)) {
    return (
      <ArrayEditor
        value={value}
        onChange={onChange}
        depth={depth}
        locale={locale}
      />
    );
  }

  if (isRecord(value)) {
    return (
      <ObjectEditor
        value={value}
        onChange={onChange}
        depth={depth}
        locale={locale}
      />
    );
  }

  return (
    <input
      className="admin-input"
      value={String(value ?? "")}
      onChange={(event) => onChange(event.target.value)}
      aria-label={fieldKey}
    />
  );
}

function copyStrings(from: unknown, to: unknown): unknown {
  if (typeof from === "string") return from;
  if (Array.isArray(from)) {
    return from.map((item, index) =>
      Array.isArray(to) ? copyStrings(item, to[index]) : copyStrings(item, undefined),
    );
  }
  if (isRecord(from) && isRecord(to)) {
    const out: JsonRecord = { ...to };
    for (const [key, child] of Object.entries(from)) {
      out[key] = copyStrings(child, to[key]);
    }
    return out;
  }
  return to;
}

export function ContentEditor({ initialData }: { initialData: SiteData }) {
  const { draft, setDraft, dirty, saving, message, save, discard } =
    useSiteDraft(initialData);
  const [locale, setLocale] = useState<Locale>("ar");
  const [section, setSection] = useState<SectionKey>("hero");

  const dict = draft.content[locale];
  const sectionValue = dict[section] as unknown;

  const updateSection = (next: unknown) => {
    setDraft((current) => ({
      ...current,
      content: {
        ...current.content,
        [locale]: {
          ...current.content[locale],
          [section]: next,
        },
      },
    }));
  };

  const copyFromOther = () => {
    const other: Locale = locale === "ar" ? "en" : "ar";
    const source = draft.content[other][section] as unknown;
    const confirmed = window.confirm(
      locale === "ar"
        ? "سيتم نسخ نصوص هذا القسم من الإنجليزية فوق العربية. هل تريد المتابعة؟"
        : "This will copy the Arabic texts over the English section. Continue?",
    );
    if (!confirmed) return;
    updateSection(copyStrings(source, sectionValue));
  };

  return (
    <div>
      <PageHeader
        eyebrow="CONTENT / المحتوى"
        title="محتوى الموقع"
        description="عدّل كل نصوص الموقع بالعربية والإنجليزية. التغييرات تظهر بعد الضغط على «حفظ التغييرات»."
      >
        <Link
          href="/"
          target="_blank"
          className="admin-btn admin-btn-ghost min-h-9 px-3 text-[10px]"
        >
          <Globe size={13} />
          عربي
          <ArrowUpRight size={11} />
        </Link>
        <Link
          href="/en"
          target="_blank"
          className="admin-btn admin-btn-ghost min-h-9 px-3 text-[10px]"
        >
          <Globe size={13} />
          English
          <ArrowUpRight size={11} />
        </Link>
      </PageHeader>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex rounded-full border border-[#DED5C4] bg-white p-1">
          <button
            type="button"
            onClick={() => setLocale("ar")}
            className={cn("admin-tab", locale === "ar" && "admin-tab-active")}
          >
            العربية
          </button>
          <button
            type="button"
            onClick={() => setLocale("en")}
            className={cn("admin-tab", locale === "en" && "admin-tab-active")}
          >
            English
          </button>
        </div>
        <button
          type="button"
          onClick={copyFromOther}
          className="admin-btn admin-btn-ghost min-h-8 px-3 text-[10px]"
        >
          <Sparkle size={12} />
          نسخ نصوص {locale === "ar" ? "الإنجليزية" : "العربية"} إلى هذا القسم
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[210px_1fr]">
        <aside className="admin-card admin-scroll h-fit overflow-x-auto p-2 lg:sticky lg:top-5">
          <div className="flex gap-1 lg:flex-col">
            {SECTION_ORDER.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setSection(key)}
                className={cn(
                  "flex shrink-0 items-center justify-between gap-2 rounded-lg px-3 py-2.5 text-start text-[11px] font-medium transition lg:w-full",
                  section === key
                    ? "bg-[#0B2730] text-[#F2E04E]"
                    : "text-[#5D7478] hover:bg-[#F4F0E7] hover:text-[#0B2730]",
                )}
              >
                {SECTION_LABELS[key]}
                <span
                  className={cn(
                    "font-grotesk text-[8px]",
                    section === key ? "text-[#F2E04E]/60" : "text-[#B3ABA0]",
                  )}
                  dir="ltr"
                >
                  {key}
                </span>
              </button>
            ))}
          </div>
        </aside>

        <div className="admin-card min-w-0 p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3 border-b border-[#E7E0D3] pb-3">
            <div>
              <h2 className="admin-section-title">{SECTION_LABELS[section]}</h2>
              <p className="mt-1 font-grotesk text-[9px] tracking-[0.12em] text-[#9AA5A5]" dir="ltr">
                {locale}.{section}
              </p>
            </div>
            <span className="admin-chip">
              {locale === "ar" ? "RTL" : "LTR"}
            </span>
          </div>

          <ValueEditor
            value={sectionValue}
            onChange={updateSection}
            depth={0}
            locale={locale}
          />
        </div>
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
