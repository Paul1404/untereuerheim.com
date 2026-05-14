# untereuerheim.com

The village website for Untereuerheim, a Kirchdorf of around four hundred people on the Main in Lower Franconia.

## Stack

- Astro 6 with View Transitions, Content Collections, and image optimization
- Tailwind CSS v4
- Bun runtime
- Node adapter for SSR plus prerendered home page
- Railway via Dockerfile

## Local development

```bash
bun install
bun run dev
```

Open http://localhost:4321.

## Build and run

```bash
bun run build
node dist/server/entry.mjs
```

## Favicon set

The SVG in `public/favicon.svg` is the source of truth. Generate every PNG and the ICO from it:

```bash
bun run icons
```

## Adding a Chronik entry

Drop a Markdown file into `src/content/chronik/`. Frontmatter:

```yaml
---
year: 1880
sortKey: 1880
title: Kurze Überschrift
description: Ein Satz, der das Ereignis beschreibt.
---
```

`sortKey` is a numeric sort field, so entries like `"16. Jh."` can still be placed correctly on the timeline.

## Deployment

Railway. The platform detects `Dockerfile` automatically. `railway.toml` wires up the `/health` healthcheck. Set the domain in the Railway dashboard.

See `.env.example` for environment variables.

## Health

`GET /health` returns `{"status":"ok"}` with HTTP 200.
