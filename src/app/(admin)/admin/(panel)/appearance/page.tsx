import { getSiteData } from "@/lib/store";
import { AppearanceManager } from "@/components/admin/AppearanceManager";

export const dynamic = "force-dynamic";

export default async function AdminAppearancePage() {
  const data = await getSiteData();
  return <AppearanceManager initialData={data} />;
}
