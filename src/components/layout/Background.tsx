/*
 * Global ambient backdrop. A single fixed layer sits behind every section so
 * there are no hard cuts between them — the dark base (#0A0A0F) is washed with
 * slow-drifting purple radial "blobs" plus a hairline grid and a vignette.
 * Purely decorative and transform-animated, so it stays cheap on the GPU.
 */
export const Background = () => {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Dark base wash with a faint top-down purple tint */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,rgba(148,30,254,0.10),transparent_55%)]" />

      {/* Drifting gradient-mesh blobs — different sizes, positions, tempos */}
      <div className="animate-drift-a absolute top-[-10%] -left-[15%] h-[55vw] w-[55vw] rounded-full bg-[radial-gradient(circle,rgba(148,30,254,0.16),transparent_70%)] blur-[120px]" />
      <div className="animate-drift-b absolute top-[25%] right-[-20%] h-[60vw] w-[60vw] rounded-full bg-[radial-gradient(circle,rgba(179,102,255,0.12),transparent_70%)] blur-[130px]" />
      <div className="animate-drift-c absolute bottom-[-15%] left-[10%] h-[50vw] w-[50vw] rounded-full bg-[radial-gradient(circle,rgba(148,30,254,0.10),transparent_70%)] blur-[120px]" />

      {/* Hairline grid texture */}
      <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(100%_100%_at_50%_0%,black,transparent_75%)] opacity-60" />

      {/* Edge vignette to focus the eye toward center content */}
      <div className="absolute inset-0 bg-[radial-gradient(120%_120%_at_50%_50%,transparent_55%,rgba(5,5,8,0.7))]" />
    </div>
  );
};
