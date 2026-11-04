import "../globals.css";
import "../admin.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "لوحة تحكم ART ENERGY",
  description: "إدارة محتوى موقع ارت إنيرجي.",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl" data-theme="light">
      <body className="admin-body font-arabic">{children}</body>
    </html>
  );
}
