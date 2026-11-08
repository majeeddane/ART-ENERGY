"use client";

import { useState } from "react";
import { AddButton, DeleteButton, Notice, PageHeader, SaveBar } from "@/components/admin/ui";
import { useSiteDraft } from "@/components/admin/useSiteDraft";
import { ChevronDown, Trash } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import type { SiteData } from "@content/site";
import type { Locale } from "@content/model";

interface PackageItem {
  number: string;
  name: string;
  nickname: string;
  price: number;
  features: string[];
}

const PACKAGES_LABELS: Record<Locale, Record<string, string>> = {
  ar: {
    title: "إدارة الباقات الشهرية",
    description: "عدّل الباقات الشهرية، أضف باقات جديدة، أو احذف الباقات القديمة. الأسعار والمميزات تظهر في صفحة الباقات في الموقع.",
    number: "الرقم",
    name: "اسم الباقة",
    nickname: "الاسم المختصر",
    price: "السعر (ريال)",
    features: "المميزات",
    addFeature: "إضافة ميزة",
    addPackage: "إضافة باقة جديدة",
    deletePackage: "حذف هذه الباقة",
    moveUp: "تحريك لأعلى",
    moveDown: "تحريك لأسفل",
    noPackages: "لا توجد باقات بعد.",
  },
  en: {
    title: "Packages Management",
    description: "Manage monthly packages, add new packages, or remove old ones. Prices and features appear on the packages page on the website.",
    number: "Number",
    name: "Package Name",
    nickname: "Nickname",
    price: "Price (SAR)",
    features: "Features",
    addFeature: "Add feature",
    addPackage: "Add new package",
    deletePackage: "Delete this package",
    moveUp: "Move up",
    moveDown: "Move down",
    noPackages: "No packages yet.",
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

function PackageShell({
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
            {title || "باقة بدون عنوان"}
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

export function PackageManager({ initialData }: { initialData: SiteData }) {
  const { draft, setDraft, dirty, saving, message, save, discard } =
    useSiteDraft(initialData);
  const [locale, setLocale] = useState<Locale>("ar");
  const L = PACKAGES_LABELS[locale];

  const dict = draft.content[locale];
  const packages = dict.packages.plans as Array<PackageItem>;

  const updatePackage = (index: number, patch: Partial<PackageItem>) =>
    setDraft((current) => {
      const nextItems = [...(current.content[locale] as typeof dict).packages.plans];
      nextItems[index] = { ...nextItems[index], ...patch };
      return {
        ...current,
        content: {
          ...current.content,
          [locale]: {
            ...current.content[locale],
            packages: {
              ...current.content[locale].packages,
              plans: nextItems,
            },
          },
        },
      };
    });

  const movePackage = (index: number, direction: -1 | 1) => {
    setDraft((current) => {
      const nextItems = [...(current.content[locale] as typeof dict).packages.plans];
      const moved = moveItem(nextItems, index, direction);
      return {
        ...current,
        content: {
          ...current.content,
          [locale]: {
            ...current.content[locale],
            packages: {
              ...current.content[locale].packages,
              plans: moved,
            },
          },
        },
      };
    });
  };

  const deletePackage = (index: number) => {
    setDraft((current) => {
      const nextItems = [...(current.content[locale] as typeof dict).packages.plans];
      nextItems.splice(index, 1);
      return {
        ...current,
        content: {
          ...current.content,
          [locale]: {
            ...current.content[locale],
            packages: {
              ...current.content[locale].packages,
              plans: nextItems,
            },
          },
        },
      };
    });
  };

  const addPackage = () => {
    setDraft((current) => {
      const nextItems = [...(current.content[locale] as typeof dict).packages.plans];
      nextItems.push({
        number: String(nextItems.length + 1).padStart(2, "0"),
        name: "",
        nickname: "",
        price: 0,
        features: [],
      });
      return {
        ...current,
        content: {
          ...current.content,
          [locale]: {
            ...current.content[locale],
            packages: {
              ...current.content[locale].packages,
              plans: nextItems,
            },
          },
        },
      };
    });
  };

  const addFeature = (pkgIndex: number) => {
    setDraft((current) => {
      const nextItems = [...(current.content[locale] as typeof dict).packages.plans];
      const nextFeatures = [...nextItems[pkgIndex].features, ""];
      nextItems[pkgIndex] = { ...nextItems[pkgIndex], features: nextFeatures };
      return {
        ...current,
        content: {
          ...current.content,
          [locale]: {
            ...current.content[locale],
            packages: {
              ...current.content[locale].packages,
              plans: nextItems,
            },
          },
        },
      };
    });
  };

  const deleteFeature = (pkgIndex: number, featureIndex: number) => {
    setDraft((current) => {
      const nextItems = [...(current.content[locale] as typeof dict).packages.plans];
      nextItems[pkgIndex] = {
        ...nextItems[pkgIndex],
        features: nextItems[pkgIndex].features.filter((_, i) => i !== featureIndex),
      };
      return {
        ...current,
        content: {
          ...current.content,
          [locale]: {
            ...current.content[locale],
            packages: {
              ...current.content[locale].packages,
              plans: nextItems,
            },
          },
        },
      };
    });
  };

  return (
    <div>
      <PageHeader
        eyebrow="PACKAGES / إدارة الباقات"
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

      {packages.length === 0 && (
        <Notice tone="warn">{L.noPackages}</Notice>
      )}

      <div className="space-y-4">
        {packages.map((pkg, index) => (
          <PackageShell
            key={pkg.number}
            index={index}
            title={pkg.name}
            onMove={(direction) => movePackage(index, direction)}
            canMoveUp={index > 0}
            canMoveDown={index < packages.length - 1}
            onDelete={() => deletePackage(index)}
          >
            <Field label={L.number}>
              <input
                className="admin-input max-w-[100px]"
                dir="ltr"
                value={pkg.number}
                onChange={(event) => updatePackage(index, { number: event.target.value })}
              />
            </Field>
            <Field label={L.name}>
              <input
                className="admin-input"
                value={pkg.name}
                onChange={(event) => updatePackage(index, { name: event.target.value })}
              />
            </Field>
            <Field label={L.nickname}>
              <input
                className="admin-input"
                value={pkg.nickname}
                onChange={(event) => updatePackage(index, { nickname: event.target.value })}
              />
            </Field>
            <Field label={L.price}>
              <input
                className="admin-input max-w-[150px]"
                dir="ltr"
                type="number"
                min={0}
                value={pkg.price}
                onChange={(event) => updatePackage(index, { price: Number(event.target.value) })}
              />
            </Field>
            <Field label={L.features} className="sm:col-span-2">
              <div className="space-y-2">
                {pkg.features.map((feature, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <input
                      className="admin-input flex-1"
                      value={feature}
                      onChange={(event) =>
                        updatePackage(index, {
                          features: pkg.features.map((ft, ii) =>
                            ii === i ? event.target.value : ft
                          ),
                        })
                      }
                    />
                    <button
                      type="button"
                      onClick={() => deleteFeature(index, i)}
                      className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#E7B9B5] text-[#A9362E] transition hover:bg-[#FDF3F2]"
                    >
                      <Trash size={10} />
                    </button>
                  </div>
                ))}
                <AddButton label={L.addFeature} onClick={() => addFeature(index)} className="mt-2" />
              </div>
            </Field>
          </PackageShell>
        ))}
        <AddButton label={L.addPackage} onClick={addPackage} className="mt-4" />
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
