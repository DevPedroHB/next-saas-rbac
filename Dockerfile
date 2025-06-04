#################################################################
#                          A u t h o r                         #
#   Based on Turborepo’s official Docker guide and examples.   #
#   Adapted for `next-saas-rbac` (api + web) in one container.  #
#################################################################

# 1) ───────────── BASE IMAGE ─────────────
# We’ll use Alpine for minimal size.  Install corepack/pnpm and global turbo.
FROM node:20-alpine AS base
# 1.1) Define PNPM home so that `pnpm install` works.
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
# 1.2) Install dependencies needed to run pnpm, Turbo, etc.
#      - libc6-compat is often needed for some Node binaries on Alpine.
RUN apk add --no-cache libc6-compat \
 && corepack enable \
 && corepack prepare pnpm@latest --activate \
 && pnpm install turbo -g

# 2) ───────────── DEPENDENCIES INSTALL ─────────────
# Copy only the files that determine top-level dependencies, so that Docker caches
# pnpm installation until any of these files changes.  This dramatically speeds up
# “docker build” on subsequent runs.
FROM base AS deps
WORKDIR /repo
# 2.1) Copy only root package.json, pnpm-workspace.yaml, turbo.json (so pnpm can install)
COPY package.json pnpm-workspace.yaml turbo.json ./
# 2.2) Copy all package.json files for apps (so pnpm knows about the workspaces)
COPY apps/api/package.json ./apps/api/
COPY apps/web/package.json ./apps/web/
# 2.3) If you have shared packages under “packages/”, copy their package.json too:
# COPY packages/some-shared-lib/package.json ./packages/some-shared-lib/
# 2.4) Now run pnpm install at monorepo root.
RUN pnpm install

#
# 3) ───────────── PRUNE + BUILD WEB ─────────────
# “turbo prune” will create a minimal “/repo/out-web” folder that contains:
#   - only the files needed to build `web`
#   - a generated package.json + lockfile + node_modules for web
# See: https://turborepo.com/docs/guides/tools/docker :contentReference[oaicite:0]{index=0}
FROM deps AS web-prune
WORKDIR /repo
# 3.1) Copy everything so turf prune sees all source files:
COPY . .
# 3.2) Prune down to just “web” + its transitive dependencies (for Docker):
RUN turbo prune --scope=web --docker

FROM base AS web-builder
WORKDIR /repo
# 3.3) Copy the pruned workspace, which lives in /repo/out/web:
COPY --from=web-prune /repo/out .
# 3.4) At this point, /repo/out/package.json & pnpm-lock.yaml reflect “web”+ deps.
WORKDIR /repo/out
RUN pnpm install --frozen-lockfile
# 3.5) Build the Next.js web app.
WORKDIR /repo/out
RUN pnpm --filter=web build
#    - “pnpm --filter=web build” will run “next build” inside apps/web :contentReference[oaicite:1]{index=1}
# 3.6) After this step, /repo/out/.next/ and /repo/out/public/ & node_modules (prod) exist.

#
# 4) ───────────── PRUNE + BUILD API ─────────────
# Similar to “web”, but for “api” (e.g. a Fastify or Express server)
FROM deps AS api-prune
WORKDIR /repo
COPY . .
RUN turbo prune --scope=api --docker

FROM base AS api-builder
WORKDIR /repo
# 4.1) Copy the pruned “api” workspace to /repo/out-api
COPY --from=api-prune /repo/out ./out-api
WORKDIR /repo/out-api
RUN pnpm install --frozen-lockfile
# 4.2) Build the API.  We assume “api” has a “build” script that compiles TypeScript:
RUN pnpm --filter=api build
#    - Now /repo/out-api/dist (or whatever your tsconfig points to) contains your compiled API.

#
# 5) ───────────── RUNTIME IMAGE ─────────────
# We assemble only what is needed to *run* both services: web & api.
FROM node:20-alpine AS runner
WORKDIR /app
# 5.1) Copy minimal Node runtime libs
RUN apk add --no-cache libc6-compat

# 5.2) Copy built “web” into /app/web
COPY --from=web-builder /repo/out/apps/web/.next ./web/.next
COPY --from=web-builder /repo/out/apps/web/public ./web/public
COPY --from=web-builder /repo/out/apps/web/package.json ./web/package.json
# If you have any “next.config.js” or other config in web, also copy that:
COPY apps/web/next.config.js ./web/next.config.js

# 5.3) Copy built “api” into /app/api
COPY --from=api-builder /repo/out-api/apps/api/dist ./api/dist
COPY --from=api-builder /repo/out-api/apps/api/package.json ./api/package.json
# If you need environment files or Prisma schemas at runtime, copy them too:
COPY apps/api/.env .env
COPY prisma/schema.prisma ./prisma/schema.prisma

# 5.4) Install ONLY production dependencies for web & api
WORKDIR /app/web
# Note: We copy web’s package.json, so:
RUN pnpm install --prod --frozen-lockfile
WORKDIR /app/api
RUN pnpm install --prod --frozen-lockfile

# 5.5) Install a simple process manager so we can run both at once:
#       We’ll use pm2-runtime, which is lightweight and can run two processes.
WORKDIR /app
RUN npm install -g pm2

# 5.6) Expose the ports your apps will run on:
#       - “web” (Next.js) defaults to 3000.
#       - “api” (Fastify/Express) we’ll run on 4000 in this example.
EXPOSE 3000 4000

# 5.7) → Final command: use pm2-runtime to run both “api” & “web” in prod mode.
#       We assume:
#         * In /app/api/package.json, there is a script “start” that does `node dist/index.js`.
#         * In /app/web/package.json, there is a script “start” that does `next start -p 3000`.
#       pm2-runtime can manage both with a JSON process file, or inline:
#
CMD ["pm2-runtime",
     "--no-autorestart",
     "--instances", "1",
     "--",
     "app/api/package.json", "start",
     "--name", "api",
     "--",
     "app/web/package.json", "start",
     "--name", "web"
    ]
