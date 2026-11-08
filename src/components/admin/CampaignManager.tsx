"use client";

import { useState } from "react";
import { AddButton, Card, Notice, PageHeader, SaveBar } from "@/components/admin/ui";
import { useSiteDraft } from "@/components/admin/useSiteDraft";
import { Trash } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import type { SiteData } from "@content/site";
import type { Locale } from "@content/model";

const CAMPAIGNS_LABELS: Record<Locale, Record<string, string>> = {
  ar: {
    pageTitle: "إدارة الحملات الإعلانية",
    description: "عدّل عنوان وعنوان فرعي ونطاق الأسعار ومراحل تنفيذ الحملة للحملات الكبرى في ART ENERGY.",
    title: "العنوان",
    text: "الوصف",
    rangeLabel: "تسمية النطاق",
    campaignMin: "الحد الأدنى (ريال)",
    campaignMax: "الحد الأعلى (ريال)",
    cta: "نص الزر (CTA)",
    steps: "مراحل الحملة",
    addStep: "إضافة مرحلة",
    deleteStep: "حذف هذه المرحلة",
    noSteps: "لا توجد مراحل بعد.",
  },
  en: {
    pageTitle: "Campaigns Management",
    description: "Manage ART ENERGY major campaigns title, subtitle, price range, and execution steps.",
    title: "Title",
    text: "Description",
    rangeLabel: "Range Label",
    campaignMin: "Min Price (SAR)",
    campaignMax: "Max Price (SAR)",
    cta: "Button Text (CTA)",
    steps: "Campaign Steps",
    addStep: "Add step",
    deleteStep: "Delete this step",
    noSteps: "No steps yet.",
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

interface CampaignData {
  label: string;
  title: string;
  text: string;
  rangeLabel: string;
  cta: string;
  steps: string[];
}

export function CampaignManager({ initialData }: { initialData: SiteData }) {
  const { draft, setDraft, dirty, saving, message, save, discard } =
    useSiteDraft(initialData);
  const [locale, setLocale] = useState<Locale>("ar");
  const L = CAMPAIGNS_LABELS[locale];

  const dict = draft.content[locale];
  const campaigns = dict.campaigns as CampaignData;

  const updateField = (key: keyof CampaignData, value: string | string[]) =>
    setDraft((current) => {
      const next = {
        ...current.content[locale],
        campaigns: { ...current.content[locale].campaigns, [key]: value },
      };
      return {
        ...current,
        content: {
          ...current.content,
          [locale]: next,
        },
      };
    });

  const deleteStep = (index: number) => {
    setDraft((current) => {
      const next = { ...current.content[locale], campaigns: { ...current.content[locale].campaigns } };
      const steps = [...next.campaigns.steps];
      steps.splice(index, 1);
      next.campaigns.steps = steps;
      return {
        ...current,
        content: {
          ...current.content,
          [locale]: next,
        },
      };
    });
  };

  const addStep = () => {
    setDraft((current) => {
      const next = { ...current.content[locale], campaigns: { ...current.content[locale].campaigns } };
      next.campaigns.steps = [...next.campaigns.steps, ""];
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
        eyebrow="CAMPAIGNS / إدارة الحملات"
        title={L.pageTitle}
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
        <Card title="الإعدادات الأساسية">
          <div className="admin-field-row">
            <Field label={L.title}>
              <input
                className="admin-input"
                value={campaigns.title}
                onChange={(event) => updateField("title", event.target.value)}
              />
            </Field>
            <Field label={L.text} className="sm:col-span-2">
              <textarea
                className="admin-textarea"
                value={campaigns.text}
                onChange={(event) => updateField("text", event.target.value)}
              />
            </Field>
            <Field label={L.rangeLabel}>
              <input
                className="admin-input"
                value={campaigns.rangeLabel}
                onChange={(event) => updateField("rangeLabel", event.target.value)}
              />
            </Field>
            <Field label={L.cta}>
              <input
                className="admin-input"
                value={campaigns.cta}
                onChange={(event) => updateField("cta", event.target.value)}
              />
            </Field>
          </div>
          <Notice tone="info">
            نطاق الأسعار (الحد الأدنى والأعلى) يُدار من صفحة «الإعدادات والهوية» تحت قسم «نطاق الحملة».
          </Notice>
        </Card>

        <Card title={L.steps}>
          <div className="space-y-3">
            {campaigns.steps.map((step, index) => (
              <div key={index} className="flex items-start gap-2 border-b border-[#E7E0D3] pb-2">
                <input
                  className="admin-input flex-1"
                  value={step}
                  onChange={(event) => {
                    const steps = [...campaigns.steps];
                    steps[index] = event.target.value;
                    updateField("steps", steps);
                  }}
                />
                <button
                  type="button"
                  disabled={campaigns.steps.length <= 1}
                  onClick={() => deleteStep(index)}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#E7B9B5] text-[#A9362E] disabled:opacity-30 transition hover:bg-[#FDF3F2]"
                >
                  <Trash size={10} />
                </button>
              </div>
            ))}
            <AddButton label={L.addStep} onClick={addStep} className="mt-2" />
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
