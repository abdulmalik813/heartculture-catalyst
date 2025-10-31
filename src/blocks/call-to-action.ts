import { Block } from 'payload'
import { media } from '@/fields/media'
import { navigation } from '@/fields/navigation'

export const CallToActionBlock: Block = {
  slug: 'callToActionBlock',
  interfaceName: 'CallToActionBlock',
  dbName: 'cta',
  fields: [
    {
      type: 'collapsible',
      label: 'Content',
      admin: {
        initCollapsed: false,
      },
      fields: [
        {
          name: 'title',
          type: 'textarea',
          required: true,
          label: 'Title',
          admin: {
            description: 'Main call to action heading',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Description',
          admin: {
            description: 'Supporting text below the title',
          },
        },
        {
          type: 'row',
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
          ],
        },
      ],
    },
    {
      type: 'collapsible',
      label: 'Call to Action',
      admin: {
        initCollapsed: true,
        description: 'Add up to 3 navigation buttons or links',
      },
      fields: [
        {
          name: 'navigations',
          type: 'array',
          minRows: 0,
          maxRows: 3,
          label: 'Navigation Items',
          fields: [navigation()],
        },
      ],
    },
    {
      type: 'row',
      fields: media,
    },
    {
      type: 'collapsible',
      label: 'Advanced Styling',
      admin: {
        initCollapsed: true,
      },
      fields: [
        {
          name: 'containerStyles',
          type: 'relationship',
          relationTo: 'styles',
          hasMany: true,
          label: 'Container Styles',
          admin: {
            description: 'Apply custom styles to the CTA container',
          },
        },
      ],
    },
  ],
  graphQL: {
    singularName: 'CallToActionBlock',
  },
}
