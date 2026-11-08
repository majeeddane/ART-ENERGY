import { getSiteData } from "@/lib/store";
import { CampaignManager } from "@/components/admin/CampaignManager";

export const dynamic = "force-dynamic";

export default async function AdminCampaignsPage() {
  const data = await getSiteData();
  return <CampaignManager initialData={data} />;
}
