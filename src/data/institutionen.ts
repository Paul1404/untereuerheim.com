import type { ImageMetadata } from "astro";
import instSv from "../assets/images/inst-sv.jpg";
import instSchlossmuehle from "../assets/images/inst-schlossmuehle.jpg";
import instStGallus from "../assets/images/inst-st-gallus.jpg";
import instMainsteg from "../assets/images/mainsteg-untereuerheim.jpg";
import instBuecherei from "../assets/images/katholische-buecherei-uheim.jpeg";
import instKriegerdenkmal from "../assets/images/kriegerdenkmal-uheim.jpeg";

export type Institution = {
  name: string;
  slug: string;
  section: "vereine" | "kirche" | "orte" | "institutionen";
  type: "SportsOrganization" | "LocalBusiness" | "Church" | "Library" | "Organization" | "Cemetery";
  meta: string;
  description: string;
  profile: string;
  href: string;
  hrefLabel: string;
  image: ImageMetadata;
  imageAlt: string;
  title: string;
  seoDescription: string;
  facts: { label: string; value: string }[];
  relatedSearches: string[];
  schema?: Record<string, unknown>;
};

export const institutionen: Institution[] = [
  {
    name: "SV 1945 Untereuerheim",
    slug: "sv-untereuerheim",
    section: "vereine",
    type: "SportsOrganization",
    meta: "Sportverein. Gegründet 1945.",
    description:
      "Sportverein mit Abteilungen für Fußball, Gymnastik und Tischtennis. Vereinsheim und Sommerfest am Eurumer Waldspielplatz.",
    profile:
      "Der SV 1945 Untereuerheim gehört zu den zentralen Vereinen im Ort. Die lokale Profilseite bündelt die Einordnung zum Verein in Untereuerheim und verweist auf die offizielle Website des Sportvereins.",
    href: "https://sv-untereuerheim.de",
    hrefLabel: "sv-untereuerheim.de",
    image: instSv,
    imageAlt: "Eingang zum Eurumer Waldspielplatz mit Biergarten des SV Untereuerheim.",
    title: "SV Untereuerheim | Sportverein in Untereuerheim",
    seoDescription:
      "SV 1945 Untereuerheim: lokales Profil zum Sportverein in Untereuerheim mit Fußball, Gymnastik, Tischtennis, Waldspielplatz und Link zur offiziellen Vereinswebsite.",
    facts: [
      { label: "Name", value: "SV 1945 Untereuerheim" },
      { label: "Ort", value: "Untereuerheim, 97508 Grettstadt" },
      { label: "Gegründet", value: "1945" },
      { label: "Bereiche", value: "Fußball, Gymnastik, Tischtennis" },
    ],
    relatedSearches: ["SV Untereuerheim", "SV 1945 Untereuerheim", "Sportverein Untereuerheim"],
    schema: {
      foundingDate: "1945",
      sport: ["Fußball", "Gymnastik", "Tischtennis"],
    },
  },
  {
    name: "Schlossmühle Untereuerheim",
    slug: "schlossmuehle",
    section: "orte",
    type: "LocalBusiness",
    meta: "In Betrieb seit dem 16. Jahrhundert.",
    description:
      "Eine der ältesten arbeitenden Mühlen der Region. Verkauf von Mehl, Schrot und regionalen Erzeugnissen direkt ab Hof.",
    profile:
      "Die Schlossmühle ist ein historischer Ort in Untereuerheim und zugleich ein regionaler Betrieb. Diese Seite ordnet die Mühle im Ort ein und führt zur offiziellen Website.",
    href: "https://schlossmuehle-untereuerheim.de",
    hrefLabel: "schlossmuehle-untereuerheim.de",
    image: instSchlossmuehle,
    imageAlt: "Die Schlossmühle Untereuerheim, ein Fachwerkbau mit rotem Ziegeldach.",
    title: "Schlossmühle Untereuerheim | Historische Mühle im Ort",
    seoDescription:
      "Schlossmühle Untereuerheim: lokale Profilseite zur historischen Mühle in Untereuerheim mit regionalen Erzeugnissen und Link zur offiziellen Website.",
    facts: [
      { label: "Name", value: "Schlossmühle Untereuerheim" },
      { label: "Ort", value: "Untereuerheim, 97508 Grettstadt" },
      { label: "Geschichte", value: "Mühlbetrieb seit dem 16. Jahrhundert" },
      { label: "Angebot", value: "Mehl, Schrot und regionale Erzeugnisse" },
    ],
    relatedSearches: ["Schlossmühle Untereuerheim", "Schlossmuehle Untereuerheim", "Mühle Untereuerheim"],
  },
  {
    name: "St. Gallus Untereuerheim",
    slug: "st-gallus",
    section: "kirche",
    type: "Church",
    meta: "Kuratiekirche, Bistum Würzburg.",
    description:
      "Kuratie der Pfarreiengemeinschaft St. Christophorus im Mainbogen. Julius-Echter-Turm um 1600, neugotisches Langhaus aus der zweiten Hälfte des 19. Jahrhunderts, Taufstein 1592. Jährliche Wallfahrt nach Dettelbach.",
    profile:
      "St. Gallus ist die katholische Kirche in Untereuerheim. Die Seite beschreibt die lokale Bedeutung der Kuratiekirche und verweist auf die offizielle Website der Pfarrei.",
    href: "https://st-gallus-st-laurentius.com",
    hrefLabel: "st-gallus-st-laurentius.com",
    image: instStGallus,
    imageAlt: "Die Pfarrkirche St. Gallus mit ihrem spitzen Kirchturm und das Wegkreuz davor.",
    title: "St. Gallus Untereuerheim | Kirche und Pfarrei",
    seoDescription:
      "St. Gallus Untereuerheim: lokale Profilseite zur katholischen Kuratiekirche, Pfarrei, Geschichte, Wallfahrt und offizieller Website.",
    facts: [
      { label: "Name", value: "St. Gallus Untereuerheim" },
      { label: "Ort", value: "Untereuerheim, 97508 Grettstadt" },
      { label: "Bistum", value: "Bistum Würzburg" },
      { label: "Pfarrei", value: "Pfarreiengemeinschaft St. Christophorus im Mainbogen" },
    ],
    relatedSearches: ["St. Gallus Untereuerheim", "Pfarrei Untereuerheim", "Kirche Untereuerheim"],
  },
  {
    name: "KÖB Untereuerheim",
    slug: "koeb-untereuerheim",
    section: "institutionen",
    type: "Library",
    meta: "Katholische Öffentliche Bücherei.",
    description:
      "Ehrenamtlich geführte Bücherei der Pfarrei mit Romanen, Kinder- und Sachbüchern. Ausleihe kostenlos.",
    profile:
      "Die Katholische Öffentliche Bücherei Untereuerheim ist eine lokale Einrichtung der Pfarrei. Diese Seite hält die Bücherei im Ortskontext auffindbar.",
    href: "http://www.koeb.untereuerheim.de",
    hrefLabel: "koeb.untereuerheim.de",
    image: instBuecherei,
    imageAlt: "Eingangsschild der Katholischen Öffentlichen Bücherei Untereuerheim.",
    title: "KÖB Untereuerheim | Katholische Öffentliche Bücherei",
    seoDescription:
      "KÖB Untereuerheim: lokale Profilseite zur Katholischen Öffentlichen Bücherei in Untereuerheim mit Ausleihe, Pfarrei-Bezug und Website.",
    facts: [
      { label: "Name", value: "KÖB Untereuerheim" },
      { label: "Ort", value: "Untereuerheim, 97508 Grettstadt" },
      { label: "Art", value: "Katholische Öffentliche Bücherei" },
      { label: "Trägerschaft", value: "Pfarrei" },
    ],
    relatedSearches: ["KÖB Untereuerheim", "Bücherei Untereuerheim", "Katholische Öffentliche Bücherei Untereuerheim"],
  },
  {
    name: "Mainbrückenverein Untereuerheim",
    slug: "mainbrueckenverein",
    section: "vereine",
    type: "Organization",
    meta: "Gegründet 2011. Trägerverein der Mainquerung.",
    description:
      "Setzt sich für den Erhalt der historischen Mainquerung von Untereuerheim nach Gädheim und Ottendorf ein. Urkundlich als Fähre seit 1384 belegt, ab 1967 als Steg. Sammelt Spenden für die Zukunft der Mainquerung.",
    profile:
      "Der Mainbrückenverein ist eng mit der historischen Verbindung über den Main verbunden. Die Seite erklärt den Ortsbezug und verweist auf die Vereinswebsite.",
    href: "https://www.mainbrueckenvereinuntereuerheim.de",
    hrefLabel: "mainbrueckenvereinuntereuerheim.de",
    image: instMainsteg,
    imageAlt: "Der Mainsteg bei Untereuerheim, eine schlanke Bogenbrücke über den Main.",
    title: "Mainbrückenverein Untereuerheim | Mainsteg und Verein",
    seoDescription:
      "Mainbrückenverein Untereuerheim: lokales Profil zum Verein, Mainsteg, historischer Mainquerung nach Gädheim und Ottendorf und offizieller Website.",
    facts: [
      { label: "Name", value: "Mainbrückenverein Untereuerheim" },
      { label: "Ort", value: "Untereuerheim, Gädheim und Ottendorf" },
      { label: "Gegründet", value: "2011" },
      { label: "Thema", value: "Erhalt der Mainquerung" },
    ],
    relatedSearches: ["Mainbrückenverein Untereuerheim", "Mainsteg Untereuerheim", "Mainquerung Untereuerheim"],
    schema: {
      foundingDate: "2011",
    },
  },
  {
    name: "Kriegerdenkmal Untereuerheim",
    slug: "kriegerdenkmal",
    section: "orte",
    type: "Cemetery",
    meta: "Gedenkort für die Gefallenen.",
    description:
      "Denkmal zum Gedenken an die Gefallenen der beiden Weltkriege. Namen und Geschichte dokumentiert auf denkmalprojekt.org.",
    profile:
      "Das Kriegerdenkmal ist ein öffentlicher Erinnerungsort in Untereuerheim. Die Seite bündelt die lokale Einordnung und führt zur externen Dokumentation.",
    href: "http://www.denkmalprojekt.org/2017/untereuerheim_gde_grettstad_lk-schweinfurt_bay.html",
    hrefLabel: "denkmalprojekt.org",
    image: instKriegerdenkmal,
    imageAlt: "Das Kriegerdenkmal in Untereuerheim mit den Namen der Gefallenen.",
    title: "Kriegerdenkmal Untereuerheim | Gedenkort im Ort",
    seoDescription:
      "Kriegerdenkmal Untereuerheim: lokales Profil zum Gedenkort für die Gefallenen der Weltkriege mit Verweis zur externen Dokumentation.",
    facts: [
      { label: "Name", value: "Kriegerdenkmal Untereuerheim" },
      { label: "Ort", value: "Untereuerheim, 97508 Grettstadt" },
      { label: "Art", value: "Gedenkort" },
      { label: "Dokumentation", value: "denkmalprojekt.org" },
    ],
    relatedSearches: ["Kriegerdenkmal Untereuerheim", "Gefallene Untereuerheim", "Denkmal Untereuerheim"],
  },
];

export function getInstitutionPath(inst: Institution) {
  return `/${inst.section}/${inst.slug}/`;
}

export function getInstitutionBySectionAndSlug(section: string, slug: string) {
  return institutionen.find((inst) => inst.section === section && inst.slug === slug);
}
