import { ContentEditor } from "@/components/admin/ContentEditor";
import { getSiteData } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  const data = await getSiteData();
  return <ContentEditor initialData={data} />;
}
