"use client";

import { useState } from "react";
import { AddButton, DeleteButton, Notice, PageHeader, SaveBar } from "@/components/admin/ui";
import { useSiteDraft } from "@/components/admin/useSiteDraft";
import { ChevronDown, Trash } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import type { SiteData } from "@content/site";
import type { Locale } from "@content/model";

interface ServiceItem {
  number: string;
  title: string;
  tagline: string;
  items: string[];
}

const SERVICES_LABELS: Record<Locale, Record<string, string>> = {
  ar: {
    title: "إدارة الخدمات",
    description: "عدّل خدمات ART ENERGY الأساسية، أضف خدمات جديدة، أو احذف الخدمات القديمة. التغييرات تظهر على الموقع مباشرة بعد الحفظ.",
    number: "الرقم",
    titleAr: "العنوان (عربي)",
    titleEn: "العنوان (إنجليزي)",
    tagline: "الوصف المختصر (Tagline)",
    items: "الخدمات الفرعية",
    addItem: "إضافة خدمة فرعية",
    addService: "إضافة خدمة جديدة",
    deleteService: "حذف هذه الخدمة",
    moveUp: "تحريك لأعلى",
    moveDown: "تحريك لأسفل",
    noServices: "لا توجد خدمات بعد.",
  },
  en: {
    title: "Services Management",
    description: "Manage ART ENERGY core services, add new services, or remove old ones. Changes appear on the website after saving.",
    number: "Number",
    titleAr: "Title (Arabic)",
    titleEn: "Title (English)",
    tagline: "Tagline",
    items: "Sub-items",
    addItem: "Add sub-item",
    addService: "Add new service",
    deleteService: "Delete this service",
    moveUp: "Move up",
    moveDown: "Move down",
    noServices: "No services yet.",
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

function moveItem<T>(items: T[], index: number, direction: -1 | 1) {
  const target = index + direction;
  if (target < 0 || target >= items.length) return items;
  const next = [...items];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

function ServiceShell({
  index,
  title,
  onMove,
  canMoveUp,
  canMoveDown,
  onDelete,
  children,
}: {
  index: number;
  title: string;
  onMove: (direction: -1 | 1) => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
  onDelete: () => void;
  children: React.ReactNode;
}) {
  return (
    <details
      open
      className="group rounded-xl border border-[#E7E0D3] bg-[#FCFAF5] shadow-sm transition-all hover:shadow-soft"
    >
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3.5 py-3">
        <span className="flex min-w-0 items-center gap-2">
          <ChevronDown
            size={14}
            className="shrink-0 text-[#8A9797] transition group-open:rotate-180"
          />
          <span className="font-grotesk text-[9px] text-[#9AA5A5]">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span className="truncate text-xs font-semibold text-[#14262B]">
            {title || "خدمة بدون عنوان"}
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

export function ServiceManager({ initialData }: { initialData: SiteData }) {
  const { draft, setDraft, dirty, saving, message, save, discard } =
    useSiteDraft(initialData);
  const [locale, setLocale] = useState<Locale>("ar");
  const L = SERVICES_LABELS[locale];

  const dict = draft.content[locale];
  const services = dict.services.items as Array<ServiceItem>;

  const updateService = (index: number, patch: Partial<ServiceItem>) =>
    setDraft((current) => {
      const nextItems = [...(current.content[locale] as typeof dict).services.items];
      nextItems[index] = { ...nextItems[index], ...patch };
      return {
        ...current,
        content: {
          ...current.content,
          [locale]: {
            ...current.content[locale],
            services: {
              ...current.content[locale].services,
              items: nextItems,
            },
          },
        },
      };
    });

  const moveService = (index: number, direction: -1 | 1) => {
    setDraft((current) => {
      const nextItems = [...(current.content[locale] as typeof dict).services.items];
      const moved = moveItem(nextItems, index, direction);
      return {
        ...current,
        content: {
          ...current.content,
          [locale]: {
            ...current.content[locale],
            services: {
              ...current.content[locale].services,
              items: moved,
            },
          },
        },
      };
    });
  };

  const deleteService = (index: number) => {
    setDraft((current) => {
      const nextItems = [...(current.content[locale] as typeof dict).services.items];
      nextItems.splice(index, 1);
      return {
        ...current,
        content: {
          ...current.content,
          [locale]: {
            ...current.content[locale],
            services: {
              ...current.content[locale].services,
              items: nextItems,
            },
          },
        },
      };
    });
  };

  const addService = () => {
    setDraft((current) => {
      const nextItems = [...(current.content[locale] as typeof dict).services.items];
      nextItems.push({
        number: String(nextItems.length + 1).padStart(2, "0"),
        title: "",
        tagline: "",
        items: [],
      });
      return {
        ...current,
        content: {
          ...current.content,
          [locale]: {
            ...current.content[locale],
            services: {
              ...current.content[locale].services,
              items: nextItems,
            },
          },
        },
      };
    });
  };

  const addSubItem = (serviceIndex: number) => {
    setDraft((current) => {
      const nextItems = [...(current.content[locale] as typeof dict).services.items];
      const nextServiceItems = [...nextItems[serviceIndex].items, ""];
      nextItems[serviceIndex] = { ...nextItems[serviceIndex], items: nextServiceItems };
      return {
        ...current,
        content: {
          ...current.content,
          [locale]: {
            ...current.content[locale],
            services: {
              ...current.content[locale].services,
              items: nextItems,
            },
          },
        },
      };
    });
  };

  const deleteSubItem = (serviceIndex: number, itemIndex: number) => {
    setDraft((current) => {
      const nextItems = [...(current.content[locale] as typeof dict).services.items];
      nextItems[serviceIndex] = {
        ...nextItems[serviceIndex],
        items: nextItems[serviceIndex].items.filter((_, i) => i !== itemIndex),
      };
      return {
        ...current,
        content: {
          ...current.content,
          [locale]: {
            ...current.content[locale],
            services: {
              ...current.content[locale].services,
              items: nextItems,
            },
          },
        },
      };
    });
  };

  return (
    <div>
      <PageHeader
        eyebrow="SERVICES / إدارة الخدمات"
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

      {services.length === 0 && (
        <Notice tone="warn">{L.noServices}</Notice>
      )}

      <div className="space-y-4">
        {services.map((service, index) => (
          <ServiceShell
            key={service.number}
            index={index}
            title={service.title}
            onMove={(direction) => moveService(index, direction)}
            canMoveUp={index > 0}
            canMoveDown={index < services.length - 1}
            onDelete={() => deleteService(index)}
          >
            <Field label={L.number}>
              <input
                className="admin-input max-w-[100px]"
                dir="ltr"
                value={service.number}
                onChange={(event) => updateService(index, { number: event.target.value })}
              />
            </Field>
            <Field label={L.titleAr}>
              <input
                className="admin-input"
                value={service.title}
                onChange={(event) => updateService(index, { title: event.target.value })}
              />
            </Field>
            <Field label={L.tagline} className="sm:col-span-2">
              <input
                className="admin-input"
                value={service.tagline}
                onChange={(event) => updateService(index, { tagline: event.target.value })}
              />
            </Field>
            <Field label={L.items} className="sm:col-span-2">
              <div className="space-y-2">
                {service.items.map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <input
                      className="admin-input flex-1"
                      value={item}
                      onChange={(event) =>
                        updateService(index, {
                          items: service.items.map((it, ii) =>
                            ii === i ? event.target.value : it
                          ),
                        })
                      }
                    />
                    <button
                      type="button"
                      onClick={() => deleteSubItem(index, i)}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#E7B9B5] text-[#A9362E] transition hover:bg-[#FDF3F2]"
                    >
                      <Trash size={10} />
                    </button>
                  </div>
                ))}
                <AddButton
                  label={L.addItem}
                  onClick={() => addSubItem(index)}
                  className="mt-2"
                />
              </div>
            </Field>
          </ServiceShell>
        ))}
        <AddButton label={L.addService} onClick={addService} className="mt-4" />
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
