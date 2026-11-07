"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { BrandMark } from "@/components/brand/Logo";
import { Icon3D } from "@/components/ui/Icon3D";
import {
  BadgeCheck,
  ChartColumn,
  Clapperboard,
  Film,
  LayoutGrid,
  Lightbulb,
  Palette,
  Play,
  Rocket,
  Target,
  Users,
} from "@/components/ui/Icons";

const brand = {
  teal: "#139CAA",
  cyan: "#3DC1C5",
  yellow: "#F2E04E",
  orange: "#D1A246",
  deep: "#0B2730",
  deepBg: "#04181E",
  ink: "#07262F",
  paper: "#F7F2E9",
  bone: "#FBF8F1",
  sand: "#E9E1D2",
  line: "#DED5C4",
  textMuted: "#6A7D80",
};

const fadeUp = {
  initial: { opacity: 0, y: 18 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-12%" },
  transition: { duration: 0.6, ease: [0.2, 0, 0, 1] as const },
};

const stagger = (i: number) => ({
  ...fadeUp,
  transition: { ...fadeUp.transition, delay: 0.1 + i * 0.05 },
});

type Icon3DName = Parameters<typeof Icon3D>[0]["name"];

/* ---------------- أيقونات مخصصة بسيطة ---------------- */

function LogoMark({ size = 20, color = brand.teal }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="3" y="3" width="18" height="18" rx="4" />
      <path d="M7 7l10 10" />
      <circle cx="9" cy="9" r="2" fill={color} />
    </svg>
  );
}

function TypeScale({ size = 20, color = brand.teal }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M4 6h4M4 10h6M4 14h3M18 6v12M6 18h12" />
    </svg>
  );
}

function VoiceTone({ size = 20, color = brand.teal }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M1 9c0 2 1 3 3 3h2c2 0 3-1 3-3V7c0-2-1-3-3-3H4c-2 0-3 1-3 3zM13 17c0 2 1 3 3 3h2c2 0 3-1 3-3v-4c0-2-1-3-3-3h-2c-2 0-3 1-3 3z" />
    </svg>
  );
}

function RealWorld({ size = 20, color = brand.teal }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <rect x="2" y="3" width="20" height="14" rx="2" />
      <line x1="8" y1="21" x2="16" y2="21" />
      <line x1="12" y1="17" x2="12" y2="21" />
    </svg>
  );
}

/* ---------------- بطاقة واحدة ---------------- */

interface BrandCardProps {
  number: string;
  title: string;
  desc: string;
  icon: React.ComponentType<{ size?: number; color?: string }>;
  color: string;
  index: number;
}

function BrandCard({ number, title, desc, icon: Icon, color, index }: BrandCardProps) {
  return (
    <motion.div
      {...stagger(index)}
      className="group relative overflow-hidden rounded-2xl border border-line bg-white shadow-sm transition-all duration-500 hover:shadow-xl hover:border-[#139CAA]/50"
    >
      <div className="absolute -inset-4 bg-gradient-to-tr from-[#139CAA]/20 via-transparent to-[#F2E04E]/20 blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" aria-hidden />

      <div className="relative z-10 p-6">
        <div className="flex items-start gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-line shadow-sm">
            <Icon size={22} color={color} />
          </div>
          <span className={`flex h-8 w-8 items-center justify-center rounded-full text-[10px] font-grotesk font-bold border`} dir="ltr" style={{ borderColor: color + "33", color }}>
            {number}
          </span>
        </div>

        <h3 className="mb-2 text-xl font-bold text-[#0B2730] leading-none">{title}</h3>
        <p className="text-base text-[#6A7D80] leading-6">{desc}</p>
      </div>

      <div
        className={`absolute left-0 bottom-0 h-1 w-full bg-gradient-to-r from-transparent via-${color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
        aria-hidden
      />
    </motion.div>
  );
}

/* ---------------- 02 — الهوية المرئية ---------------- */

export function BrandPreview() {
  return (
    <div className="relative h-full min-h-[320px] overflow-hidden rounded-panel border border-line bg-[#FBF8F1] p-6">
      <div className="absolute -end-8 -top-8 h-44 w-44 rounded-full bg-[#F2E04E]/40 blur-2xl" />
      <div className="relative flex items-center justify-between mb-8">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#F2E04E] text-[#0B2730] text-[10px] font-grotesk font-bold" dir="ltr">
          02
        </span>
        <Palette size={20} className="text-[#0B2730]/80" />
      </div>

      <h3 className="mb-4 text-2xl font-bold tracking-tight">نظام الهوية المرئية</h3>
      <p className="mb-8 text-base text-[#6A7D80] leading-7 max-w-md">
        شعار، خط، لوحة ألوان، ونبرة صوت — كل عنصر يُصمّم ليعيش على أرض الواقع قبل الشاشة.
      </p>

      <div className="grid gap-4 md:grid-cols-3">
        <BrandCard
          index={0}
          number="01"
          title="الشعار"
          desc="العلامة البصرية الأساسية التي تُمثّل هوية ART ENERGY في كل تطبيق."
          icon={LogoMark}
          color={brand.teal}
        />
        <BrandCard
          index={1}
          number="02"
          title="الخط"
          desc="طباعة عربية وإنجليزية واضحة ومتوازنة تعزز قابلية القراءة والشخصية."
          icon={TypeScale}
          color={brand.cyan}
        />
        <BrandCard
          index={2}
          number="03"
          title="لوحة الألوان"
          desc="ألوان أساسية وثانوية مستوحاة من الطاقة والإبداع، مع تدرجات متناسقة."
          icon={Palette}
          color={brand.yellow}
        />
        <BrandCard
          index={3}
          number="04"
          title="نبرة الصوت"
          desc="لغة تواصل مهنية، دافئة، ومُلهمة تخاطب العميل بلغة النتائج والتأثير."
          icon={VoiceTone}
          color={brand.orange}
        />
        <BrandCard
          index={4}
          number="05"
          title="التطبيق على أرض الواقع"
          desc="الهوية تُطبّق على الأوراق، اللوحات، المنصات الرقمية، والوسائط كافة."
          icon={RealWorld}
          color={brand.deep}
        />
        <BrandCard
          index={5}
          number="06"
          title="دليل الاستخدام"
          desc="مرجع شامل لكيفية استخدام كل عنصر بشكل صحيح ومتسق في جميع القنوات."
          icon={BadgeCheck}
          color={brand.teal}
        />
      </div>

      <div className="mt-8 flex items-center justify-between rounded-lg border border-[#0B2730]/10 bg-white px-3 py-2.5">
        <span className="font-grotesk text-[8px] tracking-[0.2em] text-[#0B2730]/55" dir="ltr">
          PRIMARY / #139CAA
        </span>
        <div className="flex gap-1.5">
          <span className="h-3.5 w-3.5 rounded-full bg-[#139CAA]" />
          <span className="h-3.5 w-3.5 rounded-full bg-[#D1A246]" />
          <span className="h-3.5 w-3.5 rounded-full bg-[#F2E04E]" />
        </div>
      </div>

      <motion.div
        className="absolute -bottom-6 -left-2 h-20 w-20 rounded-full border-[4px] border-[#FBF8F1] bg-[#0B2730] shadow-lg"
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        aria-hidden
      >
        <BrandMark idPrefix="brand-badge" className="h-full w-full p-2" />
      </motion.div>
    </div>
  );
}

/* --------------------------------------------------------------
   01 — STRATEGY / LAB
   -------------------------------------------------------------- */
export function StrategyPreview() {
  return (
    <div className="relative h-full min-h-[320px] overflow-hidden rounded-panel border border-teal-100/60 bg-gradient-to-br from-teal-50 to-teal-100/50 p-6 text-[#0B2730]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(19,156,170,0.15),transparent_55%)]" />
      <div className="relative flex items-center justify-between mb-8">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#139CAA] text-white text-[10px] font-grotesk font-bold" dir="ltr">
          01
        </span>
        <Lightbulb size={20} className="text-[#139CAA]" />
      </div>

      <h3 className="mb-4 text-2xl font-bold tracking-tight">الاستراتيجية والكشف</h3>
      <p className="mb-6 text-base text-[#6A7D80] leading-7 max-w-md">
        نبدأ بالاستماع العميق للسوق، ثم نرسّم خارطة طريق تربط الهدف بالنتيجة
        بأقل مجهود وأعلى تأثير.
      </p>

      <div className="grid gap-3 md:grid-cols-3">
        {[
          { label: "تحليل السوق", value: "سوق الهدف" },
          { label: "الشخصية الاستراتيجية", value: "هوية العلامة" },
          { label: "مقياس الأثر", value: "KPI dashboard" },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            {...stagger(i)}
            className="rounded-lg border border-teal-200 bg-white p-4 shadow-sm"
          >
            <span className="block h-1 w-full rounded-sm bg-[#139CAA]/10 mb-2" />
            <div className="flex items-baseline gap-1">
              <span className="text-[10px] font-bold text-[#139CAA] uppercase tracking-wider" dir="ltr">
                {item.label}
              </span>
              <span className="text-sm font-medium text-[#0B2730]" dir="ltr">
                {item.value}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="absolute -right-6 -top-10 h-24 w-24 rounded-full border-4 border-[#139CAA]/30 animate-spin-reverse" aria-hidden />
      <div className="absolute left-4 bottom-4 h-12 w-12 rounded-full bg-[#F2E04E]/40 backdrop-blur" aria-hidden />
    </div>
  );
}

/* --------------------------------------------------------------
   03 — CONTENT / EDITORIAL
   -------------------------------------------------------------- */
export function ContentPreview() {
  return (
    <div className="relative h-full min-h-[320px] overflow-hidden rounded-panel border border-teal-100/40 bg-gradient-to-br from-teal-50/60 to-transparent p-6 text-[#0B2730]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(19,156,170,0.25),transparent_55%)]" />
      <div className="relative flex h-full items-center justify-center">
        <div className="relative h-[300px] w-[140px] rounded-2xl border border-teal-200 bg-white p-2 shadow-xl">
          <div className="absolute left-1/2 top-2 h-1 w-8 -translate-x-1/2 rounded-full bg-teal-200" />
          <div className="mt-4 h-full overflow-hidden rounded-xl bg-[#FBF8F1]">
            <div className="flex items-center gap-2 border-b border-black/5 px-2.5 py-2">
              <span className="h-5 w-5 rounded-full bg-[#139CAA]" />
              <span className="h-1.5 w-10 rounded-full bg-black/15" />
              <span className="ms-auto h-1.5 w-1.5 rounded-full bg-[#F28C28]" />
            </div>
            <div className="space-y-2 p-2">
              {[
                "bg-gradient-to-br from-[#139CAA] to-[#3DC1C5]",
                "bg-gradient-to-br from-[#D1A246] to-[#F2E04E]",
                "bg-gradient-to-br from-[#0B2730] to-[#0E4E59]",
              ].map((bg, i) => (
                <motion.div
                  key={bg}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.15 * i }}
                  className="overflow-hidden rounded-lg border border-black/5 bg-white"
                >
                  <div className={`h-14 w-full ${bg}`} />
                  <div className="space-y-1 p-1.5">
                    <span className="block h-1 w-3/4 rounded-full bg-black/15" />
                    <span className="block h-1 w-1/2 rounded-full bg-black/10" />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <span className="absolute -end-3 top-16 rounded-full bg-[#F2E04E] p-1.5 text-[#0B2730] shadow-lg">
            <Play size={10} />
          </span>
        </div>

        <div className="absolute -start-2 top-1/2 -translate-y-1/2 flex -translate-x-1/2 flex-col gap-2">
          {["+", "◇", "↗", "♥"].map((c, i) => (
            <motion.span
              key={c}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-white/40 bg-white/60 text-xs text-teal-600 backdrop-blur shadow-sm"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
            >
              {c}
            </motion.span>
          ))}
        </div>
      </div>
      <div className="absolute bottom-4 left-4 flex items-center gap-2 font-grotesk text-[8px] tracking-[0.22em] text-teal-600/80" dir="ltr">
        <Icon3D name="chart-up" size={16} />
        CONTENT / 03
      </div>
    </div>
  );
}

/* --------------------------------------------------------------
   04 — PRODUCTION / FILM
   -------------------------------------------------------------- */
export function ProductionPreview() {
  return (
    <div className="group relative h-full min-h-[320px] overflow-hidden rounded-panel bg-[#04181E] p-0">
      <Image
        src="/images/media-art.webp"
        alt=""
        fill
        sizes="(max-width: 1024px) 90vw, 460px"
        className="object-cover opacity-85 transition duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#04181E] via-[#04181E]/30 to-transparent" />
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="relative flex h-16 w-16 items-center justify-center rounded-full border border-white/40 bg-white/10 text-white backdrop-blur-md transition group-hover:scale-110 group-hover:bg-[#F2E04E] group-hover:text-[#0B2730]">
          <span className="absolute inset-0 animate-ping rounded-full border border-white/20 [animation-duration:3s]" />
          <Play size={20} className="ms-0.5" />
        </span>
      </div>
      <div className="absolute inset-x-0 top-0 flex items-center justify-between p-4 font-grotesk text-[8px] tracking-[0.22em] text-white/70" dir="ltr">
        <span>REC / 04</span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-[#F28C28]" /> 00:24
        </span>
      </div>
      <div className="absolute inset-x-0 bottom-0">
        <div className="film-strip h-5 w-full opacity-40" />
        <div className="flex items-center gap-2 bg-[#04181E]/90 px-4 py-3">
          <Play size={10} className="text-[#F2E04E]" />
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/15">
            <div className="h-full w-2/5 rounded-full bg-[#F2E04E]" />
          </div>
          <span className="font-grotesk text-[8px] tracking-[0.18em] text-white/50" dir="ltr">
            FILM / 04
          </span>
        </div>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------
   05 — PRINT / PAPER
   -------------------------------------------------------------- */
export function PrintPreview() {
  return (
    <div className="relative h-full min-h-[320px] overflow-hidden rounded-panel border border-line bg-[#E9E1D2] p-6">
      <div className="absolute inset-0 opacity-40" style={{ maskImage: "linear-gradient(to bottom, transparent 0%, black 40%)" }} />
      <div className="relative flex items-center justify-between mb-6">
        <span className="font-grotesk text-[9px] tracking-[0.26em] text-[#0B2730]/55" dir="ltr">
          PRINT / 05
        </span>
        <span className="font-grotesk text-[8px] tracking-[0.2em] text-[#0B2730]/70" dir="ltr">
          A4 — A5 — DL
        </span>
      </div>

      <div className="book relative mx-auto mt-6 h-[220px] w-[190px]">
        <div className="absolute inset-0 translate-x-3 translate-y-3 rounded-r-md rounded-l-sm bg-[#0B2730]/10" />
        <div className="absolute inset-0 overflow-hidden rounded-r-md rounded-l-sm border border-[#0B2730]/15 bg-[#0B2730] shadow-xl">
          <div className="flex h-full flex-col justify-between p-4 text-[#F7F2E9]">
            <span className="font-grotesk text-[7px] tracking-[0.26em] text-[#F2E04E]/80" dir="ltr">
              ART ENERGY
            </span>
            <div>
              <span className="block h-[2px] w-8 bg-[#D1A246]" />
              <p className="mt-2 font-grotesk text-lg font-semibold leading-none" dir="ltr">
                PROFILE
              </p>
              <p className="mt-1 font-grotesk text-[6px] uppercase tracking-[0.2em] text-white/50" dir="ltr">
                PRODUCTION & TECHNICAL CONSULTING
              </p>
            </div>
            <BrandMark idPrefix="print-cover" className="h-9 w-9" />
          </div>
        </div>
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="book-page absolute inset-y-1 start-0 w-full rounded-r-md border border-[#0B2730]/10 bg-[#FBF8F1] p-4 shadow-md"
            style={{ zIndex: 3 - i }}
          >
            <div className="space-y-2">
              <span className="block h-1 w-10 bg-[#D1A246]" />
              <span className="block h-1.5 w-3/4 bg-[#0B2730]/25" />
              <span className="block h-1 w-full bg-[#0B2730]/10" />
              <span className="block h-1 w-5/6 bg-[#0B2730]/10" />
              <div className="grid grid-cols-2 gap-1.5 pt-2">
                <span className="block h-12 rounded-sm bg-[#139CAA]/30" />
                <span className="block h-12 rounded-sm bg-[#D1A246]/40" />
              </div>
              <span className="block h-1 w-2/3 bg-[#0B2730]/10" />
              <span className="block h-1 w-1/2 bg-[#0B2730]/10" />
            </div>
          </div>
        ))}
      </div>

      <div className="relative mt-4 flex items-center justify-between text-[8px] font-medium uppercase tracking-[0.2em] text-[#0B2730]/70" dir="ltr">
        <span>BROCHURE</span>
        <span>CATALOGUE</span>
        <span>REPORT</span>
      </div>
    </div>
  );
}

/* --------------------------------------------------------------
   06 — CAMPAIGN / IMPACT
   -------------------------------------------------------------- */
export function CampaignPreview() {
  return (
    <div className="relative h-full min-h-[320px] overflow-hidden rounded-panel bg-[#07262F] p-6 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(209,162,70,0.18),transparent_60%)]" />
      <div className="relative flex items-center justify-between mb-6">
        <span className="font-grotesk text-[9px] tracking-[0.26em] text-[#F2E04E]/80" dir="ltr">
          CAMPAIGN / 06
        </span>
        <svg width={22} height={22} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[#F2E04E]">
          <path d="M5 3h4l2 16H5z" />
          <circle cx="9" cy="10" r="2" />
        </svg>
      </div>

      <div className="relative mt-4 h-[178px] overflow-hidden rounded-2xl border border-white/10">
        <Image
          src="/images/photos/campaign.webp"
          alt=""
          fill
          sizes="(max-width: 1024px) 90vw, 460px"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#04181E] via-[#04181E]/20 to-transparent" />
        <div className="absolute inset-x-3 bottom-3 flex items-center justify-between font-grotesk text-[8px] tracking-[0.24em]" dir="ltr">
          <span className="text-[#F2E04E]">IDEA</span>
          <span className="h-px flex-1 mx-3 bg-gradient-to-r from-[#3DC1C5]/70 via-[#D1A246]/60 to-[#F2E04E]/70" />
          <span className="text-white/70">IMPACT</span>
        </div>
      </div>

      <div className="relative mt-5 grid grid-cols-3 gap-2">
        {["PLAN", "LAUNCH", "SCALE"].map((label, i) => (
          <div
            key={label}
            className="rounded-lg border border-white/10 bg-white/[0.04] px-2 py-2.5 text-center"
            dir="ltr"
          >
            <span className="font-grotesk text-[7px] tracking-[0.18em] text-[#F2E04E]/70">
              0{i + 1}
            </span>
            <span className="mt-0.5 block font-grotesk text-[8px] tracking-[0.16em] text-white/65">
              {label}
            </span>
          </div>
        ))}
      </div>

      <div className="relative mt-5 flex h-7 items-end justify-center gap-1">
        {[14, 26, 10, 32, 18, 28, 12, 24, 16, 30, 8, 22].map((h, i) => (
          <motion.span
            key={i}
            className="w-1.5 rounded-sm bg-gradient-to-t from-[#139CAA] to-[#F2E04E]"
            animate={{ height: [h * 0.4, h, h * 0.6] }}
            transition={{ duration: 1.4 + i * 0.08, repeat: Infinity, ease: "easeInOut", delay: i * 0.05 }}
            style={{ height: h }}
          />
        ))}
      </div>
    </div>
  );
}

export const previews = [
  StrategyPreview,
  BrandPreview,
  ContentPreview,
  ProductionPreview,
  PrintPreview,
  CampaignPreview,
];
