# syntax=docker/dockerfile:1

ARG NODE_VERSION=22

# ---------- 1. Dependencies ----------
FROM node:${NODE_VERSION}-slim AS deps
WORKDIR /app
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# prisma folder first, in case a postinstall script runs `prisma generate`
COPY package.json package-lock.json* ./
COPY prisma ./prisma
COPY prisma.config.* ./
RUN npm ci

# ---------- 2. Source + Prisma client (shared by builder and migrator) ----------
FROM deps AS source
WORKDIR /app
COPY . .

# Dummy value so `prisma generate` never fails. Real value is used at runtime.
ARG DATABASE_URL="postgresql://user:pass@localhost:5432/flowxcore"
ENV DATABASE_URL=${DATABASE_URL}
RUN npx prisma generate

# ---------- 3. Migrator (one-shot: prisma migrate deploy) ----------
FROM source AS migrator
CMD ["npx", "prisma", "migrate", "deploy"]

# ---------- 4. Next build ----------
FROM source AS builder

# Add every NEXT_PUBLIC_* variable you use here (they are baked in at build time)
ARG NEXT_PUBLIC_APP_URL
ENV NEXT_PUBLIC_APP_URL=${NEXT_PUBLIC_APP_URL}

# Optional: Sentry source map upload
ARG SENTRY_AUTH_TOKEN
ENV SENTRY_AUTH_TOKEN=${SENTRY_AUTH_TOKEN}

ENV NEXT_TELEMETRY_DISABLED=1

# Placeholders ONLY for the build step (modules that create SDK clients at import
# time need a value while Next collects page data). They are not stored in the
# image; real values come from .env at runtime. Add more here if another
# "Missing API key"-style error appears.
RUN RESEND_API_KEY=re_build_placeholder \
    ENCRYPTION_KEY=build_placeholder_secret \
    npm run build

# ---------- 5. Runner ----------
FROM node:${NODE_VERSION}-slim AS runner
WORKDIR /app
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN groupadd --system --gid 1001 nodejs \
    && useradd --system --uid 1001 --gid nodejs nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]