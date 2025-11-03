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
          label: 'App Data',
          fields: [
            {
              name: 'appTitle',
              type: 'text',
              label: 'App Title',
              required: true,
            },
            {
              name: 'appDescription',
              type: 'textarea',
              label: 'App Description',
              required: true,
            },
            {
              name: 'fallbackImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Fallback Image (PNG)',
              required: true,
            },
             {
              name: 'favIcon',
              type: 'upload',
              relationTo: 'media',
              label: 'Favicon (ICO)',
              required: true,
            },
            {
              name: 'favIconSvg',
              type: 'upload',
              relationTo: 'media',
              label: 'Favicon (SVG)',
              required: false,
            },
            {
              name: 'favIconPng',
              type: 'upload',
              relationTo: 'media',
              label: 'Favicon (PNG)',
            },
          ],
        },
        {
          label: 'Fonts',
          fields: [
            {
              name: 'defaultFont',
              type: 'relationship',
              relationTo: 'fonts',
              label: 'Default Font',
            },
            {
              name: 'fontPrimary',
              type: 'relationship',
              relationTo: 'fonts',
              label: 'Font Primary',
            },
            {
              name: 'fontSecondary',
              type: 'relationship',
              relationTo: 'fonts',
              label: 'Font Secondary',
            },
            {
              name: 'fontAccent',
              type: 'relationship',
              relationTo: 'fonts',
              label: 'Font Accent',
            },
          ],
        },
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