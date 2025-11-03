import { postgresAdapter } from '@payloadcms/db-postgres'
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
import { CRON_SECRET, DATABASE_URI, EMAIL, PAYLOAD, TIMEZONES } from '@/constants/init'
import { Settings } from '@/globals/settings'
import { Fonts } from '@/collections/fonts'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    importMap: {
      baseDir: path.resolve(dirname),
    },
    timezones: {
      supportedTimezones: [...TIMEZONES.SUPPORTED_TIMEZONES],
      defaultTimezone: TIMEZONES.DEFAULT_TIMEZONE,
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
        '/components/admin/theme-picker#ThemePicker',
      ],
    },
  },
  email: resendAdapter({
    defaultFromAddress: EMAIL.FROM_ADDRESS,
    defaultFromName: EMAIL.FROM_NAME,
    apiKey: EMAIL.RESEND_API_KEY,
  }),
  collections: [Pages, Users, Media, Styles, Icons, Fonts],
  globals: [Settings],
  cors: [getServerSideURL()].filter(Boolean),
  editor: defaultLexical(),
  secret: PAYLOAD.SECRET,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: DATABASE_URI,
    },
  }),
  sharp,
  serverURL: getServerSideURL(),
  plugins: [...plugins],
  jobs: {
    access: {
      run: ({ req }: { req: PayloadRequest }): boolean => {
        if (req.user) return true
        const authHeader = req.headers.get('authorization')
        return authHeader === `Bearer ${CRON_SECRET}`
      },
    },
    tasks: [schedulePublish as TaskConfig<'schedulePublish'>],
  },
})
