import { grid } from '@/fields/grid'
import { Block } from 'payload'

export const LastModifiedBlock: Block = {
  slug: 'lastModifiedBlock',
  interfaceName: 'LastModifiedBlock',
  dbName: 'last_modified',
  fields: [grid()],
  graphQL: {
    singularName: 'LastModifiedBlock',
  },
}
