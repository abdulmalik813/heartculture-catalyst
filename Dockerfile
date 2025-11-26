FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml ./
COPY scripts ./scripts
COPY src/app/(frontend)/theme.css ./src/app/(frontend)/theme.css
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

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
ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL
ENV PAYLOAD_SECRET=$PAYLOAD_SECRET
ENV DATABASE_URI=$DATABASE_URI
ENV S3_ACCESS_KEY_ID=$S3_ACCESS_KEY_ID
ENV S3_BUCKET=$S3_BUCKET
ENV S3_ENDPOINT=$S3_ENDPOINT
ENV S3_REGION=$S3_REGION
ENV S3_SECRET_ACCESS_KEY=$S3_SECRET_ACCESS_KEY

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Disable Next.js telemetry
ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

# Install curl, wget, and CA certificates for HTTPS
RUN apk add --no-cache curl ca-certificates wget

# Download and add Cloudflare root certificate
RUN wget -O /usr/local/share/ca-certificates/cloudflare.crt https://developers.cloudflare.com/ssl/static/origin_ca_rsa_root.pem && \
    update-ca-certificates

# Tell Node.js to use system CA certificates
ENV NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-certificates.crt

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Copy environment variables to runtime
ARG NEXT_PUBLIC_SERVER_URL
ARG PAYLOAD_SECRET
ARG DATABASE_URI
ARG S3_ACCESS_KEY_ID
ARG S3_BUCKET
ARG S3_ENDPOINT
ARG S3_REGION
ARG S3_SECRET_ACCESS_KEY

ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL
ENV PAYLOAD_SECRET=$PAYLOAD_SECRET
ENV DATABASE_URI=$DATABASE_URI
ENV S3_ACCESS_KEY_ID=$S3_ACCESS_KEY_ID
ENV S3_BUCKET=$S3_BUCKET
ENV S3_ENDPOINT=$S3_ENDPOINT
ENV S3_REGION=$S3_REGION
ENV S3_SECRET_ACCESS_KEY=$S3_SECRET_ACCESS_KEY

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy public folder if it exists
COPY --from=builder /app/public ./public

# Set the correct permission for prerender cache
RUN mkdir .next
RUN chown nextjs:nodejs .next

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000

# server.js is created by next build from the standalone output
CMD ["node", "server.js"]