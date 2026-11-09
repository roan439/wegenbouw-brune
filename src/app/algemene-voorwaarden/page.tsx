import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Algemene voorwaarden",
  description: `Algemene voorwaarden en beleidsdocumenten van ${site.name}.`,
  alternates: { canonical: "/algemene-voorwaarden" },
};

export default function VoorwaardenPage() {
  return (
    <LegalPage eyebrow="Juridisch" title="Algemene voorwaarden">
      <p>
        Op alle aanbiedingen, opdrachten en overeenkomsten van {site.name} zijn algemene voorwaarden van toepassing.
        Wilt u de voorwaarden ontvangen? Mail naar <a href={`mailto:${site.email}`}>{site.email}</a>, dan sturen wij
        ze u toe.
      </p>
    </LegalPage>
  );
}
