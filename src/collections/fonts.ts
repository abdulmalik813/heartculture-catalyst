import { anyone } from '@/access/anyone'
import { authenticated } from '@/access/authenticated'
import type { CollectionConfig } from 'payload'

export const Fonts: CollectionConfig = {
  slug: 'fonts',
  admin: {
    useAsTitle: 'name',
  },
  access: {
    create: anyone,
    delete: authenticated,
    read: anyone,
    update: authenticated,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      unique: true,
    },
  ],
}
