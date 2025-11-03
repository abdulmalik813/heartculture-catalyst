import { GroupField } from 'payload'
import { media } from './media'
import { navigation } from './navigation'

export const hero: GroupField = {
  type: "group",
  name: "hero",
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'heroLayout',
              type: 'select',
              required: true,
              defaultValue: 'heading-with-image',
              label: 'Layout',
              options: [
                { label: 'Full Screen', value: 'fullscreen' },
                { label: 'With Image', value: 'heading-with-image' },
                { label: 'No Image', value: 'heading-no-image' },
              ],
            },
            {
              name: 'heroTitle',
              type: 'textarea',
              required: true,
              label: 'Title',
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Description',
            },
            {
              name: 'navigations',
              type: 'array',
              minRows: 0,
              maxRows: 3,
              label: 'CTAs',
              fields: [navigation()],
            },
          ],
        },
        {
          label: 'Media',
          fields: media,
          admin: {
            condition: (_, siblingData) => siblingData.heroLayout !== 'heading-no-image',
          },
        },
        {
          label: 'Styles',
          fields: [
            {
              name: 'titleStyles',
              type: 'relationship',
              relationTo: 'styles',
              hasMany: true,
              label: 'Title Styles',
            },
            {
              name: 'descriptionStyles',
              type: 'relationship',
              relationTo: 'styles',
              hasMany: true,
              label: 'Description Styles',
            },
            {
              name: 'cardStyles',
              type: 'relationship',
              relationTo: 'styles',
              hasMany: true,
              label: 'Container Styles',
              admin: {
                condition: (_, siblingData) => siblingData.heroLayout === 'heading-with-image',
              },
            },
          ],
        },
      ],
    },
  ]
}