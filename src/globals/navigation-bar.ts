import { navigation } from '@/fields/navigation'
import { revalidateHeader } from '@/hooks/revalidate-globals'
import { generatePreviewPath } from '@/lib/generate-preview-path'
import { GlobalConfig } from 'payload'

export const NavigationBar: GlobalConfig = {
  slug: 'navigationBar',
  dbName: 'navBar',
  access: {
    read: () => true,
  },
  admin: {
    livePreview: {
      url: ({ req }) =>
        generatePreviewPath({
          slug: 'home',
          collection: 'pages',
          req,
        }),
    },
    preview: (_, { req }) =>
      generatePreviewPath({
        slug: 'home',
        collection: 'pages',
        req,
      }),
  },

  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Navigation',
          fields: [
            {
              name: 'navigation',
              type: 'array',
              label: 'Navigation Links',
              fields: [navigation()],
            },
            {
              name: 'cta',
              type: 'array',
              label: 'CTA Links',
              maxRows: 2,
              fields: [navigation()],
            },
          ],
        },
        {
          label: 'Styles',
          fields: [
            {
              name: 'logoStyles',
              type: 'relationship',
              relationTo: 'styles',
              hasMany: true,
            },
            {
              name: 'useTitleWithLogo',
              type: 'checkbox',
            },
            {
              name: 'titleStyles',
              type: 'relationship',
              relationTo: 'styles',
              hasMany: true,
              admin: {
                condition: (_, data) => data?.useTitleWithLogo === true,
              },
            },
            {
              name: 'namePosition',
              type: 'select',
              options: [
                { label: 'Top', value: 'top' },
                { label: 'Bottom', value: 'bottom' },
                { label: 'Right', value: 'right' },
                { label: 'Left', value: 'left' },
              ],
              admin: {
                condition: (_, data) => data?.useTitleWithLogo === true,
              },
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100,
      },
      schedulePublish: true,
    },
  },
}
