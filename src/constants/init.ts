// Database
export const DATABASE_URI = process.env.DATABASE_URI!

// Storage
export const S3 = {
  BUCKET: process.env.S3_BUCKET!,
  REGION: process.env.S3_REGION!,
  ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID!,
  SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY!,
  ENDPOINT: process.env.S3_ENDPOINT!,
}

// Payload
export const PAYLOAD = {
  SECRET: process.env.PAYLOAD_SECRET!,
  PREVIEW: process.env.PREVIEW_SECRET!,
}

// Tailwind Generator
export const TAILWIND_GENERATOR = process.env.TAILWIND_GENERATOR!

// Environment
export const ENVRIONMMENT = process.env.NODE_ENV

// Email
export const EMAIL = {
  FROM_ADDRESS: 'noreply@nighttechservices.com',
  FROM_NAME: 'No Reply',
  // SMTP
  SMTP_HOST: process.env.SMTP_HOST!,
  SMTP_PORT: Number(process.env.SMTP_PORT || 587),
  SMTP_USER: process.env.SMTP_USER!,
  SMTP_PASS: process.env.SMTP_PASS!,
  SMTP_SECURE: process.env.SMTP_SECURE === 'true',
}

// Cron
export const CRON_SECRET = process.env.CRON_SECRET!

// Timezone
export const TIMEZONES = {
  SUPPORTED_TIMEZONES: [
    {
      label: 'America/Halifax',
      value: 'America/Halifax',
    },
  ],
  DEFAULT_TIMEZONE: 'America/Halifax',
}

// App data
export const APP_URL = process.env.NEXT_PUBLIC_SERVER_URL!
