import { getSiteData } from "@/lib/store";
import { PackageManager } from "@/components/admin/PackageManager";

export const dynamic = "force-dynamic";

export default async function AdminPackagesPage() {
  const data = await getSiteData();
  return <PackageManager initialData={data} />;
}
