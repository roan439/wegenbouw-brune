import type { Metadata } from "next";
import LegalPage from "@/components/LegalPage";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Privacyverklaring",
  description: `Hoe ${site.name} omgaat met uw persoonsgegevens.`,
  alternates: { canonical: "/privacyverklaring" },
};

export default function PrivacyPage() {
  return (
    <LegalPage eyebrow="Juridisch" title="Privacyverklaring">
      <p>
        {site.name} gaat zorgvuldig om met uw persoonsgegevens en houdt zich aan de Algemene Verordening
        Gegevensbescherming (AVG). Hieronder leest u hoe wij met uw gegevens omgaan.
      </p>
      <h2>Contactformulier</h2>
      <p>
        Gegevens die u via het offerteformulier op deze website verstuurt (naam, bedrijf, e-mailadres, telefoonnummer,
        projectlocatie en uw bericht) gebruiken wij uitsluitend om uw aanvraag te behandelen en contact met u op te
        nemen. Het formulier wordt beveiligd verzonden en per e-mail aan ons afgeleverd.
      </p>
      <h2>Cookies</h2>
      <p>
        Deze website plaatst geen tracking- of marketingcookies. Alleen technisch noodzakelijke opslag wordt gebruikt
        voor het goed functioneren van de site.
      </p>
      <h2>Vragen</h2>
      <p>
        Heeft u vragen over uw gegevens? Neem contact op via <a href={`mailto:${site.email}`}>{site.email}</a> of bel{" "}
        <a href={site.phone.href}>{site.phone.display}</a>.
      </p>
    </LegalPage>
  );
}
