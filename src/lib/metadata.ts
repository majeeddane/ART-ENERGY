import type { Metadata } from "next";
import type { Locale } from "@content/model";
import type { SiteData } from "@content/site";

function absolute(base: string, value: string, fallback: string) {
  const path = value || fallback;
  if (/^https?:\/\//i.test(path)) return path;
  return `${base.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
}

export function buildMetadata(locale: Locale, data: SiteData): Metadata {
  const dict = data.content[locale];
  const settings = data.settings;
  const isAr = locale === "ar";
  const path = isAr ? "/" : "/en";
  const siteName = isAr ? settings.nameAr : settings.nameEn;
  const og = settings.ogImage || "/og.png";
  const favicon = settings.favicon || "/icon.svg";
  const keywords = isAr ? settings.keywordsAr : settings.keywordsEn;

  return {
    metadataBase: new URL(settings.url),
    title: {
      default: dict.meta.title,
      template: `%s | ${siteName}`,
    },
    description: dict.meta.description,
    applicationName: "ART ENERGY",
    authors: [{ name: "ART ENERGY" }],
    creator: "ART ENERGY",
    publisher: "ART ENERGY",
    keywords,
    alternates: {
      canonical: path,
      languages: {
        "ar-SA": "/",
        en: "/en",
        "x-default": "/",
      },
    },
    openGraph: {
      type: "website",
      locale: isAr ? "ar_SA" : "en_US",
      alternateLocale: isAr ? "en_US" : "ar_SA",
      url: path,
      siteName,
      title: dict.meta.title,
      description: dict.meta.description,
      images: [
        {
          url: og,
          width: 1200,
          height: 630,
          alt: dict.meta.ogAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: dict.meta.title,
      description: dict.meta.description,
      images: [og],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: [{ url: favicon, type: "image/svg+xml" }],
      apple: [{ url: favicon }],
    },
    category: "business",
  };
}

export function organizationJsonLd(locale: Locale, data: SiteData) {
  const isAr = locale === "ar";
  const settings = data.settings;
  const dict = data.content[locale];
  const name = isAr ? settings.nameAr : settings.nameEn;
  const og = absolute(settings.url, settings.ogImage, "/og.png");
  const logo = absolute(settings.url, settings.favicon, "/icon.svg");

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${settings.url}/#organization`,
        name,
        legalName: settings.legalName,
        url: settings.url,
        logo,
        image: og,
        email: settings.email,
        telephone: settings.phoneDisplay,
        description: dict.meta.description,
        areaServed: {
          "@type": "Country",
          name: isAr ? "المملكة العربية السعودية" : "Saudi Arabia",
          identifier: settings.country || "SA",
        },
        knowsAbout: dict.services.items.map((service) => service.title),
        contactPoint: [
          {
            "@type": "ContactPoint",
            telephone: settings.phoneDisplay,
            email: settings.email,
            contactType: "sales",
            availableLanguage: ["ar", "en"],
            areaServed: settings.country || "SA",
          },
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${settings.url}/#website`,
        url: settings.url,
        name,
        inLanguage: isAr ? "ar-SA" : "en",
        publisher: { "@id": `${settings.url}/#organization` },
      },
      {
        "@type": "ProfessionalService",
        name,
        url: settings.url,
        image: og,
        telephone: settings.phoneDisplay,
        email: settings.email,
        priceRange: `SAR ${settings.campaignMin} – SAR ${settings.campaignMax}+`,
        areaServed: settings.country || "SA",
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: isAr ? "خدمات ارت إنيرجي" : "ART ENERGY services",
          itemListElement: dict.services.items.map((service) => ({
            "@type": "Offer",
            itemOffered: { "@type": "Service", name: service.title },
          })),
        },
      },
    ],
  };
}
