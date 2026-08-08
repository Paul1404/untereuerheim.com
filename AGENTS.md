# Repository guidance

This is the canonical instruction file for this repository. Claude Code loads it through
`CLAUDE.md`.

## Start here

- Inspect branch, upstream divergence, status, and diff before editing.
- Preserve pre-existing changes and keep unrelated work out of the patch.
- Use the repository's existing runtime, package manager, framework, and deployment model.
- Do not refactor an existing project into the preferred new-project stack unless explicitly requested.
- Verify current documentation before changing version-dependent dependencies or hosting behavior.

## Project

This is the static editorial website for Untereuerheim.

It uses Astro, Tailwind CSS, Bun, static HTML output, a small Bun server, Docker, and Railway. It has no CMS or database.

## Project rules

- Use Bun and preserve `bun.lock`.
- Keep historical claims specific, sourced, and distinguish verified facts from inference.
- Preserve the editorial chronicle design, static output, accessibility, and reduced-motion behavior.
- Keep browser JavaScript small and purposeful.
- Verify image licensing, source metadata, attribution, and responsive behavior.

## Commands

- `bun run check`: Astro validation
- `bun run test`: tests
- `bun run build`: production build

## Verification

Run the relevant checks and exercise the affected workflow, endpoint, or generated artifact.
State clearly when authenticated, database, deployment, or live verification was not possible.

## Maintaining instructions

Update `AGENTS.md` when verified, durable repository behavior changes. Keep it concise and
move detailed explanations into `docs/`. Keep `CLAUDE.md` as the compatibility import
unless Claude-specific guidance is genuinely required.
