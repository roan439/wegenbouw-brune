import Reveal from "./Reveal";

type Props = {
  index: string;
  eyebrow: string;
  title: React.ReactNode;
  intro?: React.ReactNode;
  id?: string;
  tone?: "dark" | "light";
};

export default function SectionHeading({ index, eyebrow, title, intro, id, tone = "dark" }: Props) {
  const muted = tone === "dark" ? "text-white/60" : "text-ink/60";
  const line = tone === "dark" ? "bg-white/15" : "bg-ink/15";
  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-12">
      <Reveal className="lg:col-span-7">
        <p className={`eyebrow flex items-center gap-3 ${muted}`}>
          <span className="text-accent">{index}</span>
          <span className={`inline-block h-px w-10 ${line}`} />
          {eyebrow}
        </p>
        <h2 id={id} className="display mt-5 text-[clamp(2.3rem,6vw,5.2rem)]">
          {title}
        </h2>
      </Reveal>
      {intro && (
        <Reveal delay={0.1} className="lg:col-span-5 lg:self-end">
          <div className={`max-w-xl text-[1.06rem] leading-relaxed ${tone === "dark" ? "text-white/70" : "text-ink/70"}`}>
            {intro}
          </div>
        </Reveal>
      )}
    </div>
  );
}
