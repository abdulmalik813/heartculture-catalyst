// App data

export const APP_ID = 'base-app'
export const APP_TITLE = 'A Base App'
export const APP_DESCRIPTION = 'A Base App for many stuff'
export const APP_URL = process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000'
export const DEFAULT_IMAGE_URL = '/logo.png'

// Database
export const DATABASE_URI = process.env.DATABASE_URI!

// Storage
export const S3 = {
  BUCKET: process.env.S3_BUCKET!,
  REGION: process.env.S3_REGION!,
  ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID!,
  SECRET_ACCESS_KEY: process.env.S3_SECRET_ACCESS_KEY!,
  ENDPOINT: process.env.S3_ENDPOINT!,
  PREFIX: APP_ID,
}

// Email
export const EMAIL = {
  FROM_ADDRESS: 'noreply@nighttechservices.com',
  FROM_NAME: 'No Reply',
  RESEND_API_KEY: process.env.RESEND_API_KEY!,
}

// Cron
export const CRON_SECRET = process.env.CRON_SECRET!

// Payload
export const PAYLOAD = {
  SECRET: process.env.PAYLOAD_SECRET!,
  PREVIEW: process.env.PREVIEW_SECRET!,
}

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

// OpenGraph
export const OPENGRAPH = {
  DEFAULT_IMAGE_URL: DEFAULT_IMAGE_URL,
  SITE_NAME: APP_TITLE,
  DEFAULT_DESCRIPTION: APP_DESCRIPTION,
  DEFAULT_TITLE: APP_TITLE,
}
