import ContactForm from "./ContactForm";
import Reveal from "@/components/ui/Reveal";
import { site } from "@/content/site";

const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
  `${site.name}, ${site.address.street}, ${site.address.postalCode} ${site.address.city}`,
)}`;

export default function Contact() {
  return (
    <section id="contact" aria-labelledby="contact-titel" className="grain relative overflow-hidden bg-ink py-24 sm:py-32 lg:py-40">
      <div
        aria-hidden
        className="absolute -right-40 top-0 size-[40rem] rounded-full bg-accent/10 blur-[120px]"
      />
      <div className="shell relative grid gap-14 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <p className="eyebrow flex items-center gap-3 text-white/60">
            <span className="text-accent">06</span>
            <span className="inline-block h-px w-10 bg-white/15" />
            Contact en offerte aanvragen
          </p>
          <h2 id="contact-titel" className="display mt-5 text-[clamp(2.3rem,5.6vw,5rem)]">
            Laten we uw project <span className="text-accent">bespreken.</span>
          </h2>
          <p className="mt-6 max-w-md text-[1.06rem] leading-relaxed text-white/70">
            Gemeente, aannemer, bedrijf of particulier: vertel ons wat er moet gebeuren. Wij denken mee en maken een
            heldere offerte op maat.
          </p>

          <div className="mt-12 grid gap-px overflow-hidden rounded-2xl border border-white/10 bg-white/10">
            <ContactRow label="Bel ons" value={site.phone.display} href={site.phone.href} />
            <ContactRow label="Mail ons" value={site.email} href={`mailto:${site.email}`} />
            <ContactRow
              label="Bezoekadres"
              value={
                <span>
                  {site.address.street}
                  <br />
                  {site.address.postalCode} {site.address.city}
                </span>
              }
              href={mapsUrl}
              external
            />
          </div>
          <p className="mt-6 text-sm text-white/45">
            KvK {site.kvk} · BTW {site.btw}
          </p>
        </Reveal>

        <Reveal delay={0.1} className="lg:col-span-7">
          <ContactForm />
        </Reveal>
      </div>
    </section>
  );
}

function ContactRow({
  label,
  value,
  href,
  external,
}: {
  label: string;
  value: React.ReactNode;
  href: string;
  external?: boolean;
}) {
  return (
    <div className="bg-ink">
      <a
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="group flex items-center justify-between gap-6 p-5 transition-colors hover:bg-white/[0.04] sm:p-6"
      >
        <span>
          <span className="eyebrow block text-white/45">{label}</span>
          <span className="mt-1.5 block text-lg font-semibold">{value}</span>
        </span>
        <span
          aria-hidden
          className="grid size-10 shrink-0 place-items-center rounded-full border border-white/15 transition-all duration-300 group-hover:border-accent group-hover:bg-accent group-hover:text-ink"
        >
          ↗
        </span>
      </a>
    </div>
  );
}
