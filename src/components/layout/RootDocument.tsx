import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { ThemeScript } from "@/components/ThemeScript";
import { SiteDataProvider } from "@/components/providers/SiteDataProvider";
import { buildMetadata, organizationJsonLd } from "@/lib/metadata";
import type { Locale } from "@content/model";
import type { SiteData } from "@content/site";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FBF8F1" },
    { media: "(prefers-color-scheme: dark)", color: "#061F27" },
  ],
};

export function rootMetadata(locale: Locale, data: SiteData): Metadata {
  return buildMetadata(locale, data);
}

export function RootDocument({
  locale,
  data,
  children,
}: {
  locale: Locale;
  data: SiteData;
  children: ReactNode;
}) {
  const isAr = locale === "ar";
  const jsonLd = organizationJsonLd(locale, data);

  return (
    <html
      lang={isAr ? "ar" : "en"}
      dir={isAr ? "rtl" : "ltr"}
      data-theme="light"
      suppressHydrationWarning
    >
      {/* eslint-disable-next-line @next/next/no-head-element */}
      <head>
        <ThemeScript />
      </head>
      <body className="min-h-screen bg-canvas font-arabic text-foreground antialiased">
        <SiteDataProvider data={data}>{children}</SiteDataProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
