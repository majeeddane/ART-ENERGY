"use client";

import { useState } from "react";
import { AddButton, Card, DeleteButton, PageHeader, SaveBar } from "@/components/admin/ui";
import { useSiteDraft } from "@/components/admin/useSiteDraft";
import { ChevronDown } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import type { SiteData } from "@content/site";
import type { Locale } from "@content/model";

const ABOUT_LABELS: Record<Locale, Record<string, string>> = {
  ar: {
    pageTitle: "إدارة من نحن والهوية",
    description: "عدّل نبذة الشركة، الرؤية، الرسالة، القيم، والتخصصات. التغييرات تظهر في قسم «من نحن» في الموقع مباشرة بعد الحفظ.",
    label: "تسمية القسم",
    kicker: "الشعار العلوي (Kicker)",
    title: "العنوان الرئيسي",
    body: "النص التعريفي",
    visualTop: "شارة أعلى الرسم",
    visualBottom: "شارة أسفل الرسم",
    visionLabel: "تسمية الرؤية",
    vision: "نص الرؤية",
    missionLabel: "تسمية الرسالة",
    mission: "نص الرسالة",
    flipHint: "تلميح قلب البطاقة",
    specialties: "التخصصات",
    addSpecialty: "إضافة تخصص",
    deleteSpecialty: "حذف هذا التخصص",
    noSpecialties: "لا توجد تخصصات بعد.",
  },
  en: {
    pageTitle: "About Us & Identity Management",
    description: "Edit company about text, vision, mission, values, and specialties. Changes appear in the «About Us» section on the website after saving.",
    label: "Section Label",
    kicker: "Top Label (Kicker)",
    title: "Main Title",
    body: "Descriptive Text",
    visualTop: "Top Visual Label",
    visualBottom: "Bottom Visual Label",
    visionLabel: "Vision Label",
    vision: "Vision Text",
    missionLabel: "Mission Label",
    mission: "Mission Text",
    flipHint: "Card Flip Hint",
    specialties: "Specialties",
    addSpecialty: "Add Specialty",
    deleteSpecialty: "Delete this specialty",
    noSpecialties: "No specialties yet.",
  },
};

interface AboutData {
  label: string;
  kicker: string;
  title: string;
  body: string;
  specialties: string[];
  visualTop: string;
  visualBottom: string;
  visionLabel: string;
  vision: string;
  missionLabel: string;
  mission: string;
  flipHint: string;
}

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

function SpecialtyShell({
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
            تخصص
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
        {children}
      </div>
    </details>
  );
}

export function AboutManager({ initialData }: { initialData: SiteData }) {
  const { draft, setDraft, dirty, saving, message, save, discard } =
    useSiteDraft(initialData);
  const [locale, setLocale] = useState<Locale>("ar");
  const L = ABOUT_LABELS[locale];

  const dict = draft.content[locale];
  const about = dict.about as AboutData;

  const updateField = (key: keyof AboutData, value: string | string[]) =>
    setDraft((current) => {
      const next = {
        ...current.content[locale],
        about: { ...current.content[locale].about, [key]: value },
      };
      return {
        ...current,
        content: {
          ...current.content,
          [locale]: next,
        },
      };
    });

  const moveSpecialty = (index: number, direction: -1 | 1) => {
    setDraft((current) => {
      const next = { ...current.content[locale], about: { ...current.content[locale].about } };
      const items = [...next.about.specialties];
      const target = index + direction;
      if (target < 0 || target >= items.length) return current;
      [items[index], items[target]] = [items[target], items[index]];
      next.about.specialties = items;
      return {
        ...current,
        content: {
          ...current.content,
          [locale]: next,
        },
      };
    });
  };

  const deleteSpecialty = (index: number) => {
    setDraft((current) => {
      const next = { ...current.content[locale], about: { ...current.content[locale].about } };
      const items = [...next.about.specialties];
      items.splice(index, 1);
      next.about.specialties = items;
      return {
        ...current,
        content: {
          ...current.content,
          [locale]: next,
        },
      };
    });
  };

  const addSpecialty = () => {
    setDraft((current) => {
      const next = { ...current.content[locale], about: { ...current.content[locale].about } };
      next.about.specialties = [...next.about.specialties, "تخصص جديد"];
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
        eyebrow="ABOUT / من نحن والهوية"
        title={L.pageTitle}
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
        {/* الهوية الأساسية */}
        <Card title="الهوية الأساسية">
          <div className="admin-field-row">
            <Field label={L.label}>
              <input
                className="admin-input"
                value={about.label}
                onChange={(event) => updateField("label", event.target.value)}
              />
            </Field>
            <Field label={L.kicker}>
              <input
                className="admin-input"
                dir="ltr"
                value={about.kicker}
                onChange={(event) => updateField("kicker", event.target.value)}
              />
            </Field>
            <Field label={L.title}>
              <input
                className="admin-input"
                value={about.title}
                onChange={(event) => updateField("title", event.target.value)}
              />
            </Field>
            <Field label={L.body} className="sm:col-span-2">
              <textarea
                className="admin-textarea"
                value={about.body}
                onChange={(event) => updateField("body", event.target.value)}
              />
            </Field>
            <Field label={L.visualTop}>
              <input
                className="admin-input"
                dir="ltr"
                value={about.visualTop}
                onChange={(event) => updateField("visualTop", event.target.value)}
              />
            </Field>
            <Field label={L.visualBottom}>
              <input
                className="admin-input"
                dir="ltr"
                value={about.visualBottom}
                onChange={(event) => updateField("visualBottom", event.target.value)}
              />
            </Field>
          </div>
        </Card>

        {/* الرؤية والرسالة */}
        <Card title="الرؤية والرسالة">
          <div className="admin-field-row">
            <Field label={L.visionLabel}>
              <input
                className="admin-input"
                value={about.visionLabel}
                onChange={(event) => updateField("visionLabel", event.target.value)}
              />
            </Field>
            <Field label={L.vision} className="sm:col-span-2">
              <textarea
                className="admin-textarea"
                value={about.vision}
                onChange={(event) => updateField("vision", event.target.value)}
              />
            </Field>
            <Field label={L.missionLabel}>
              <input
                className="admin-input"
                value={about.missionLabel}
                onChange={(event) => updateField("missionLabel", event.target.value)}
              />
            </Field>
            <Field label={L.mission} className="sm:col-span-2">
              <textarea
                className="admin-textarea"
                value={about.mission}
                onChange={(event) => updateField("mission", event.target.value)}
              />
            </Field>
            <Field label={L.flipHint}>
              <input
                className="admin-input"
                value={about.flipHint}
                onChange={(event) => updateField("flipHint", event.target.value)}
              />
            </Field>
          </div>
        </Card>

        {/* التخصصات */}
        <Card title={L.specialties}>
          <div className="space-y-4">
            {about.specialties.map((item, index) => (
              <SpecialtyShell
                key={item}
                index={index}
                onMove={(direction) => moveSpecialty(index, direction)}
                canMoveUp={index > 0}
                canMoveDown={index < about.specialties.length - 1}
                onDelete={() => deleteSpecialty(index)}
              >
                <Field label={`التخصص ${index + 1}`}>
                  <input
                    className="admin-input"
                    value={item}
                    onChange={(event) => {
                      const items = [...about.specialties];
                      items[index] = event.target.value;
                      updateField("specialties", items);
                    }}
                  />
                </Field>
              </SpecialtyShell>
            ))}
            {about.specialties.length === 0 && (
              <p className="text-xs text-[#8A9797]">{L.noSpecialties}</p>
            )}
            <AddButton label={L.addSpecialty} onClick={addSpecialty} className="mt-2" />
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
