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
    },
    slugField(),
  ],
}
