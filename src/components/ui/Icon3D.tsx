import Image from "next/image";
import { cn } from "@/lib/utils";

export type Icon3DName =
  | "light-bulb"
  | "rocket"
  | "megaphone"
  | "bullseye"
  | "movie-camera"
  | "clapper-board"
  | "video-camera"
  | "camera"
  | "palette"
  | "bar-chart"
  | "pencil"
  | "eye"
  | "handshake"
  | "trophy"
  | "speech"
  | "envelope"
  | "telephone"
  | "microphone"
  | "film-frames"
  | "framed-picture"
  | "sparkles"
  | "star"
  | "briefcase"
  | "calendar"
  | "magnifier"
  | "chart-up"
  | "money-bag";

/**
 * A realistic 3D icon (Microsoft Fluent Emoji, MIT licence), served locally.
 * Rendered with next/image so it stays crisp and optimised.
 */
export function Icon3D({
  name,
  size = 48,
  className,
  alt = "",
  priority = false,
}: {
  name: Icon3DName;
  size?: number;
  className?: string;
  alt?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src={`/images/3d/${name}.webp`}
      alt={alt}
      width={size}
      height={size}
      priority={priority}
      className={cn("select-none object-contain", className)}
      style={{ width: size, height: size }}
      aria-hidden={alt ? undefined : true}
    />
  );
}
