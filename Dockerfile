ARG BUN_VERSION=1.3.11
ARG NODE_VERSION=22.12.0

# ---------- builder: install everything, build ----------
FROM oven/bun:${BUN_VERSION}-alpine AS builder
WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

# ---------- prod-deps: production-only node_modules ----------
FROM oven/bun:${BUN_VERSION}-alpine AS prod-deps
WORKDIR /app
COPY package.json bun.lock* ./
RUN bun install --production --frozen-lockfile

# ---------- runner: minimal Node runtime, copy built output ----------
FROM node:${NODE_VERSION}-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321

RUN addgroup -S app && adduser -S app -G app

COPY --from=prod-deps --chown=app:app /app/node_modules ./node_modules
COPY --from=builder  --chown=app:app /app/dist          ./dist
COPY --from=builder  --chown=app:app /app/package.json  ./package.json

USER app
EXPOSE 4321

CMD ["node", "dist/server/entry.mjs"]
