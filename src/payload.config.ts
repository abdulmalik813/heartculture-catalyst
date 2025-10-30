import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig, PayloadRequest, TaskConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { Users } from '@/collections/users'
import { Media } from '@/collections/media'
import { Pages } from '@/collections/pages'
import { Styles } from '@/collections/styles'
import { getServerSideURL } from '@/lib/get-url'
import { schedulePublish } from '@/jobs/schedule-publish'
import { resendAdapter } from '@payloadcms/email-resend'
import { plugins } from '@/plugins'
import { defaultLexical } from '@/fields/lexical-field'
import { Icons } from '@/collections/icons'
const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
    timezones: {
      supportedTimezones: [
        {
          label: 'America/Halifax',
          value: 'America/Halifax',
        },
      ],
      defaultTimezone: 'America/Halifax',
    },
    user: Users.slug,
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
    components: {
      afterNavLinks: [
        '/components/admin/invalidate-cache#CacheInvalidationButton', 
        '/components/admin/theme-picker#ThemePicker'
      ],
    },
  },
  email: resendAdapter({
    defaultFromAddress: 'noreply@noreply.com',
    defaultFromName: 'No Reply',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
  collections: [Users, Media, Styles, Pages, Icons],
  cors: [getServerSideURL()].filter(Boolean),
  editor: defaultLexical(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URI || '',
    },
  }),
  sharp,
  plugins: [...plugins],
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        if (req.user) return true
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${process.env.CRON_SECRET}`
      },
    },
    tasks: [schedulePublish as TaskConfig<'schedulePublish'>],
  },
})
