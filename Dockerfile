ARG BUN_VERSION=1.3.11

FROM oven/bun:${BUN_VERSION}-alpine AS builder
WORKDIR /app

COPY package.json bun.lock* ./
RUN bun install --frozen-lockfile

COPY . .
RUN bun run build

FROM oven/bun:${BUN_VERSION}-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV HOST=0.0.0.0
ENV PORT=4321

RUN addgroup -S app && adduser -S app -G app

COPY --from=builder --chown=app:app /app/dist      ./dist
COPY --from=builder --chown=app:app /app/server.ts ./server.ts

USER app
EXPOSE 4321

CMD ["bun", "run", "server.ts"]
