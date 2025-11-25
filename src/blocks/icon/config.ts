import { Block } from 'payload'
import { icon } from '@/fields/icon'

export const IconBlock: Block = {
  slug: 'iconBlock',
  interfaceName: 'IconBlock',
  dbName: 'icon',
  fields: [
    ...icon(),
  ],
  graphQL: {
    singularName: 'IconBlock',
  },
}
