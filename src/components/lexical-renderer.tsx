import React from 'react'
import type { AccordionBlock, DividerBlock, MediaBlock, NavigationBlock, Style, TabBlock } from '@/payload-types'
import {
  DefaultNodeTypes,
  DefaultTypedEditorState,
  SerializedBlockNode,
} from '@payloadcms/richtext-lexical'
import {
  JSXConvertersFunction,
  RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react'
import { joinStyles } from '@/lib/make-styles'
import { MediaBlockUI } from '@/blocks/media'
import { NavigationBlockUI } from '../blocks/navigation'
import { SearchParams } from '@/types/search-params'
import { TabBlockUI } from '@/blocks/tab'
import { AccordionBlockUI } from '@/blocks/accordion'
import { DividerBlockUI } from '@/blocks/divider'

interface LexicalRendererProps {
  content?: DefaultTypedEditorState | null
  contentStyles?: (number | Style)[] | undefined | null
  searchParams?: SearchParams
}

type NodeTypes = DefaultNodeTypes | SerializedBlockNode<MediaBlock | NavigationBlock | TabBlock | AccordionBlock | DividerBlock>

function jsxConverters(
  searchParams?: LexicalRendererProps['searchParams'],
): JSXConvertersFunction<NodeTypes> {
  return function ({ defaultConverters }) {
    return {
      ...defaultConverters,
      link: ({ node }) => {
        const children = node.children as any[]
        const label = children?.[0]?.text
        const reconstructedNode = {
          ...node,
          fields: {
            ...node.fields,
            nav: {
              ...(node.fields.nav || {}),
              label: label,
            },
          },
        }
        return <NavigationBlockUI {...reconstructedNode.fields} />
      },
      inlineBlocks: {
        // @ts-expect-error there may be some mismatch between the expected types here
        mediaBlock: ({ node }) => <MediaBlockUI {...node.fields} searchParams={searchParams} />,
        // @ts-expect-error there may be some mismatch between the expected types here
        navigationBlock: ({ node }) => <NavigationBlockUI {...node.fields} />,
      },
      blocks: {
        mediaBlock: ({ node }) => <MediaBlockUI {...node.fields} searchParams={searchParams} />,
        navigationBlock: ({ node }) => <NavigationBlockUI {...node.fields} />,
        tabBlock: ({ node }) => <TabBlockUI {...node.fields} />,
        accordionBlock: ({ node }) => <AccordionBlockUI {...node.fields} />,
        dividerBlock: ({ node }) => <DividerBlockUI {...node.fields} />,
      },
    }
  }
}

export async function LexicalRenderer({
  content,
  searchParams,
  contentStyles,
}: LexicalRendererProps) {
  if (!content) return null
  return (
    <ConvertRichText
      converters={jsxConverters(searchParams)}
      className={joinStyles(contentStyles)}
      data={content as DefaultTypedEditorState}
    />
  )
}
