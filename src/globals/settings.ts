import { revalidateSettings } from '@/hooks/revalidate-globals'
import { generatePreviewPath } from '@/lib/generate-preview-path'
import { GlobalConfig, PayloadRequest } from 'payload'

export const Settings: GlobalConfig = {
  slug: 'settings',
  access: {
    read: () => true,
  },
  admin: {
    livePreview: {
      url: () => generatePreviewPath(),
    },
    preview: () => generatePreviewPath(),
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
          label: 'Post',
          fields: [
            {
              name: 'enablePost',
              type: 'checkbox',
              label: 'Enable Post Functionality',
              defaultValue: false,
              admin: {
                description: 'Toggle to enable or disable post functionality.',
              },
            },
            {
              name: 'postListingPageTitle',
              type: 'text',
              required: true,
              admin: {
                condition: (data: { enablePost?: boolean }) => data?.enablePost === true,
              },
            },
            {
              name: 'postSlug',
              type: 'text',
              label: 'Post Slug',
              required: true,
              admin: {
                condition: (data: { enablePost?: boolean }) => data?.enablePost === true,
              },
              validate: async (
                value: string | null | undefined,
                args: {
                  data?: { enablePost?: boolean }
                  req?: PayloadRequest
                },
              ) => {
                if (!args?.data?.enablePost) {
                  return true
                }

                if (!value) {
                  return 'Slug is required when post is enabled'
                }

                const validCharPattern = /^[a-zA-Z]+(-[a-zA-Z]+)?$/
                if (!validCharPattern.test(value)) {
                  return 'Slug can only contain letters and optionally one hyphen'
                }

                if (!args || !args.req || !args.req.payload) {
                  return 'Error validating slug. Please try again.'
                }

                const { req } = args

                try {
                  const existingPage = await req.payload.find({
                    collection: 'pages',
                    where: {
                      slug: {
                        contains: value,
                      },
                    },
                    limit: 1,
                  })

                  if (existingPage.docs && existingPage.docs.length > 0) {
                    return `Invalid: This slug is already used by a page. Please choose a different slug.`
                  }

                  return true
                } catch {
                  return 'Error validating slug. Please try again.'
                }
              },
            },
            {
              type: 'collapsible',
              label: 'Post Archive Page Metadata',
              admin: {
                condition: (data: { enablePost?: boolean }) => data?.enablePost === true,
              },
              fields: [
                {
                  name: 'postMetaTitle',
                  type: 'text',
                  label: 'Meta Title',
                },
                {
                  name: 'postMetaDescription',
                  type: 'textarea',
                  label: 'Meta Description',
                },
                {
                  name: 'postMetaImage',
                  type: 'upload',
                  relationTo: 'media',
                  label: 'Meta Image',
                },
              ],
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
                        path: '@/components/admin/font-family-search-field#FontFamilySearchField',
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
                    description:
                      'Name to identify this font in your Styles (e.g., "Heading Font", "Body Font", "Accent Font"). This cannot be changed after creation',
                  },
                  access: {
                    update: ({ id }) => !id,
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
                        path: '@/components/admin/font-family-search-field#FontFamilySearchField',
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
