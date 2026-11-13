# untereuerheim.com

Die Website für Untereuerheim, Ortsteil von Grettstadt im Landkreis Schweinfurt. Sie erzählt die Ortsgeschichte in einer Chronik und stellt Baudenkmäler und Institutionen vor.

Die Seiten werden mit Astro aus Markdown und Komponenten als HTML gebaut. Ein Bun-Server liefert sie aus; eine Datenbank oder ein CMS wird nicht benötigt.

## Lokal entwickeln

```sh
bun install --frozen-lockfile
bun run dev
```

Die Entwicklungsseite läuft unter <http://localhost:4321>. `bun run check` prüft Astro und TypeScript, `bun run test` baut die Website und führt die Tests aus. Mit `bun run build` und `bun run start` lässt sich der Produktionsserver lokal starten.

## Inhalte pflegen

### Chronik-Eintrag hinzufügen

Eine Markdown-Datei in `src/content/chronik/` ablegen:

```yaml
year: 1880
sortKey: 1880
title: Kurze Überschrift
description: Ein Satz, der beschreibt, was passiert ist.
image: "../../assets/images/optional-foto.jpg"
imageAlt: "Alt-Text für das Bild."
```

`sortKey` ist die Zahl, nach der einsortiert wird, auch bei unscharfen `year`-Angaben wie `"16. Jh."`. `image` und `imageAlt` sind optional.

### Bild hinzufügen

1. Datei nach `src/assets/images/` legen.
2. `bun run optimize-images` ausführen (kappt zu große Quellen auf 2500 px, JPEG Q82).
3. In der Astro-Komponente importieren und in `<Figure>` oder `<Image>` einsetzen. Astro erzeugt mehrere Größen, WebP und Lazy Loading automatisch.

### Wo welcher Inhalt liegt

| Bereich | Datei |
|---|---|
| Hero | `src/components/Hero.astro` |
| Der Ort (Eckdaten) | `src/components/DerOrt.astro` |
| Chronik | `src/content/chronik/*.md` |
| Institutionen | `src/components/Institutionen.astro` |
| Archiv (Baudenkmäler, Quellen) | `src/pages/archiv.astro` |
| Footer | `src/components/Footer.astro` |
| Impressum | `src/pages/impressum.astro` |
| Datenschutz | `src/pages/datenschutz.astro` |
| Design-Tokens und Klassen | `src/styles/global.css` |
| Meta, SEO, JSON-LD | `src/layouts/Base.astro` |


## Deployment

[vertex-images](https://github.com/Paul1404/vertex-images) baut und prüft das Containerimage. Fleet übernimmt den Digest und betreibt die Website auf Vertex RKE2. CloudFront liefert die Domain aus; der Ursprung ist durch einen Verifizierungsheader geschützt. Der Healthcheck liegt unter `/health.json`.

## Quellen

Die Belege für Chronik und Archiv stehen im [Archiv](https://untereuerheim.com/archiv). Kontaktmöglichkeiten stehen im Impressum.
