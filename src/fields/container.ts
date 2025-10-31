import type { Field } from 'payload'

export const container: Field[] = [
  {
    type: 'collapsible',
    label: 'Container Settings',
    admin: {
      initCollapsed: false,
    },
    fields: [
      {
        name: 'enableContainer',
        type: 'checkbox',
        label: 'Enable Container',
        defaultValue: true,
      },
      {
        name: 'containerSize',
        type: 'select',
        label: 'Container Size',
        defaultValue: 'full',
        options: [
          {
            label: 'Full Width',
            value: 'full',
          },
          {
            label: 'Two Thirds (2/3)',
            value: 'two-thirds',
          },
          {
            label: 'Half (1/2)',
            value: 'half',
          },
          {
            label: 'One Third (1/3)',
            value: 'one-third',
          },
        ],
      },
    ],
  },
  {
    type: 'collapsible',
    label: 'Advanced Styling',
    admin: {
      initCollapsed: true,
    },
    fields: [
      {
        name: 'styles',
        type: 'relationship',
        relationTo: 'styles',
        hasMany: true,
      },
    ],
  },
]
