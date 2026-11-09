/**
 * Typografisch woordmerk. Vervang desgewenst door het officiële logo-bestand
 * (bijv. /public/brand/logo-wit.svg) — houd dezelfde hoogte aan.
 */
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <svg width="30" height="30" viewBox="0 0 30 30" aria-hidden className="shrink-0">
        <rect width="30" height="30" rx="7" fill="var(--color-accent)" />
        {/* gestileerde weg met middenstreep */}
        <path d="M9 26 13.2 4h3.6L21 26" fill="none" stroke="#0d0e0f" strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M15 8.5v3.2M15 15v3.4M15 21.6v3" stroke="#0d0e0f" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
      <span className="flex flex-col leading-none">
        <span className="font-display text-[1.15rem] font-extrabold tracking-[-0.02em] [font-stretch:118%]">
          CONSTRUCTION
        </span>
        <span className="mt-[3px] font-mono text-[0.56rem] uppercase tracking-[0.22em] opacity-70">
          Redesign
        </span>
      </span>
    </span>
  );
}
