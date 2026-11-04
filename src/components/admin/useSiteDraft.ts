"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { SiteData } from "@content/site";
import { saveContent } from "@/lib/admin-client";

export type DraftMessage = { type: "ok" | "error"; text: string } | null;

export function useSiteDraft(initial: SiteData) {
  const [draft, setDraft] = useState<SiteData>(initial);
  const [baseline, setBaseline] = useState(() => JSON.stringify(initial));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<DraftMessage>(null);

  const dirty = useMemo(
    () => JSON.stringify(draft) !== baseline,
    [draft, baseline],
  );

  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", warn);
    return () => window.removeEventListener("beforeunload", warn);
  }, [dirty]);

  useEffect(() => {
    if (!message) return;
    const timer = window.setTimeout(() => setMessage(null), 6000);
    return () => window.clearTimeout(timer);
  }, [message]);

  const save = useCallback(async () => {
    setSaving(true);
    setMessage(null);
    try {
      const result = await saveContent(draft);
      setDraft(result.data);
      setBaseline(JSON.stringify(result.data));
      setMessage({
        type: "ok",
        text: "تم حفظ التغييرات وتحديث الموقع بنجاح.",
      });
      return true;
    } catch (error) {
      setMessage({
        type: "error",
        text:
          error instanceof Error
            ? error.message
            : "تعذر حفظ التغييرات. حاول مرة أخرى.",
      });
      return false;
    } finally {
      setSaving(false);
    }
  }, [draft]);

  const discard = useCallback(() => {
    setDraft(JSON.parse(baseline) as SiteData);
    setMessage({ type: "ok", text: "تمت استعادة آخر نسخة محفوظة." });
  }, [baseline]);

  return {
    draft,
    setDraft,
    dirty,
    saving,
    message,
    setMessage,
    save,
    discard,
  };
}
