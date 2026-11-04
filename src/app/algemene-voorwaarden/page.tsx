import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Algemene voorwaarden",
  description: `Algemene voorwaarden en beleidsdocumenten van ${site.name}.`,
  alternates: { canonical: "/algemene-voorwaarden" },
};

const docs = [
  { title: "Algemene verkoop- en leveringsvoorwaarden", href: site.documents.verkoopvoorwaarden },
  { title: "Algemene inkoop- en onderaannemingsvoorwaarden", href: site.documents.inkoopvoorwaarden },
  { title: "Beleidsverklaring", href: site.documents.beleidsverklaring },
  { title: "Privacyverklaring", href: site.documents.privacy },
];

export default function VoorwaardenPage() {
  return (
    <LegalPage eyebrow="Juridisch" title="Algemene voorwaarden">
      <p>
        Op alle aanbiedingen, opdrachten en overeenkomsten van {site.name} zijn de onderstaande voorwaarden van
        toepassing. U kunt de documenten hier downloaden.
      </p>
      <ul className="grid gap-3">
        {docs.map((d) => (
          <li key={d.href}>
            <a
              href={d.href}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between gap-4 rounded-2xl border border-ink/10 bg-white p-5 !no-underline transition-colors hover:border-brune"
            >
              <span>{d.title}</span>
              <span className="eyebrow text-brune-deep">PDF ↗</span>
            </a>
          </li>
        ))}
      </ul>
    </LegalPage>
  );
}
