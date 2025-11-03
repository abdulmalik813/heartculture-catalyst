import { GroupField } from 'payload'
import { media } from './media'
import { navigation } from './navigation'
import { card } from './card'

export const hero: GroupField = {
  type: 'group',
  name: 'hero',
  fields: [
    {
      name: 'layout',
      type: 'select',
      required: true,
      defaultValue: 'with-image',
      label: 'Hero Layout',
      options: [
        { label: 'Full Screen Hero', value: 'fullscreen' },
        { label: 'Hero with Image', value: 'with-image' },
        { label: 'Simple Hero (Text Only)', value: 'text-only' },
      ],
    },
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Content',
          fields: [
            {
              name: 'heroTitle',
              type: 'textarea',
              admin: {
                condition: (_, siblingData) => siblingData.layout === 'text-only',
              },
            },
            {
              name: 'heroDescription',
              type: 'textarea',
              admin: {
                condition: (_, siblingData) => siblingData.layout === 'text-only',
              },
            },
            {
              type: 'group',
              admin: {
                condition: (_, siblingData) => siblingData.layout !== 'text-only',
              },
              fields: card(),
            },
          ],
        },
        {
          label: 'Media',
          admin: {
            condition: (_, siblingData) => siblingData.layout !== 'text-only',
          },
          fields: media,
        },
        {
          label: 'Styling',
          admin: {
            condition: (_, siblingData) => siblingData.layout === 'text-only',
          },
          fields: [
            {
              name: 'containerStyles',
              type: 'relationship',
              relationTo: 'styles',
              hasMany: true,
              label: 'Hero Container Styles',
              admin: {
                description: 'Styles applied to the entire hero section',
                condition: (_, siblingData) => siblingData.layout === 'text-only',
              },
            },
            {
              name: 'heroTitleStyles',
              type: 'relationship',
              relationTo: 'styles',
              hasMany: true,
              label: 'Title Styles',
              admin: {
                condition: (_, siblingData) => siblingData.layout === 'text-only',
              },
            },
            {
              name: 'heroDescriptionStyles',
              type: 'relationship',
              relationTo: 'styles',
              hasMany: true,
              label: 'Description Styles',
              admin: {
                condition: (_, siblingData) => siblingData.layout === 'text-only',
              },
            },
          ],
        },
      ],
    },
  ],
}
