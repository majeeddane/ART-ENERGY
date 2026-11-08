import type { ComponentPropsWithoutRef } from "react";
import type { LucideIcon } from "lucide-react";
import {
  ArrowDown as LArrowDown,
  ArrowLeft as LArrowLeft,
  ArrowRight as LArrowRight,
  ArrowUp as LArrowUp,
  ArrowUpRight as LArrowUpRight,
  BadgeCheck as LBadgeCheck,
  CalendarCheck as LCalendarCheck,
  Camera as LCamera,
  ChartColumn as LChartColumn,
  Check as LCheck,
  ChevronDown as LChevronDown,
  Clapperboard as LClapperboard,
  Eye as LEye,
  Film as LFilm,
  Globe as LGlobe,
  Image as LImage,
  Layers as LLayers,
  LayoutGrid as LLayoutGrid,
  Lightbulb as LLightbulb,
  Lock as LLock,
  Mail as LMail,
  Megaphone as LMegaphone,
  Menu as LMenu,
  Mic as LMic,
  Minus as LMinus,
  Moon as LMoon,
  MousePointer2 as LMousePointer2,
  MousePointerClick as LMousePointerClick,
  Newspaper as LNewspaper,
  Palette as LPalette,
  Pause as LPause,
  PenTool as LPenTool,
  Phone as LPhone,
  Play as LPlay,
  PlayCircle as LPlayCircle,
  Plus as LPlus,
  Quote as LQuote,
  Radio as LRadio,
  RefreshCw as LRefresh,
  Rocket as LRocket,
  Save as LSave,
  Search as LSearch,
  Send as LSend,
  Share2 as LShare2,
  Signal as LSignal,
  Sparkles as LSparkles,
  Sun as LSun,
  Target as LTarget,
  Trash2 as LTrash,
  TrendingUp as LTrendingUp,
  Upload as LUpload,
  Users as LUsers,
  Video as LVideo,
  Volume2 as LVolume,
  VolumeX as LVolumeOff,
  X as LX,
  User as LUser,
  Activity as LActivity,
  Clock as LClock,
  Zap as LZap,
} from "lucide-react";

type IconProps = Omit<ComponentPropsWithoutRef<"svg">, "ref"> & {
  size?: number;
  rotate?: number;
};

/** Wrap a Lucide icon so every mark shares the same optical weight. */
function make(Icon: LucideIcon) {
  function Wrapped({
    size = 20,
    rotate,
    style,
    strokeWidth = 1.75,
    ...props
  }: IconProps) {
    return (
      <Icon
        width={size}
        height={size}
        strokeWidth={strokeWidth}
        aria-hidden
        style={rotate ? { ...style, transform: `rotate(${rotate}deg)` } : style}
        {...props}
      />
    );
  }
  Wrapped.displayName = `Icon(${Icon.displayName ?? "mark"})`;
  return Wrapped;
}

export const ArrowDown = make(LArrowDown);
export const ArrowLeft = make(LArrowLeft);
export const ArrowRight = make(LArrowRight);
export const ArrowUp = make(LArrowUp);
export const ArrowUpRight = make(LArrowUpRight);
export const BadgeCheck = make(LBadgeCheck);
export const CalendarCheck = make(LCalendarCheck);
export const Camera = make(LCamera);
export const ChartColumn = make(LChartColumn);
export const Check = make(LCheck);
export const ChevronDown = make(LChevronDown);
export const Clapperboard = make(LClapperboard);
export const Close = make(LX);
export const Eye = make(LEye);
export const Film = make(LFilm);
export const Globe = make(LGlobe);
export const ImageIcon = make(LImage);
export const Layers = make(LLayers);
export const LayoutGrid = make(LLayoutGrid);
export const Lightbulb = make(LLightbulb);
export const Lock = make(LLock);
export const Mail = make(LMail);
export const Megaphone = make(LMegaphone);
export const Menu = make(LMenu);
export const Mic = make(LMic);
export const Minus = make(LMinus);
export const Moon = make(LMoon);
export const MousePointer2 = make(LMousePointer2);
export const MousePointerClick = make(LMousePointerClick);
export const Newspaper = make(LNewspaper);
export const Palette = make(LPalette);
export const Pause = make(LPause);
export const PenTool = make(LPenTool);
export const Phone = make(LPhone);
export const Play = make(LPlay);
export const PlayCircle = make(LPlayCircle);
export const Plus = make(LPlus);
export const Quote = make(LQuote);
export const Radio = make(LRadio);
export const Refresh = make(LRefresh);
export const Rocket = make(LRocket);
export const Save = make(LSave);
export const Search = make(LSearch);
export const Send = make(LSend);
export const Share2 = make(LShare2);
export const Signal = make(LSignal);
export const Sparkle = make(LSparkles);
export const Sun = make(LSun);
export const Target = make(LTarget);
export const Trash = make(LTrash);
export const TrendingUp = make(LTrendingUp);
export const Upload = make(LUpload);
export const Users = make(LUsers);
export const Video = make(LVideo);
export const Volume = make(LVolume);
export const VolumeOff = make(LVolumeOff);
export const User = make(LUser);
export const Activity = make(LActivity);
export const Clock = make(LClock);
export const Zap = make(LZap);

/** Brand glyphs stay hand-tuned for exact recognition. */
export function WhatsApp(props: IconProps) {
  const { size = 20, ...rest } = props;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
      {...rest}
    >
      <path d="M12.04 2C6.6 2 2.2 6.4 2.2 11.84c0 1.74.46 3.44 1.32 4.94L2 22l5.36-1.4a9.83 9.83 0 0 0 4.68 1.2h.01c5.43 0 9.84-4.4 9.84-9.84A9.78 9.78 0 0 0 19 4.88 9.78 9.78 0 0 0 12.04 2Zm0 18.02h-.01a8.2 8.2 0 0 1-4.17-1.14l-.3-.18-3.1.81.83-3.02-.2-.31a8.16 8.16 0 0 1-1.25-4.34 8.2 8.2 0 0 1 8.2-8.19c2.19 0 4.25.85 5.8 2.4a8.15 8.15 0 0 1 2.4 5.8 8.2 8.2 0 0 1-8.2 8.17Zm4.5-6.13c-.25-.13-1.46-.72-1.69-.8-.22-.08-.39-.13-.55.12-.16.25-.63.8-.77.96-.14.16-.28.18-.53.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.22-1.46-1.37-1.7-.14-.25-.01-.39.11-.51.11-.11.25-.28.37-.43.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.55-1.33-.76-1.82-.2-.48-.4-.42-.55-.42h-.47c-.16 0-.43.06-.65.31-.22.25-.85.83-.85 2.02s.87 2.34 1 2.5c.12.16 1.71 2.62 4.15 3.67.58.25 1.03.4 1.39.51.58.18 1.11.16 1.53.1.46-.07 1.46-.6 1.67-1.18.2-.58.2-1.07.14-1.18-.06-.1-.23-.16-.47-.28Z" />
    </svg>
  );
}
