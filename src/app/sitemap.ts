import type { MetadataRoute } from "next";
import { readSiteData } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await readSiteData();
  const base = data.settings.url.replace(/\/$/, "");
  const lastModified = data.updatedAt ? new Date(data.updatedAt) : new Date();

  return [
    {
      url: `${base}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
      alternates: {
        languages: {
          ar: `${base}/`,
          en: `${base}/en`,
        },
      },
    },
    {
      url: `${base}/en`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
      alternates: {
        languages: {
          ar: `${base}/`,
          en: `${base}/en`,
        },
      },
    },
  ];
}
