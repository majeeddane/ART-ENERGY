import { SectionsEditor } from "@/components/admin/SectionsEditor";
import { getSiteData } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AdminSectionsPage() {
  const data = await getSiteData();
  return <SectionsEditor initialData={data} />;
}
