import Reveal from "@/components/ui/Reveal";
import { clients, site } from "@/content/site";

const pillars = [
  {
    title: "Vakmanschap",
    text: "Ervaren stratenmakers, machinisten en grondwerkers die hun vak verstaan — met hoogwaardige materialen en oog voor detail.",
  },
  {
    title: "Betrouwbaarheid",
    text: "Wij doen wat we beloven. Transparant werken en afspraken nakomen, ook als het werk ’s nachts of onder tijdsdruk moet.",
  },
  {
    title: "Efficiënte uitvoering",
    text: "Dynamisch en flexibel: dankzij ons eigen wagen- en machinepark en eigen voorraad schakelen we snel, ook bij ad-hoc situaties.",
  },
  {
    title: "Heldere communicatie",
    text: "Verbinden staat centraal. Korte lijnen met de opdrachtgever en duidelijke informatie voor bewoners en weggebruikers.",
  },
  {
    title: "Kwaliteit",
    text: `Continu verbeteren en innoveren, ${site.certifications.join(" en ")} gecertificeerd. Kwaliteit die je ziet — en die je jarenlang niet hoeft te zien.`,
  },
];

const facts = [
  { k: "Specialisme", v: "GWW & infra" },
  { k: "Machinepark", v: "In eigen beheer" },
  { k: "Werkgebied", v: site.region },
  { k: "Gecertificeerd", v: site.certifications.join(" · ") },
];

export default function Why() {
  return (
    <section id="waarom-ons" aria-labelledby="waarom-titel" className="relative overflow-hidden bg-concrete-light text-ink">
      <div className="shell py-24 sm:py-32 lg:py-40">
        <div className="grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-5">
            <p className="eyebrow flex items-center gap-3 text-ink/55">
              <span className="text-accent-deep">05</span>
              <span className="inline-block h-px w-10 bg-ink/15" />
              Waarom kiezen voor ons?
            </p>
            <h2 id="waarom-titel" className="display mt-5 text-[clamp(2.3rem,5.6vw,5rem)]">
              Een partner die <span className="text-accent-deep">doorpakt.</span>
            </h2>
            <p className="mt-6 max-w-md text-[1.06rem] leading-relaxed text-ink/70">
              Gemeenten en bedrijven kiezen voor {site.name} omdat ze weten wat ze krijgen: meedenken vooraf, strakke uitvoering
              en een aanspreekpunt dat bereikbaar blijft.
            </p>

            <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-ink/10 bg-ink/10">
              {facts.map((f) => (
                <div key={f.k} className="bg-concrete-light p-5">
                  <dt className="eyebrow text-ink/50">{f.k}</dt>
                  <dd className="mt-2 font-display text-xl font-extrabold leading-tight tracking-tight">{f.v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>

          <div className="lg:col-span-7 lg:pl-8">
            <ol className="border-t border-ink/15">
              {pillars.map((p, i) => (
                <li key={p.title} className="border-b border-ink/15">
                  <Reveal delay={i * 0.06} y={18} className="group grid gap-3 py-7 sm:grid-cols-[4rem_1fr_1.4fr] sm:items-baseline sm:gap-6">
                    <span className="font-mono text-sm text-accent-deep">{String(i + 1).padStart(2, "0")}</span>
                    <h3 className="font-display text-2xl font-extrabold tracking-tight transition-transform duration-500 [font-stretch:110%] group-hover:translate-x-1">
                      {p.title}
                    </h3>
                    <p className="leading-relaxed text-ink/70">{p.text}</p>
                  </Reveal>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* Referenties */}
      <div className="border-t border-ink/10 bg-paper py-10" aria-labelledby="referenties-titel">
        <div className="shell flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-12">
          <p id="referenties-titel" className="eyebrow shrink-0 text-ink/55">
            Wij werken voor
          </p>
          <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)]">
            <ul className="flex w-max animate-[marquee_38s_linear_infinite] gap-12 motion-reduce:animate-none motion-reduce:flex-wrap">
              {[...clients, ...clients].map((c, i) => (
                <li
                  key={`${c}-${i}`}
                  aria-hidden={i >= clients.length ? true : undefined}
                  className="whitespace-nowrap font-display text-xl font-extrabold tracking-tight text-ink/45 [font-stretch:112%]"
                >
                  {c}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
