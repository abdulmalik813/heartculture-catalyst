import { Block } from 'payload'
import { grid } from '@/fields/grid'
import { card } from '@/fields/card'

export const CardBlock = (disableGrid: boolean = true): Block => ({
  slug: 'cardBlock',
  interfaceName: 'CardBlock',
  dbName: 'card',
  fields: [...(disableGrid ? [] : [grid()]), ...card()],
  graphQL: {
    singularName: 'CardBlock',
  },
})
