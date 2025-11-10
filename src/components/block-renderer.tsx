import { Fragment } from 'react'
import type { Page, Post, Setting } from '@/payload-types'
import { SearchParams } from '@/types/search-params'
import { ContentBlockUI } from '@/blocks/content'
import { CallToActionBlockUI } from '@/blocks/call-to-action'
import { CardBlockUI } from '@/blocks/card'
import { TabBlockUI } from '@/blocks/tab'
import { AccordionBlockUI } from '@/blocks/accordion'
import { DividerBlockUI } from '@/blocks/divider'
import { TableBlockUI } from '@/blocks/table'
import { LastModifiedBlockUI } from '@/blocks/last-modified'
import { RecentPostsBlockUI } from '@/blocks/recent-posts'
import { FormBlockUI } from '@/blocks/form'

const blockComponents = {
  contentBlock: ContentBlockUI,
  callToActionBlock: CallToActionBlockUI,
  cardBlock: CardBlockUI,
  tabBlock: TabBlockUI,
  accordionBlock: AccordionBlockUI,
  dividerBlock: DividerBlockUI,
  formBlock: FormBlockUI,
  tableBlock: TableBlockUI,
  lastModifiedBlock: LastModifiedBlockUI,
  recentPostsBlock: RecentPostsBlockUI,
}

type BlockRendererProps = {
  block:
    | NonNullable<NonNullable<NonNullable<Page['layout']>[0]['grid']>[0]['blocks']>[0]
    | NonNullable<NonNullable<NonNullable<Post['layout']>[0]['grid']>[0]['blocks']>[0]
  searchParams: SearchParams
  page: Post | Page | null
  setting: Setting | null
}

export function BlockRenderer({ block, searchParams, setting, page }: BlockRendererProps) {
  const blockType = block.blockType as keyof typeof blockComponents
  const Block = blockComponents[blockType]

  return (
    <Fragment>
      {/* @ts-expect-error there may be some mismatch between the expected types here */}
      <Block {...block} searchParams={searchParams} setting={setting} page={page} />
    </Fragment>
  )
}