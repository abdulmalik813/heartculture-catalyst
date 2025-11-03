import { revalidateSettings } from '@/hooks/revalidate-globals'
import { generatePreviewPath } from '@/lib/generate-preview-path'
import { GlobalConfig } from 'payload'

export const Settings: GlobalConfig = {
  slug: 'settings',
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
          label: 'Theme',
          fields: [
            {
              type: 'row',
              fields: [
                {
                  name: 'theme',
                  type: 'textarea',
                  label: 'Theme',
                  required: true,
                  admin: {
                    rows: 20,
                  },
                },
              ],
            },
          ],
        },
      ],
    },
  ],
  hooks: {
    afterChange: [revalidateSettings],
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
