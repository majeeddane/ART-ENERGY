import { getSiteData } from "@/lib/store";
import { ServiceManager } from "@/components/admin/ServiceManager";

export const dynamic = "force-dynamic";

export default async function AdminServicesPage() {
  const data = await getSiteData();
  return <ServiceManager initialData={data} />;
}
