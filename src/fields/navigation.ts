import type { Field, GroupField } from 'payload'
import deepMerge from '@/lib/deep-merge'

type NavType = (options?: { overrides?: Partial<GroupField> }) => Field
 
const navFields: Field[] = [
  {
    type: 'row',
    fields: [
      {
        name: 'label',
        type: 'text',
        label: 'Label',
        required: true,
        admin: {
          placeholder: 'Enter link text...',
          condition: (_, __, data) => data.blockData.nav.appearance === 'dropdown',
        },
      },
      {
        name: 'type',
        type: 'select',
        defaultValue: 'reference',
        label: 'Link Type',
        admin: {
          width: '50%',
        },
        options: [
          { label: 'Internal Page', value: 'reference' },
          { label: 'External URL', value: 'custom' },
        ],
      },
      {
        name: 'newTab',
        type: 'checkbox',
        label: 'Open in new tab',
        admin: {
          width: '50%',
        },
      },
    ],
  },
  {
    name: 'reference',
    type: 'relationship',
    admin: {
      condition: (_, data) => data?.type === 'reference',
    },
    label: 'Select Page',
    relationTo: ['pages'],
    required: true,
  },
  {
    name: 'url',
    type: 'text',
    admin: {
      condition: (_, data) => data?.type === 'custom',
      placeholder: 'https://example.com',
    },
    defaultValue: 'https://',
    label: 'URL',
    required: true,
  },
]

export const navigation: NavType = ({ overrides = {} } = {}) =>
  deepMerge(
    {
      name: 'nav',
      type: 'group',
      label: 'Navigation',
      admin: { hideGutter: true },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'appearance',
              type: 'select',
              defaultValue: 'link',
              label: 'Display Style',
              admin: {
                width: '50%',
              },
              options: [
                { label: 'Text Link', value: 'link' },
                { label: 'Button', value: 'button' },
                { label: 'Dropdown Menu', value: 'dropdown' },
              ],
            },
            {
              name: 'styles',
              type: 'relationship',
              relationTo: 'styles',
              hasMany: true,
              admin: {
                width: '50%',
              },
            },
          ],
        },
        {
          name: 'label',
          type: 'text',
          label: 'Link Text',
          required: true,
          admin: {
            placeholder: 'Enter link text...',
            condition: (_, __, data) => {
              if (data.blockData?.text) {
                return false
              } else {
                return true
              }
            },
          },
        },
        {
          type: 'row',
          fields: [
            {
              name: 'buttonType',
              type: 'select',
              admin: {
                condition: (_, data) => data?.appearance !== 'link',
                width: '50%',
              },
              label: 'Button Style',
              defaultValue: 'default',
              options: [
                { label: 'Primary', value: 'default' },
                { label: 'Destructive', value: 'destructive' },
                { label: 'Outline', value: 'outline' },
                { label: 'Secondary', value: 'secondary' },
                { label: 'Ghost', value: 'ghost' },
                { label: 'Link Style', value: 'link' },
              ],
            },
            {
              name: 'buttonSize',
              type: 'select',
              admin: {
                condition: (_, data) => data?.appearance !== 'link',
                width: '50%',
              },
              label: 'Button Size',
              defaultValue: 'default',
              options: [
                { label: 'Small', value: 'sm' },
                { label: 'Medium', value: 'default' },
                { label: 'Large', value: 'lg' },
                { label: 'Icon', value: 'icon' },
              ],
            },
          ],
        },
        {
          name: 'dropdownItems',
          type: 'array',
          label: 'Dropdown Items',
          fields: navFields,
          admin: {
            condition: (_, data) => data?.appearance === 'dropdown',
          },
        },
        {
          name: 'link',
          type: 'group',
          label: 'Link Details',
          admin: {
            condition: (_, data) => data?.appearance !== 'dropdown',
          },
          fields: navFields,
        },
      ],
    } as GroupField,
    overrides,
  )
