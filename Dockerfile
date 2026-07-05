# One image: Node server serving the built client + WebSocket on one port
# (docs/ARCHITECTURE.md § Deployment). tsx runs TS directly in prod —
# deliberate M1 simplicity, no server build step.

FROM node:24-alpine AS base
ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable && corepack prepare pnpm@10.17.1 --activate
WORKDIR /app

FROM base AS build
# Workspace manifests first so the install layer caches across source edits.
COPY package.json pnpm-workspace.yaml tsconfig.base.json ./
COPY shared/package.json shared/
COPY server/package.json server/
COPY client/package.json client/
# No lockfile yet (M1) — let install resolve fresh.
RUN pnpm install --no-frozen-lockfile
COPY . .
RUN pnpm --filter client build

FROM base AS runtime
ENV NODE_ENV=production
# The whole workspace install comes along (tsx is the runtime here, and pnpm's
# per-package node_modules are symlinks into the root .pnpm store).
COPY --from=build /app/package.json /app/pnpm-workspace.yaml ./
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/shared ./shared
COPY --from=build /app/server ./server
# Static client at the path server/src/main.ts expects: /app/client/dist.
COPY --from=build /app/client/dist ./client/dist

EXPOSE 8787
WORKDIR /app/server
CMD ["./node_modules/.bin/tsx", "src/main.ts"]
