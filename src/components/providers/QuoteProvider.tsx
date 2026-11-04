"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { ReactNode } from "react";
import { useDict, useSettings } from "@/components/providers/SiteDataProvider";
import type { Locale } from "@content/model";
import type { Dict } from "@content/site";

export type QuoteItem = {
  id: string;
  label: string;
  price?: number;
  priceMax?: number;
  suffix?: string;
};

type QuoteState = {
  packageId: string | null;
  packageName: string | null;
  production: string[];
  productionLabels: string[];
  campaign: boolean;
};

type QuoteContextValue = {
  locale: Locale;
  dict: Dict;
  quote: QuoteState;
  selectPackage: (id: string, name: string) => void;
  clearPackage: () => void;
  toggleProduction: (id: string, label: string) => void;
  setCampaign: (value: boolean) => void;
  reset: () => void;
  summary: QuoteItem[];
  serviceFocus: string | null;
  setServiceFocus: (value: string | null) => void;
};

const empty: QuoteState = {
  packageId: null,
  packageName: null,
  production: [],
  productionLabels: [],
  campaign: false,
};

const QuoteContext = createContext<QuoteContextValue | null>(null);

export function useQuote() {
  const ctx = useContext(QuoteContext);
  if (!ctx) throw new Error("useQuote must be used inside QuoteProvider");
  return ctx;
}

export function QuoteProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const dict = useDict(locale);
  const settings = useSettings();
  const [quote, setQuote] = useState<QuoteState>(empty);
  const [serviceFocus, setServiceFocus] = useState<string | null>(null);

  const selectPackage = useCallback((id: string, name: string) => {
    setQuote((q) => ({ ...q, packageId: id, packageName: name }));
  }, []);

  const clearPackage = useCallback(() => {
    setQuote((q) => ({ ...q, packageId: null, packageName: null }));
  }, []);

  const toggleProduction = useCallback((id: string, label: string) => {
    setQuote((q) => {
      const exists = q.production.includes(id);
      return {
        ...q,
        production: exists
          ? q.production.filter((x) => x !== id)
          : [...q.production, id],
        productionLabels: exists
          ? q.productionLabels.filter((x) => x !== label)
          : [...q.productionLabels, label],
      };
    });
  }, []);

  const setCampaign = useCallback((value: boolean) => {
    setQuote((q) => ({ ...q, campaign: value }));
  }, []);

  const reset = useCallback(() => setQuote(empty), []);

  const summary = useMemo<QuoteItem[]>(() => {
    const items: QuoteItem[] = [];
    if (quote.packageId && quote.packageName) {
      const plan = dict.packages.plans.find(
        (p) => p.number === quote.packageId,
      );
      items.push({
        id: `pkg-${quote.packageId}`,
        label: plan ? `${plan.name} — ${plan.nickname}` : quote.packageName,
        price: plan?.price,
        suffix: dict.packages.builder.monthly,
      });
    }
    quote.production.forEach((id) => {
      const item = dict.production.items.find((p) => p.number === id);
      if (item) {
        items.push({
          id: `prod-${id}`,
          label: item.title,
          price: item.price,
          suffix: dict.ui.from,
        });
      }
    });
    if (quote.campaign) {
      items.push({
        id: "campaign",
        label: dict.packages.builder.campaignName,
        price: settings.campaignMin,
        priceMax: settings.campaignMax,
        suffix: dict.ui.sar,
      });
    }
    return items;
  }, [quote, dict, settings.campaignMin, settings.campaignMax]);

  const value = useMemo(
    () => ({
      locale,
      dict,
      quote,
      selectPackage,
      clearPackage,
      toggleProduction,
      setCampaign,
      reset,
      summary,
      serviceFocus,
      setServiceFocus,
    }),
    [
      locale,
      dict,
      quote,
      selectPackage,
      clearPackage,
      toggleProduction,
      setCampaign,
      reset,
      summary,
      serviceFocus,
    ],
  );

  return (
    <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>
  );
}
