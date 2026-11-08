import { getSiteData } from "@/lib/store";
import { HeroManager } from "@/components/admin/HeroManager";

export const dynamic = "force-dynamic";

export default async function AdminHeroPage() {
  const data = await getSiteData();
  return <HeroManager initialData={data} />;
}
