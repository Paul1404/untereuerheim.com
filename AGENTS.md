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
- `bun run test` builds the site first, then exercises the real Bun server:
  internal pages, referenced assets (including CSS fonts and responsive images),
  missing-page responses, caching, and origin access protection.
- `SMOKE_ORIGIN_SECRET=<test secret> bun run test:smoke -- <base URL>` runs the
  same read-only checks against an already running test server. CI runs it
  against the production Docker image with an isolated test origin secret.
- `bun run build`: production build

## Verification

`main` requires a pull request with the `check` (GitHub Actions) and
`GitGuardian Security Checks` checks passing on an up-to-date branch. This also
applies to administrators; no second-person approval is required. Do not bypass
or temporarily disable protection to ship a change.

Run the relevant checks and exercise the affected workflow, endpoint, or generated artifact.
State clearly when authenticated, database, deployment, or live verification was not possible.

## Maintaining instructions

Update `AGENTS.md` when verified, durable repository behavior changes. Keep it concise and
move detailed explanations into `docs/`. Keep `CLAUDE.md` as the compatibility import
unless Claude-specific guidance is genuinely required.

## Analytics privacy

public/analytics-consent.js gates both Umami scripts behind an explicit choice.
Keep it consistent with the same asset in the other managed websites. Reject
and withdraw must stop requests, including beacon/keepalive sends. The loader
honors DNT/GPC, excludes query-bearing and authenticated routes, and strips
individual event data and titles. Server-side strict masking and replay limits
are owned by web-host-gitops analytics/websites.json. Never rely on recorder
data-mask-level attributes. Keep the site's privacy notice and providers aligned.

## Dependency audit gate

CI runs `bun audit` against the committed lockfile, including the build
dependencies used to generate the published site.
Do not replace the lockfile audit with an empty Dependabot PR queue or suppress
an advisory merely to make the gate pass.

## Main-only branch lifecycle and security reporting

`main` is the only retained local and remote branch for this active Railway
repository. Temporary PR branches are allowed only while work is in progress.
Keep required checks and branch protections; never bypass them to avoid a branch.
Before finishing, merge validated work, delete the remote and local task branches,
remove clean worktrees created for the task, and verify that only `main` remains
with `git ls-remote --heads origin` and `git for-each-ref refs/heads`.

If a task cannot safely merge, preserve commits in a verified Git bundle outside
the checkout and save staged, unstaged and untracked changes. Detach any retained
worktree before deleting its task branch, and report the unfinished work and
recovery location. Never discard unrelated changes, retain an `archive/` branch,
or modify an archived repository to satisfy cleanup. A later explicit owner
instruction can retain a branch.

Follow `SECURITY.md` for vulnerability reports. Keep reports private and omit
credentials, production records and personal data from public issues and commits.

## Production security gates

Railway waits for successful GitHub workflows on `main`. Keep an always-running
push workflow and do not cancel its main-branch runs. PR branch cleanup never
justifies bypassing CI. Public repositories also enforce CodeQL results on main.
Container security builds the production image and scans OS and library packages.
Retain the complete report. Fixable HIGH/CRITICAL findings block delivery;
upstream-unfixed findings remain visible and require explicit review. Do not add
blanket scanner ignores or weaken these gates to make a release pass.

Runtime APK security upgrades are keyed to `RAILWAY_GIT_COMMIT_SHA` so a new
release cannot reuse an outdated package-upgrade layer from Railway build cache.
Keep the commit build argument in the container scan workflow as well.
