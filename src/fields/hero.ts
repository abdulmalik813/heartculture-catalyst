import { Field } from 'payload'
import { media } from './media'
import { navigation } from './navigation'

export const hero: Field[] = [
  {
    type: 'collapsible',
    label: 'Layout Settings',
    admin: {
      initCollapsed: false,
    },
    fields: [
      {
        name: 'heroLayout',
        type: 'select',
        required: true,
        defaultValue: 'heading-with-image',
        label: 'Layout Type',
        options: [
          {
            label: 'Full Screen',
            value: 'fullscreen',
          },
          {
            label: 'Heading with Image',
            value: 'heading-with-image',
          },
          {
            label: 'Heading (No Image)',
            value: 'heading-no-image',
          },
        ],
        admin: {
          description: 'Choose how the hero section should be displayed',
        },
      },
    ],
  },
  {
    type: 'collapsible',
    label: 'Content',
    admin: {
      initCollapsed: false,
    },
    fields: [
      {
        name: 'heroTitle',
        type: 'textarea',
        required: true,
        label: 'Title',
        admin: {
          description: 'Main hero heading text',
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
    type: 'collapsible',
    label: 'Media',
    admin: {
      condition: (data) => data.heroLayout !== 'heading-no-image',
      initCollapsed: true,
      description: 'Background image or featured media',
    },
    fields: media,
  },
  {
    type: 'collapsible',
    label: 'Advanced Styling',
    admin: {
      condition: (data) => data.heroLayout === 'heading-with-image',
      initCollapsed: true,
    },
    fields: [
      {
        name: 'cardStyles',
        type: 'relationship',
        relationTo: 'styles',
        hasMany: true,
        label: 'Card Container Styles',
        admin: {
          description: 'Apply custom styles to the card wrapper',
        },
      },
    ],
  },
]
