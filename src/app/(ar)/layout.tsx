import "../globals.css";
import type { ReactNode } from "react";
import { RootDocument, rootMetadata } from "@/components/layout/RootDocument";
import { getSiteData } from "@/lib/store";

export const revalidate = 3600;
export { viewport } from "@/components/layout/RootDocument";

export async function generateMetadata() {
  const data = await getSiteData();
  return rootMetadata("ar", data);
}

export default async function ArabicLayout({
  children,
}: {
  children: ReactNode;
}) {
  const data = await getSiteData();
  return (
    <RootDocument locale="ar" data={data}>
      {children}
    </RootDocument>
  );
}
