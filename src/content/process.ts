/** Werkwijze — de opbouw van een weg, van voorbereiding tot oplevering. */
export type ProcessStep = {
  id: string;
  number: string;
  title: string;
  kicker: string;
  body: string;
};

export const processSteps: ProcessStep[] = [
  {
    id: "voorbereiding",
    number: "01",
    title: "Voorbereiding",
    kicker: "Advies & meedenken",
    body:
      "Een project begint met zorgvuldige voorbereiding. We denken mee over ontwerp, materialen en fasering, stemmen af met opdrachtgever en omgeving en regelen — via onze zusterbedrijven — de verkeersmaatregelen.",
  },
  {
    id: "ontgraven",
    number: "02",
    title: "Ontgraven",
    kicker: "Grondwerk",
    body:
      "Oude verharding en grond worden verwijderd met ons eigen machinepark. Zo ontstaat ruimte voor riolering, kabels en leidingen en een nieuwe, goed opgebouwde ondergrond.",
  },
  {
    id: "fundering",
    number: "03",
    title: "Fundering",
    kicker: "Riolering & draagkracht",
    body:
      "Riolering en aansluitingen worden aangelegd en gecontroleerd. Daarna volgen de zandbaan en funderingslaag, laag voor laag verdicht voor een draagkrachtige ondergrond zonder verzakkingen.",
  },
  {
    id: "bestraten",
    number: "04",
    title: "Bestraten & asfalteren",
    kicker: "Vakmanschap",
    body:
      "Banden worden gesteld, waarna onze stratenmakers de elementenverharding strak leggen of het asfalt wordt aangebracht. Afwatering, kolken en details krijgen dezelfde zorg.",
  },
  {
    id: "oplevering",
    number: "05",
    title: "Oplevering",
    kicker: "En daarna: onderhoud",
    body:
      "We leveren schoon en volgens afspraak op, met een heldere overdracht. Ook na oplevering blijven we beschikbaar voor onderhoud en herstel.",
  },
];
