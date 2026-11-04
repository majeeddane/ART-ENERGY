import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { getSiteData, uploadsKind } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const data = await getSiteData();
  return <MediaLibrary initialMedia={data.media} uploads={uploadsKind()} />;
}
