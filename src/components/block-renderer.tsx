import React, { Fragment } from 'react'
import type { Page } from '@/payload-types'
import { SearchParams } from '@/types/search-params'
import { ContentBlockUI } from '@/blocks/content'

const blockComponents = {
  contentBlock: ContentBlockUI,
}

type BlockRendererProps = {
  block: NonNullable<NonNullable<Page['layout']>[number]['blocks']>[number]
  searchParams?: SearchParams
}

export function BlockRenderer({ block, searchParams }: BlockRendererProps) {
  const blockType = block.blockType as keyof typeof blockComponents
  const Block = blockComponents[blockType]

  if (!Block) {
    return null
  }

  return (
    <Fragment>
      {/* @ts-expect-error there may be some mismatch between the expected types here */}
      <Block {...block} searchParams={searchParams} />
    </Fragment>
  )
}