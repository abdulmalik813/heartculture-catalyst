import React from 'react'
import type { MediaBlock as MediaBlockProps, Style } from '@/payload-types'
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
import { MediaBlock } from '@/blocks/media'
import { Navigation } from './custom-ui/navigation'

interface LexicalRendererProps {
  content?: DefaultTypedEditorState | null
  styles?: string | null
  enableContainer?: boolean | null
  searchParams?:
    | Record<string, string | string[] | undefined | null>
    | Promise<Record<string, string | string[] | undefined | null>>
}

type NodeTypes = DefaultNodeTypes | SerializedBlockNode<MediaBlockProps>

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
        return <Navigation {...reconstructedNode.fields} />
      },
      inlineBlocks: {
        // @ts-expect-error there may be some mismatch between the expected types here
        mediaBlock: ({ node }) => <MediaBlock {...node.fields} searchParams={searchParams} />,
        // @ts-expect-error there may be some mismatch between the expected types here
        navigationBlock: ({ node }) => <Navigation {...node.fields} />,
      },
      blocks: {
        // @ts-expect-error there may be some mismatch between the expected types here
        mediaBlock: ({ node }) => <MediaBlock {...node.fields} searchParams={searchParams} />,
        // @ts-expect-error there may be some mismatch between the expected types here
        navigationBlock: ({ node }) => <Navigation {...node.fields} />,
      },
    }
  }
}

export async function LexicalRenderer({
  styles,
  content,
  searchParams,
  enableContainer,
}: LexicalRendererProps) {
  if (!content) return null
  const container = enableContainer ? 'container mx-auto' : ''
  return (
    <ConvertRichText
      converters={jsxConverters(searchParams)}
      className={joinStyles(container, styles)}
      data={content as DefaultTypedEditorState}
    />
  )
}
