import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import { CollectionConfig } from 'payload'
import { generateStylesheet, revalidateCache, revalidateDelete } from './hooks'

export const Styles: CollectionConfig<'styles'> = {
  slug: 'styles',
  access: {
    create: authenticated,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  admin: {
    useAsTitle: 'alias',
  },
  fields: [
    {
      name: 'alias',
      type: 'text',
      required: true,
      unique: true,
      label: 'Alias',
    },
    {
      name: 'tailwind',
      type: 'checkbox',
      label: 'Tailwind',
      defaultValue: true,
    },
    {
      name: 'className',
      type: 'text',
      label: 'Class name',
      required: true,
      admin: {
        description: 'This cannot be changed after creation',
      },
      access: {
        update: ({ id }) => !id,
      },
      hooks: {
        afterChange: [],
      },
    },
    {
      name: 'stylesheet',
      type: 'textarea',
      label: 'Stylesheet',
      admin: {
        description: 'CSS stylesheet (if tailwind, the content will be overridden)',
      },
    },
  ],
  hooks: {
    beforeChange: [generateStylesheet],
    afterChange: [revalidateCache],
    afterDelete: [revalidateDelete],
  },
}
