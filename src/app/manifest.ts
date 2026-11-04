import type { MetadataRoute } from "next";
import { readSiteData } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const data = await readSiteData();
  return {
    name: `${data.settings.nameEn} — ${data.settings.legalName}`,
    short_name: data.settings.nameEn,
    description: data.content.en.meta.description,
    start_url: "/",
    display: "standalone",
    background_color: "#FBF8F1",
    theme_color: "#07262F",
    icons: [
      {
        src: data.settings.favicon || "/icon.svg",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  };
}
