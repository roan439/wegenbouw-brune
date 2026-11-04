import type { ServiceIconName } from "@/content/services";

const paths: Record<ServiceIconName, React.ReactNode> = {
  road: (
    <>
      <path d="M10 44 20 4M38 44 28 4" />
      <path d="M24 8v5M24 19v6M24 31v7" />
    </>
  ),
  paving: (
    <>
      <path d="M4 14h16v8H4zM20 14h12v8H20zM32 14h12v8H32zM4 22h10v8H4zM14 22h16v8H14zM30 22h14v8H30zM4 30h16v8H4zM20 30h12v8H20zM32 30h12v8H32z" />
    </>
  ),
  ground: (
    <>
      <path d="M4 18h40" />
      <path d="M4 26h40M4 34h40" strokeDasharray="3 4" />
      <path d="M4 42h40" />
      <path d="M14 18c0-6 4-10 10-10s10 4 10 10" />
    </>
  ),
  sewer: (
    <>
      <circle cx="24" cy="24" r="16" />
      <circle cx="24" cy="24" r="9" />
      <path d="M4 24h4M40 24h4" />
    </>
  ),
  asphalt: (
    <>
      <path d="M4 34h40" />
      <rect x="8" y="14" width="22" height="12" rx="2" />
      <circle cx="13" cy="30" r="4" />
      <circle cx="34" cy="28" r="6" />
      <path d="M30 20h6v2" />
    </>
  ),
  concrete: (
    <>
      <path d="M6 40h36M10 40V20l14-10 14 10v20" />
      <path d="M18 40V28h12v12" />
    </>
  ),
  rebuild: (
    <>
      <path d="M8 24a16 16 0 0 1 28-10.6M40 24a16 16 0 0 1-28 10.6" />
      <path d="M36 6v8h-8M12 42v-8h8" />
    </>
  ),
  maintenance: (
    <>
      <path d="M30 6a10 10 0 0 0-9 14L6 35l7 7 15-15a10 10 0 0 0 14-9l-6 6-6-2-2-6z" />
    </>
  ),
};

export default function ServiceIcon({ name, className = "" }: { name: ServiceIconName; className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      {paths[name]}
    </svg>
  );
}
