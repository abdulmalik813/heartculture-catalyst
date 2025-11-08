import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'
import { slugField } from 'payload'

export const Categories: CollectionConfig<'categories'> = {
  slug: 'categories',
  access: {
    create: authenticated,
    delete: authenticated,
    read: () => true,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['name', 'slug', 'updatedAt'],
    useAsTitle: 'name',
  },
  defaultPopulate: {
    name: true,
    slug: true,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: 'Brief description of this category',
      },
    },
    {
      name: 'color',
      type: 'select',
      options: [
        {
          label: 'Default',
          value: 'default',
        },
        {
          label: 'Primary',
          value: 'primary',
        },
        {
          label: 'Secondary',
          value: 'secondary',
        },
        {
          label: 'Destructive',
          value: 'destructive',
        },
        {
          label: 'Outline',
          value: 'outline',
        },
      ],
      defaultValue: 'default',
      admin: {
        description: 'Color variant for category badges (uses shadcn/ui variants)',
      },
    },
    slugField(),
  ],
}