import { Fragment } from 'react'
import type { Page } from '@/payload-types'
import { SearchParams } from '@/types/search-params'
import { ContentBlockUI } from '@/blocks/content'
import { cn } from '@/lib/utils'
import { joinStyles } from '@/lib/make-styles'
import { CallToActionBlockUI } from '@/blocks/call-to-action'
import { CardBlockUI } from '@/blocks/card'
import { TabBlockUI } from '@/blocks/tab'
import { AccordionBlockUI } from '@/blocks/accordion'
import { DividerBlockUI } from '@/blocks/divider'
import { TableBlockUI } from '@/blocks/table'

const blockComponents = {
  contentBlock: ContentBlockUI,
  callToActionBlock: CallToActionBlockUI,
  cardBlock: CardBlockUI,
  tabBlock: TabBlockUI,
  accordionBlock: AccordionBlockUI,
  dividerBlock: DividerBlockUI,
  tableBlock: TableBlockUI
}

type BlockRendererProps = {
  block: NonNullable<NonNullable<Page['layout']>[number]['blocks']>[number]
  searchParams?: SearchParams
}

const colsSpanClasses = {
  full: 'col-span-4 lg:col-span-12',
  half: 'col-span-4 lg:col-span-6',
  'one-third': 'col-span-4 lg:col-span-4',
  'two-thirds': 'col-span-4 lg:col-span-8',
}

export function BlockRenderer({ block, searchParams }: BlockRendererProps) {
  const blockType = block.blockType as keyof typeof blockComponents
  const Block = blockComponents[blockType]
  const hasGrid = 'gridSize' in block
  if (!Block) {
    return null
  }

  if (hasGrid) {
    return (
      <div
        className={joinStyles(
          colsSpanClasses[block.gridSize],
          block.gridStyles,
          cn({ 'md:col-span-2': block.gridSize !== 'full' }),
        )}
      >
        <Fragment>
          {/* @ts-expect-error there may be some mismatch between the expected types here */}
          <Block {...block} searchParams={searchParams} />
        </Fragment>
      </div>
    )
  }

  return (
    <Fragment>
      {/* @ts-expect-error there may be some mismatch between the expected types here */}
      <Block {...block} searchParams={searchParams} />
    </Fragment>
  )
}
