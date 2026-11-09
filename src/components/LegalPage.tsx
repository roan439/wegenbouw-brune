export default function LegalPage({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <main id="inhoud" className="bg-paper text-ink">
      <div className="shell max-w-4xl pb-24 pt-36 sm:pb-32 sm:pt-44">
        <p className="eyebrow text-ink/55">{eyebrow}</p>
        <h1 className="display mt-4 text-[clamp(2.4rem,6vw,4.6rem)]">{title}</h1>
        <div className="mt-10 grid gap-6 text-[1.06rem] leading-relaxed text-ink/75 [&_a]:font-semibold [&_a]:text-ink [&_a]:underline [&_a]:decoration-accent [&_a]:underline-offset-4 [&_h2]:mt-6 [&_h2]:font-display [&_h2]:text-2xl [&_h2]:font-extrabold [&_h2]:tracking-tight [&_h2]:text-ink">
          {children}
        </div>
      </div>
    </main>
  );
}
