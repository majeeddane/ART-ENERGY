"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";
import type { Locale } from "@content/model";
import type { SiteData } from "@content/site";

const SiteDataContext = createContext<SiteData | null>(null);

export function SiteDataProvider({
  data,
  children,
}: {
  data: SiteData;
  children: ReactNode;
}) {
  return (
    <SiteDataContext.Provider value={data}>
      {children}
    </SiteDataContext.Provider>
  );
}

export function useSiteData() {
  const context = useContext(SiteDataContext);
  if (!context) {
    throw new Error("useSiteData must be used inside SiteDataProvider");
  }
  return context;
}

export function useDict(locale: Locale) {
  return useSiteData().content[locale];
}

export function useSettings() {
  return useSiteData().settings;
}

export function useFlags() {
  return useSiteData().flags;
}
