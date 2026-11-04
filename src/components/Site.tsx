"use client";

import { Preloader } from "@/components/Preloader";
import { Cursor } from "@/components/Cursor";
import { ScrollProgress } from "@/components/ScrollProgress";
import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { MarqueeBand } from "@/components/Marquee";
import { About } from "@/components/About";
import { Capabilities } from "@/components/Capabilities";
import { Services } from "@/components/Services";
import { Journey } from "@/components/Journey";
import { Packages } from "@/components/Packages";
import { Production } from "@/components/Production";
import { Campaigns } from "@/components/Campaigns";
import { WhyUs } from "@/components/WhyUs";
import { Contact } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { FloatingWhatsApp } from "@/components/FloatingWhatsApp";
import { HiddenSections } from "@/components/HiddenSections";
import { SmoothScroll } from "@/components/providers/SmoothScroll";
import { SoundProvider } from "@/components/providers/SoundProvider";
import { QuoteProvider } from "@/components/providers/QuoteProvider";
import { useDict } from "@/components/providers/SiteDataProvider";
import type { Locale } from "@content/model";

export function Site({ locale }: { locale: Locale }) {
  const dict = useDict(locale);

  return (
    <SoundProvider>
      <QuoteProvider locale={locale}>
        <SmoothScroll>
          <a href="#main" className="skip-link">
            {dict.ui.skipToContent}
          </a>

          <Preloader skipLabel={dict.ui.skip} />
          <Cursor discoverLabel={dict.ui.discover} />
          <ScrollProgress />
          <Navbar locale={locale} />

          <main id="main" tabIndex={-1} className="outline-none">
            <Hero locale={locale} />
            <MarqueeBand items={dict.hero.marquee} />
            <About locale={locale} />
            <Capabilities locale={locale} />
            <Services locale={locale} />
            <Journey locale={locale} />
            <Packages locale={locale} />
            <Production locale={locale} />
            <Campaigns locale={locale} />
            <WhyUs locale={locale} />
            <HiddenSections locale={locale} />
            <Contact locale={locale} />
          </main>

          <Footer locale={locale} />
          <FloatingWhatsApp locale={locale} />
        </SmoothScroll>
      </QuoteProvider>
    </SoundProvider>
  );
}
