"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import {
  AddButton,
  Card,
  DeleteButton,
  ImageField,
  Notice,
  PageHeader,
  SaveBar,
  Toggle,
} from "@/components/admin/ui";
import { useSiteDraft } from "@/components/admin/useSiteDraft";
import { ChevronDown } from "@/components/ui/Icons";
import { cn } from "@/lib/utils";
import { newId } from "@/lib/admin-client";
import type { SiteData } from "@content/site";
import type {
  ClientItem,
  HiddenData,
  JournalItem,
  TeamItem,
  WorkItem,
} from "@content/model";

type HiddenKey = keyof HiddenData;

const TAB_META: Record<
  HiddenKey,
  { label: string; hint: string; anchor: string }
> = {
  work: {
    label: "الأعمال",
    hint: "أضف المشاريع مع صورة وتصنيف وسنة ورابط اختياري.",
    anchor: "#work",
  },
  clients: {
    label: "العملاء",
    hint: "أضف أسماء العملاء وشعاراتهم وروابط مواقعهم.",
    anchor: "#clients",
  },
  team: {
    label: "الفريق",
    hint: "أضف أعضاء الفريق مع الصورة والدور والنبذة.",
    anchor: "#team",
  },
  journal: {
    label: "المدونة",
    hint: "أضف المقالات مع التاريخ والمقتطف والرابط.",
    anchor: "#journal",
  },
};

function Field({
  label,
  children,
  className,
}: {
  label: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="admin-label">{label}</span>
      {children}
    </label>
  );
}

function Shell({
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
  children: ReactNode;
}) {
  return (
    <details
      open
      className="group rounded-xl border border-[#E7E0D3] bg-[#FCFAF5]"
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
            {title || "عنصر بدون عنوان"}
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
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#DED5C4] text-[#6A7D80] disabled:opacity-30"
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
            className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-[#DED5C4] text-[#6A7D80] disabled:opacity-30"
          >
            ↓
          </button>
          <DeleteButton
            onClick={(event) => {
              event.preventDefault();
              onDelete();
            }}
          />
        </span>
      </summary>
      <div className="border-t border-[#E7E0D3] bg-white p-3.5">
        <div className="grid gap-3 sm:grid-cols-2">{children}</div>
      </div>
    </details>
  );
}

function moveItem<T>(items: T[], index: number, direction: -1 | 1) {
  const target = index + direction;
  if (target < 0 || target >= items.length) return items;
  const next = [...items];
  [next[index], next[target]] = [next[target], next[index]];
  return next;
}

function WorkList({
  items,
  onChange,
}: {
  items: WorkItem[];
  onChange: (items: WorkItem[]) => void;
}) {
  const update = (index: number, patch: Partial<WorkItem>) =>
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <Shell
          key={item.id}
          index={index}
          title={item.titleAr || item.titleEn}
          onMove={(direction) => onChange(moveItem(items, index, direction))}
          canMoveUp={index > 0}
          canMoveDown={index < items.length - 1}
          onDelete={() => onChange(items.filter((_, i) => i !== index))}
        >
          <Field label="العنوان (عربي)">
            <input
              className="admin-input"
              value={item.titleAr}
              onChange={(event) => update(index, { titleAr: event.target.value })}
            />
          </Field>
          <Field label="العنوان (إنجليزي)">
            <input
              className="admin-input"
              dir="ltr"
              value={item.titleEn}
              onChange={(event) => update(index, { titleEn: event.target.value })}
            />
          </Field>
          <Field label="التصنيف (عربي)">
            <input
              className="admin-input"
              value={item.categoryAr}
              onChange={(event) => update(index, { categoryAr: event.target.value })}
            />
          </Field>
          <Field label="التصنيف (إنجليزي)">
            <input
              className="admin-input"
              dir="ltr"
              value={item.categoryEn}
              onChange={(event) => update(index, { categoryEn: event.target.value })}
            />
          </Field>
          <Field label="الوصف (عربي)" className="sm:col-span-2">
            <textarea
              className="admin-textarea"
              value={item.descriptionAr}
              onChange={(event) =>
                update(index, { descriptionAr: event.target.value })
              }
            />
          </Field>
          <Field label="الوصف (إنجليزي)" className="sm:col-span-2">
            <textarea
              className="admin-textarea"
              dir="ltr"
              value={item.descriptionEn}
              onChange={(event) =>
                update(index, { descriptionEn: event.target.value })
              }
            />
          </Field>
          <Field label="السنة">
            <input
              className="admin-input max-w-[140px]"
              dir="ltr"
              value={item.year}
              onChange={(event) => update(index, { year: event.target.value })}
              placeholder="2026"
            />
          </Field>
          <Field label="الرابط">
            <input
              className="admin-input"
              dir="ltr"
              type="url"
              value={item.href}
              onChange={(event) => update(index, { href: event.target.value })}
              placeholder="https://…"
            />
          </Field>
          <div className="sm:col-span-2">
            <ImageField
              label="صورة العمل"
              value={item.image}
              onChange={(value) => update(index, { image: value })}
            />
          </div>
        </Shell>
      ))}
      <AddButton
        label="إضافة عمل"
        onClick={() =>
          onChange([
            ...items,
            {
              id: newId(),
              titleAr: "",
              titleEn: "",
              categoryAr: "",
              categoryEn: "",
              descriptionAr: "",
              descriptionEn: "",
              image: "",
              href: "",
              year: "",
            },
          ])
        }
      />
    </div>
  );
}

function ClientList({
  items,
  onChange,
}: {
  items: ClientItem[];
  onChange: (items: ClientItem[]) => void;
}) {
  const update = (index: number, patch: Partial<ClientItem>) =>
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <Shell
          key={item.id}
          index={index}
          title={item.name}
          onMove={(direction) => onChange(moveItem(items, index, direction))}
          canMoveUp={index > 0}
          canMoveDown={index < items.length - 1}
          onDelete={() => onChange(items.filter((_, i) => i !== index))}
        >
          <Field label="اسم العميل">
            <input
              className="admin-input"
              value={item.name}
              onChange={(event) => update(index, { name: event.target.value })}
            />
          </Field>
          <Field label="رابط الموقع">
            <input
              className="admin-input"
              dir="ltr"
              type="url"
              value={item.url}
              onChange={(event) => update(index, { url: event.target.value })}
              placeholder="https://…"
            />
          </Field>
          <div className="sm:col-span-2">
            <ImageField
              label="شعار العميل"
              value={item.logo}
              onChange={(value) => update(index, { logo: value })}
              hint="اتركه فارغًا لعرض الاسم كنص."
            />
          </div>
        </Shell>
      ))}
      <AddButton
        label="إضافة عميل"
        onClick={() =>
          onChange([
            ...items,
            { id: newId(), name: "", logo: "", url: "" },
          ])
        }
      />
    </div>
  );
}

function TeamList({
  items,
  onChange,
}: {
  items: TeamItem[];
  onChange: (items: TeamItem[]) => void;
}) {
  const update = (index: number, patch: Partial<TeamItem>) =>
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <Shell
          key={item.id}
          index={index}
          title={item.nameAr || item.nameEn}
          onMove={(direction) => onChange(moveItem(items, index, direction))}
          canMoveUp={index > 0}
          canMoveDown={index < items.length - 1}
          onDelete={() => onChange(items.filter((_, i) => i !== index))}
        >
          <Field label="الاسم (عربي)">
            <input
              className="admin-input"
              value={item.nameAr}
              onChange={(event) => update(index, { nameAr: event.target.value })}
            />
          </Field>
          <Field label="الاسم (إنجليزي)">
            <input
              className="admin-input"
              dir="ltr"
              value={item.nameEn}
              onChange={(event) => update(index, { nameEn: event.target.value })}
            />
          </Field>
          <Field label="الدور (عربي)">
            <input
              className="admin-input"
              value={item.roleAr}
              onChange={(event) => update(index, { roleAr: event.target.value })}
            />
          </Field>
          <Field label="الدور (إنجليزي)">
            <input
              className="admin-input"
              dir="ltr"
              value={item.roleEn}
              onChange={(event) => update(index, { roleEn: event.target.value })}
            />
          </Field>
          <Field label="نبذة (عربي)" className="sm:col-span-2">
            <textarea
              className="admin-textarea"
              value={item.bioAr}
              onChange={(event) => update(index, { bioAr: event.target.value })}
            />
          </Field>
          <Field label="نبذة (إنجليزي)" className="sm:col-span-2">
            <textarea
              className="admin-textarea"
              dir="ltr"
              value={item.bioEn}
              onChange={(event) => update(index, { bioEn: event.target.value })}
            />
          </Field>
          <div className="sm:col-span-2">
            <ImageField
              label="صورة العضو"
              value={item.image}
              onChange={(value) => update(index, { image: value })}
            />
          </div>
        </Shell>
      ))}
      <AddButton
        label="إضافة عضو"
        onClick={() =>
          onChange([
            ...items,
            {
              id: newId(),
              nameAr: "",
              nameEn: "",
              roleAr: "",
              roleEn: "",
              bioAr: "",
              bioEn: "",
              image: "",
            },
          ])
        }
      />
    </div>
  );
}

function JournalList({
  items,
  onChange,
}: {
  items: JournalItem[];
  onChange: (items: JournalItem[]) => void;
}) {
  const update = (index: number, patch: Partial<JournalItem>) =>
    onChange(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));

  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <Shell
          key={item.id}
          index={index}
          title={item.titleAr || item.titleEn}
          onMove={(direction) => onChange(moveItem(items, index, direction))}
          canMoveUp={index > 0}
          canMoveDown={index < items.length - 1}
          onDelete={() => onChange(items.filter((_, i) => i !== index))}
        >
          <Field label="العنوان (عربي)">
            <input
              className="admin-input"
              value={item.titleAr}
              onChange={(event) => update(index, { titleAr: event.target.value })}
            />
          </Field>
          <Field label="العنوان (إنجليزي)">
            <input
              className="admin-input"
              dir="ltr"
              value={item.titleEn}
              onChange={(event) => update(index, { titleEn: event.target.value })}
            />
          </Field>
          <Field label="المقتطف (عربي)" className="sm:col-span-2">
            <textarea
              className="admin-textarea"
              value={item.excerptAr}
              onChange={(event) => update(index, { excerptAr: event.target.value })}
            />
          </Field>
          <Field label="المقتطف (إنجليزي)" className="sm:col-span-2">
            <textarea
              className="admin-textarea"
              dir="ltr"
              value={item.excerptEn}
              onChange={(event) => update(index, { excerptEn: event.target.value })}
            />
          </Field>
          <Field label="المحتوى الكامل (عربي)" className="sm:col-span-2">
            <textarea
              className="admin-textarea min-h-[130px]"
              value={item.bodyAr}
              onChange={(event) => update(index, { bodyAr: event.target.value })}
            />
          </Field>
          <Field label="المحتوى الكامل (إنجليزي)" className="sm:col-span-2">
            <textarea
              className="admin-textarea min-h-[130px]"
              dir="ltr"
              value={item.bodyEn}
              onChange={(event) => update(index, { bodyEn: event.target.value })}
            />
          </Field>
          <Field label="التاريخ">
            <input
              className="admin-input"
              dir="ltr"
              value={item.date}
              onChange={(event) => update(index, { date: event.target.value })}
              placeholder="2026-01-15"
            />
          </Field>
          <Field label="رابط المقال">
            <input
              className="admin-input"
              dir="ltr"
              type="url"
              value={item.href}
              onChange={(event) => update(index, { href: event.target.value })}
              placeholder="https://…"
            />
          </Field>
          <div className="sm:col-span-2">
            <ImageField
              label="صورة المقال"
              value={item.image}
              onChange={(value) => update(index, { image: value })}
            />
          </div>
        </Shell>
      ))}
      <AddButton
        label="إضافة مقال"
        onClick={() =>
          onChange([
            ...items,
            {
              id: newId(),
              titleAr: "",
              titleEn: "",
              excerptAr: "",
              excerptEn: "",
              bodyAr: "",
              bodyEn: "",
              image: "",
              date: "",
              href: "",
            },
          ])
        }
      />
    </div>
  );
}

export function SectionsEditor({ initialData }: { initialData: SiteData }) {
  const { draft, setDraft, dirty, saving, message, save, discard } =
    useSiteDraft(initialData);
  const [tab, setTab] = useState<HiddenKey>("work");

  const setHidden = (key: HiddenKey, items: HiddenData[HiddenKey]) => {
    setDraft((current) => ({
      ...current,
      hidden: { ...current.hidden, [key]: items },
    }));
  };

  const setFlag = (key: HiddenKey, value: boolean) => {
    setDraft((current) => ({
      ...current,
      flags: { ...current.flags, [key]: value },
    }));
  };

  const meta = TAB_META[tab];
  const count = draft.hidden[tab].length;

  return (
    <div>
      <PageHeader
        eyebrow="HIDDEN SECTIONS / الأقسام"
        title="الأقسام المخفية"
        description="أضف الأعمال والعملاء والفريق والمقالات. كل عنصر هنا يظهر تلقائيًا عند تفعيل القسم."
      />

      <div className="mb-4 flex flex-wrap items-center gap-2">
        {(Object.keys(TAB_META) as HiddenKey[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={cn("admin-tab border border-[#DED5C4] bg-white", tab === key && "admin-tab-active border-[#0B2730]")}
          >
            {TAB_META[key].label}
            <span
              className={cn(
                "font-grotesk text-[9px]",
                tab === key ? "text-[#F2E04E]/60" : "text-[#B3ABA0]",
              )}
            >
              {draft.hidden[key].length}
            </span>
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <Card
          title={`قسم ${meta.label}`}
          description={meta.hint}
          actions={
            <a
              href={`/${meta.anchor}`}
              target="_blank"
              className="admin-btn admin-btn-ghost min-h-8 px-3 text-[10px]"
            >
              معاينة القسم
            </a>
          }
        >
          <div className="mb-4 max-w-xl">
            <Toggle
              label={`إظهار قسم ${meta.label} في الموقع`}
              description={
                draft.flags[tab]
                  ? "القسم مفعّل ويظهر في الصفحة."
                  : "القسم مخفي حاليًا. فعّله ليظهر للزوار."
              }
              checked={draft.flags[tab]}
              onChange={(value) => setFlag(tab, value)}
            />
          </div>

          {count === 0 ? (
            <Notice tone="warn">
              لا توجد عناصر بعد. أضف أول عنصر من الزر أدناه. إذا كان القسم
              مفعّلًا سيظهر مكان بديل أنيق حتى تضيف محتوى.
            </Notice>
          ) : null}

          <div className="mt-4">
            {tab === "work" && (
              <WorkList
                items={draft.hidden.work}
                onChange={(items) => setHidden("work", items)}
              />
            )}
            {tab === "clients" && (
              <ClientList
                items={draft.hidden.clients}
                onChange={(items) => setHidden("clients", items)}
              />
            )}
            {tab === "team" && (
              <TeamList
                items={draft.hidden.team}
                onChange={(items) => setHidden("team", items)}
              />
            )}
            {tab === "journal" && (
              <JournalList
                items={draft.hidden.journal}
                onChange={(items) => setHidden("journal", items)}
              />
            )}
          </div>
        </Card>

        <Notice tone="info">
          الروابط والصور هنا اختيارية. استخدم «الصور والملفات» لرفع الشعارات
          وصور الأعمال ثم اخترها من المكتبة داخل كل حقل صورة.
        </Notice>
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
