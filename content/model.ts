/**
 * Shared, serialisable types for the site content store.
 * This file must stay free of runtime data so client components can import
 * types without pulling the whole dictionary into the bundle.
 */

export type Locale = "ar" | "en";

export type SocialLinks = {
  instagram: string;
  x: string;
  linkedin: string;
  tiktok: string;
  youtube: string;
  behance: string;
  facebook: string;
};

export type SiteSettings = {
  nameAr: string;
  nameEn: string;
  legalName: string;
  url: string;
  email: string;
  phoneDisplay: string;
  phoneHref: string;
  whatsapp: string;
  country: string;
  addressAr: string;
  addressEn: string;
  campaignMin: number;
  campaignMax: number;
  logoUrl: string;
  heroImage: string;
  ogImage: string;
  favicon: string;
  keywordsAr: string[];
  keywordsEn: string[];
  social: SocialLinks;
};

export type FeatureFlags = {
  work: boolean;
  clients: boolean;
  team: boolean;
  journal: boolean;
};

export type MediaItem = {
  id: string;
  url: string;
  name: string;
  type: string;
  size: number;
  createdAt: string;
  provider: "blob" | "cloudinary" | "local";
};

export type WorkItem = {
  id: string;
  titleAr: string;
  titleEn: string;
  categoryAr: string;
  categoryEn: string;
  descriptionAr: string;
  descriptionEn: string;
  image: string;
  href: string;
  year: string;
};

export type ClientItem = {
  id: string;
  name: string;
  logo: string;
  url: string;
};

export type TeamItem = {
  id: string;
  nameAr: string;
  nameEn: string;
  roleAr: string;
  roleEn: string;
  bioAr: string;
  bioEn: string;
  image: string;
};

export type JournalItem = {
  id: string;
  titleAr: string;
  titleEn: string;
  excerptAr: string;
  excerptEn: string;
  bodyAr: string;
  bodyEn: string;
  image: string;
  date: string;
  href: string;
};

export type HiddenData = {
  work: WorkItem[];
  clients: ClientItem[];
  team: TeamItem[];
  journal: JournalItem[];
};
