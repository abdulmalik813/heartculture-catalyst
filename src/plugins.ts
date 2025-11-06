import { payloadCloudPlugin } from '@payloadcms/payload-cloud'
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { Plugin, Block } from 'payload'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { Page } from '@/payload-types'
import { getServerSideURL } from '@/lib/get-url'
import { s3Storage } from '@payloadcms/storage-s3'
import { revalidateRedirects } from '@/hooks/revalidate-redirects'
import { TimeBlock } from '@/fields/time'
import { defaultLexical } from '@/fields/lexical-field'
import { S3 } from './constants/init'

const generateTitle: GenerateTitle<Page> = async ({ doc, req }) => {
  const settings = await req.payload.findGlobal({
    slug: 'settings',
  })

  const title = settings?.appTitle || ''
  return doc?.title ? `${doc.title} | ${title}` : title
}

const generateURL: GenerateURL<Page> = ({ doc }) => {
  const url = getServerSideURL()

  return doc?.slug ? `${url}/${doc.slug}` : url
}

export const plugins: Plugin[] = [
  redirectsPlugin({
    collections: ['pages'],
    overrides: {
      // @ts-expect-error - This is a valid override, mapped fields don't resolve to the same type
      fields: ({ defaultFields }) => {
        return defaultFields.map((field) => {
          if ('name' in field && field.name === 'from') {
            return {
              ...field,
              admin: {
                description: 'You will need to rebuild the website when changing this field.',
              },
            }
          }
          return field
        })
      },
      hooks: {
        afterChange: [revalidateRedirects],
      },
    },
  }),
  seoPlugin({
    generateTitle,
    generateURL,
  }),
  formBuilderPlugin({
    fields: {
      payment: false,
      state: false,
      country: false,
      date: true,
      time: TimeBlock,
    },
    formOverrides: {
      fields: ({ defaultFields }) => {
        return [
          ...defaultFields.map((field) => {
            if ('name' in field && field.name === 'confirmationMessage') {
              return {
                ...field,
                editor: defaultLexical(),
              }
            }
            return field
          }),
        ]
      },
    },
  }),
  s3Storage({
    collections: {
      media: {
        prefix: 'app',
        signedDownloads: {
          shouldUseSignedURL: ({ filename }) => {
            return filename.endsWith('.mp4')
          },
        },
      },
    },
    bucket: S3.BUCKET,
    clientUploads: true,
    config: {
      forcePathStyle: true,
      credentials: {
        accessKeyId: S3.ACCESS_KEY_ID,
        secretAccessKey: S3.SECRET_ACCESS_KEY,
      },
      region: S3.REGION,
      endpoint: S3.ENDPOINT,
    },
  }),
  payloadCloudPlugin(),
]
