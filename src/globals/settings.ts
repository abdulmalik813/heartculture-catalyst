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
              name: 'logo',
              type: 'upload',
              relationTo: 'media',
              required: true,
            },
            {
              name: 'logoDark',
              type: 'upload',
              relationTo: 'media',
            },
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
              name: 'default',
              type: 'group',
              label: 'Default Font',
              fields: [
                {
                  name: 'family',
                  type: 'text',
                  label: 'Font Family',
                  required: true,
                  admin: {
                    components: {
                      Field: {
                        path: '@/components/admin/font-family-search-field#FontFamilySearchField'
                      },
                    },
                  },
                },
                {
                  name: 'fontData',
                  type: 'json',
                  label: 'Font Configuration',
                  admin: {
                    condition: () => false,
                  },
                },
              ],
            },
            {
              name: 'additionalFonts',
              type: 'array',
              label: 'Additional Fonts',
              fields: [
                {
                  name: 'title',
                  type: 'text',
                  label: 'Title',
                  required: true,
                  admin: {
                    description: 'Name to identify this font in your Styles (e.g., "Heading Font", "Body Font", "Accent Font").',
                  },
                },
                {
                  name: 'family',
                  type: 'text',
                  label: 'Font Family',
                  required: true,
                  admin: {
                    components: {
                      Field: {
                        path: '@/components/admin/font-family-search-field#FontFamilySearchField'
                      },
                    },
                  },
                },
                {
                  name: 'fontData',
                  type: 'json',
                  label: 'Font Configuration',
                  admin: {
                    condition: () => false,
                  },
                },
              ],
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
