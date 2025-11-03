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
          label: 'Appearance',
          fields: [
            {
              name: 'style',
              type: 'select',
              required: true,
              defaultValue: 'default',
              label: 'Header Style',
              options: [
                { label: 'Default', value: 'default' },
                { label: 'Transparent', value: 'transparent' },
                { label: 'Floating', value: 'floating' },
                { label: 'Glassmorphic', value: 'glass' },
                { label: 'Minimal', value: 'minimal' },
                { label: 'Centered', value: 'centered' },
                { label: 'Split', value: 'split' },
                { label: 'Sidebar', value: 'sidebar' },
              ],
            },
            {
              name: 'behavior',
              type: 'select',
              required: true,
              defaultValue: 'static',
              label: 'Scroll Behavior',
              options: [
                { label: 'Static', value: 'static' },
                { label: 'Sticky', value: 'sticky' },
                { label: 'Hide on Scroll', value: 'hide' },
                { label: 'Shrink on Scroll', value: 'shrink' },
              ],
            },
            {
              name: 'background',
              type: 'select',
              defaultValue: 'opaque',
              label: 'Background',
              admin: {
                condition: (data) => {
                  return data?.style !== 'transparent' && data?.style !== 'glass'
                },
              },
              options: [
                { label: 'Opaque', value: 'opaque' },
                { label: 'Blur', value: 'blur' },
                { label: 'Gradient', value: 'gradient' },
              ],
            },
            {
              name: 'shadow',
              type: 'checkbox',
              label: 'Enable Shadow',
              defaultValue: false,
            },
            {
              name: 'border',
              type: 'checkbox',
              label: 'Enable Bottom Border',
              defaultValue: false,
            },
          ],
        },
        {
          label: 'Navigation',
          fields: [
            {
              name: 'navigation',
              type: 'array',
              label: 'Navigation Links',
              fields: [navigation()],
            },
          ],
        },
        {
          label: 'CTA',
          fields: [
            {
              name: 'cta',
              type: 'group',
              label: 'Call to Action',
              fields: [
                {
                  name: 'ctaLinks',
                  type: 'array',
                  label: 'CTA Links',
                  maxRows: 2,
                  fields: [navigation()],
                },
              ],
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
