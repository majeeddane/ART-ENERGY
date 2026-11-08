import { getSiteData } from "@/lib/store";
import { AboutManager } from "@/components/admin/AboutManager";

export const dynamic = "force-dynamic";

export default async function AdminAboutPage() {
  const data = await getSiteData();
  return <AboutManager initialData={data} />;
}
