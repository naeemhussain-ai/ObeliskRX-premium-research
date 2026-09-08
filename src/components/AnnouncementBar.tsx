const MESSAGE = "Orders of $250 and more get free shipping";

export function AnnouncementBar() {
  // Repeat the message so the track always spans wider than the viewport;
  // the track is duplicated once below and animated by exactly -50% for a
  // seamless, endless right-to-left scroll.
  const items = Array.from({ length: 6 });

  return (
    <div className="fixed top-0 left-0 right-0 z-[60] flex h-[34px] items-center overflow-hidden bg-ink text-ink-foreground">
      <div className="marquee-track flex w-max shrink-0 items-center">
        {items.map((_, i) => (
          <span key={`a-${i}`} className="flex items-center px-6 text-xs font-semibold tracking-wide whitespace-nowrap">
            {MESSAGE}
            <span className="mx-6 text-primary">•</span>
          </span>
        ))}
        {items.map((_, i) => (
          <span key={`b-${i}`} className="flex items-center px-6 text-xs font-semibold tracking-wide whitespace-nowrap">
            {MESSAGE}
            <span className="mx-6 text-primary">•</span>
          </span>
        ))}
      </div>
    </div>
  );
}
