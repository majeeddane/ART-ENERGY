"use client";

import { useEffect, useState } from "react";
import { WhatsApp } from "@/components/ui/Icons";
import { useDict, useSettings } from "@/components/providers/SiteDataProvider";
import { cn } from "@/lib/utils";
import type { Locale } from "@content/model";

export function FloatingWhatsApp({ locale }: { locale: Locale }) {
  const dict = useDict(locale);
  const settings = useSettings();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > window.innerHeight * 0.55);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const message =
    locale === "ar"
      ? "مرحبًا ART ENERGY، أرغب في مناقشة مشروع."
      : "Hello ART ENERGY, I would like to discuss a project.";

  return (
    <a
      href={`https://wa.me/${settings.whatsapp}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={dict.contact.whatsappCta}
      className={cn(
        "group fixed bottom-4 end-4 z-[95] flex items-center gap-2.5 transition-all duration-500 print:hidden sm:bottom-5 sm:end-5",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <span className="pointer-events-none hidden max-w-0 overflow-hidden whitespace-nowrap rounded-full bg-[#0B2730] px-0 py-2 text-[10px] font-semibold text-[#F7F2E9] opacity-0 shadow-lg transition-all duration-500 group-hover:max-w-[180px] group-hover:px-3.5 group-hover:opacity-100 lg:block">
        {dict.contact.whatsappCta}
      </span>
      <span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-[#062b18] shadow-[0_16px_40px_-16px_rgba(37,211,102,0.9)] transition duration-300 group-hover:scale-105 sm:h-14 sm:w-14">
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366]/35 [animation-duration:3s]" />
        <WhatsApp size={22} className="relative sm:h-[25px] sm:w-[25px]" />
      </span>
    </a>
  );
}
