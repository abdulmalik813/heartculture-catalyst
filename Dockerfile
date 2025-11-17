FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm with specific version for consistency
RUN corepack enable && corepack prepare pnpm@9.12.3 --activate

# Copy dependency files
COPY package.json pnpm-lock.yaml ./
COPY scripts ./scripts
COPY src/app/(frontend)/theme.css ./src/app/(frontend)/theme.css

# Use pnpm store for better caching
RUN --mount=type=cache,id=pnpm,target=/root/.local/share/pnpm/store \
    pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@9.12.3 --activate

# Declare build arguments
ARG NEXT_PUBLIC_SERVER_URL
ARG PAYLOAD_SECRET
ARG DATABASE_URI
ARG S3_ACCESS_KEY_ID
ARG S3_BUCKET
ARG S3_ENDPOINT
ARG S3_REGION
ARG S3_SECRET_ACCESS_KEY

# Set environment variables for build
ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL \
    PAYLOAD_SECRET=$PAYLOAD_SECRET \
    DATABASE_URI=$DATABASE_URI \
    S3_ACCESS_KEY_ID=$S3_ACCESS_KEY_ID \
    S3_BUCKET=$S3_BUCKET \
    S3_ENDPOINT=$S3_ENDPOINT \
    S3_REGION=$S3_REGION \
    S3_SECRET_ACCESS_KEY=$S3_SECRET_ACCESS_KEY \
    NEXT_TELEMETRY_DISABLED=1

# Copy dependencies
COPY --from=deps /app/node_modules ./node_modules

# Copy source files (order matters for caching)
COPY package.json pnpm-lock.yaml ./
COPY next.config.* ./
COPY tsconfig.json ./
COPY public ./public
COPY src ./src

# Build with caching
RUN --mount=type=cache,id=next-cache,target=/app/.next/cache \
    pnpm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

# Install curl for health checks - combine with other setup
RUN apk add --no-cache curl && \
    addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    PORT=3000

# Copy environment variables to runtime
ARG NEXT_PUBLIC_SERVER_URL
ARG PAYLOAD_SECRET
ARG DATABASE_URI
ARG S3_ACCESS_KEY_ID
ARG S3_BUCKET
ARG S3_ENDPOINT
ARG S3_REGION
ARG S3_SECRET_ACCESS_KEY

ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL \
    PAYLOAD_SECRET=$PAYLOAD_SECRET \
    DATABASE_URI=$DATABASE_URI \
    S3_ACCESS_KEY_ID=$S3_ACCESS_KEY_ID \
    S3_BUCKET=$S3_BUCKET \
    S3_ENDPOINT=$S3_ENDPOINT \
    S3_REGION=$S3_REGION \
    S3_SECRET_ACCESS_KEY=$S3_SECRET_ACCESS_KEY

# Copy public folder if it exists
COPY --from=builder --chown=nextjs:nodejs /app/public ./public

# Automatically leverage output traces to reduce image size
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

# server.js is created by next build from the standalone output
CMD ["node", "server.js"]