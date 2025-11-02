import { Block } from 'payload'
import { grid } from '@/fields/grid'
import { card } from '@/fields/card'

export const CardBlock: Block = {
  slug: 'cardBlock',
  interfaceName: 'CardBlock',
  dbName: 'card',
  fields: [
    grid(),
    ...card()
  ],
  graphQL: {
    singularName: 'CardBlock',
  },
}
