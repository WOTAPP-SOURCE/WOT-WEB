import Image from "next/image";

/*
 * Footer brand logo. Sits on the right side of the footer (hidden on mobile),
 * bleeding slightly off the right page edge. Static transparent PNG — no mask,
 * blend mode, or playback logic needed; it sits cleanly on the dark footer.
 */

export const FooterVideo = () => {
  return (
    <div className="pointer-events-none absolute inset-y-0 -right-12 z-0 hidden w-2/5 items-center justify-center pb-32 md:flex">
      <div className="relative h-[85%] w-full">
        <Image
          src="/images/brand/logo-photoroom.png"
          alt=""
          aria-hidden="true"
          fill
          sizes="40vw"
          className="object-contain"
        />
      </div>
    </div>
  );
};
