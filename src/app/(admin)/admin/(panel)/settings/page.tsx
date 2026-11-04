import { SettingsEditor } from "@/components/admin/SettingsEditor";
import { getSiteData } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const data = await getSiteData();
  return <SettingsEditor initialData={data} />;
}
