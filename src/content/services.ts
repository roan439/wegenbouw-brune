/**
 * Werkzaamheden — demo-inhoud voor Construction Redesign.
 * `icon` verwijst naar een lijn-icoon in components/ui/ServiceIcon.tsx.
 */
export type ServiceIconName =
  | "road"
  | "paving"
  | "ground"
  | "sewer"
  | "asphalt"
  | "concrete"
  | "rebuild"
  | "maintenance";

export type Service = {
  id: string;
  title: string;
  icon: ServiceIconName;
  lead: string;
  body: string;
  points: string[];
};

export const services: Service[] = [
  {
    id: "wegenbouw",
    title: "Wegenbouw & infrastructuur",
    icon: "road",
    lead: "Boven- en ondergrondse infrastructuur die mobiliteit verbetert en gemeenschappen verbindt.",
    body:
      "Van woonstraat tot bedrijventerrein: wij realiseren wegen, parkeervoorzieningen en verkeersvoorzieningen van ontwerp-advies tot oplevering. Voor verkeersmaatregelen werken we met onze eigen verkeersafdeling.",
    points: ["Wegen en parkeerterreinen", "Bushaltes en voetpaden", "Verkeersmaatregelen via zusterbedrijven"],
  },
  {
    id: "straatwerk",
    title: "Straatwerken",
    icon: "paving",
    lead: "Aanleg, herstel en onderhoud van straten, trottoirs en andere bestrate oppervlakken.",
    body:
      "Onze ervaren stratenmakers leggen elementenverharding, natuursteen en gebakken klinkers strak en duurzaam — afgestemd op de omgeving en het gebruik.",
    points: ["Elementenverharding en klinkers", "Natuursteen en gebakken straatbakstenen", "Trottoirs, pleinen en inritten"],
  },
  {
    id: "grondwerk",
    title: "Grondwerk",
    icon: "ground",
    lead: "Het fundament onder woningen, wegen, bruggen en andere infrastructuur.",
    body:
      "Wij verbeteren het draagvermogen van de bodem en zorgen voor de juiste gelaagdheid en verdichting, zodat verzakkingen worden voorkomen. Ook bodemsanering behoort tot onze werkzaamheden.",
    points: ["Ontgraven en ophogen", "Verdichten en funderingslagen", "Bodemsanering"],
  },
  {
    id: "riolering",
    title: "Riolering",
    icon: "sewer",
    lead: "Woningen en bedrijven correct aangesloten op het hoofdriool.",
    body:
      "Een juiste aansluiting voorkomt verstoppingen en lekkages. Tijdens de aanleg wordt regelmatig gecontroleerd en we werken hoofdzakelijk met duurzame PVC-materialen. Ook watermanagement en infiltratievoorzieningen horen bij ons vak.",
    points: ["Huis- en bedrijfsaansluitingen", "Watermanagement en infiltratie", "Controle tijdens aanleg"],
  },
  {
    id: "asfaltering",
    title: "Asfaltering",
    icon: "asphalt",
    lead: "Een glad, veilig en duurzaam wegdek voor wegen en parkeerterreinen.",
    body:
      "Asfalteren vraagt om kennis van asfaltmengsels en vakkundige bediening van zwaar materieel. Zo leveren wij een egaal en veilig oppervlak op.",
    points: ["Wegen en parkeerplaatsen", "Vervangen van deklagen", "Kennis van asfaltmengsels"],
  },
  {
    id: "beton",
    title: "Betonwerken & vloeistofdicht",
    icon: "concrete",
    lead: "Betonwerken en vloeistofdichte verharding of -beton voor bedrijfsterreinen.",
    body:
      "Voor bedrijven waar bodembescherming vereist is, leggen wij vloeistofdichte verhardingen en betonvoorzieningen aan, naast reguliere betonwerken in de openbare ruimte.",
    points: ["Vloeistofdichte verharding", "Vloeistofdicht beton", "Betonwerken openbare ruimte"],
  },
  {
    id: "herinrichting",
    title: "Reconstructie & herinrichting",
    icon: "rebuild",
    lead: "Complete straten en buurten opnieuw ingericht — gefaseerd en met oog voor bewoners.",
    body:
      "Rijbanen versmallen, asfalt vervangen, bestrating vernieuwen en nieuwe boomvakken aanleggen: wij voeren herinrichtingen gefaseerd uit, met omleidingen en heldere bewonersinformatie.",
    points: ["Rijbanen, trottoirs en boomvakken", "Gefaseerde uitvoering", "Bewonerscommunicatie"],
  },
  {
    id: "onderhoud",
    title: "Onderhoud",
    icon: "maintenance",
    lead: "Snel schakelen bij herstel en onderhoud, dankzij een eigen machinepark en voorraad.",
    body:
      "Advies, uitvoering én onderhoud. Door ons uitgebreide eigen wagen- en machinepark kunnen we snel reageren op ad-hoc situaties en houden we uw infrastructuur in topconditie.",
    points: ["Herstel van bestrating", "Ad-hoc inzet", "Eigen wagen- en machinepark"],
  },
];
