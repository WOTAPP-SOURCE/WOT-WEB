import Image from "next/image";
import { cn } from "@/lib/utils";

interface PhoneFrameProps {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}

/*
 * A realistic phone frame drawn entirely in CSS (no frame image needed).
 * The app screenshot fills the inner screen.
 */
export const PhoneFrame = ({ src, alt, priority = false, className }: PhoneFrameProps) => {
  return (
    <div className={cn("relative mx-auto w-[260px] max-w-full sm:w-[300px]", className)}>
      {/* Glow halo behind the device */}
      <div className="glow-radial pointer-events-none absolute inset-0 -z-10 scale-125 blur-2xl" />

      {/* Device body */}
      <div className="relative rounded-[2.75rem] border border-border bg-gradient-to-b from-[#2a2a3a] to-[#101018] p-2.5 shadow-2xl shadow-black/60 ring-1 ring-white/5">
        {/* Side buttons */}
        <span className="absolute -left-[3px] top-28 h-12 w-[3px] rounded-l bg-[#2a2a3a]" />
        <span className="absolute -left-[3px] top-44 h-16 w-[3px] rounded-l bg-[#2a2a3a]" />
        <span className="absolute -right-[3px] top-36 h-20 w-[3px] rounded-r bg-[#2a2a3a]" />

        {/* Screen */}
        <div className="relative aspect-[9/19.5] overflow-hidden rounded-[2.2rem] bg-background">
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes="(max-width: 640px) 80vw, 300px"
            className="object-cover"
          />

          {/* Dynamic island / notch */}
          <div className="absolute left-1/2 top-2.5 z-10 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />
        </div>
      </div>
    </div>
  );
};
