import React from 'react'
import type { Page } from '@/payload-types'
import type { TagBlock as TagBlockProps } from '@/payload-types'
import {
  DefaultNodeTypes,
  DefaultTypedEditorState,
  SerializedBlockNode,
  SerializedLinkNode,
} from '@payloadcms/richtext-lexical'
import {
  JSXConvertersFunction,
  LinkJSXConverter,
  RichText as ConvertRichText,
} from '@payloadcms/richtext-lexical/react'
import { joinStyles } from '@/lib/make-styles'
import { TagBlock } from '@/blocks/lexical/tag-block'

interface LexicalRendererProps {
  collection: Page
  searchParams?:
    | Record<string, string | string[] | undefined | null>
    | Promise<Record<string, string | string[] | undefined | null>>
}

type NodeTypes = DefaultNodeTypes | SerializedBlockNode<TagBlockProps>

const internalDocToHref = ({ linkNode }: { linkNode: SerializedLinkNode }) => {
  const { value, relationTo } = linkNode.fields.doc!
  if (typeof value !== 'object') {
    throw new Error('Expected value to be an object')
  }
  const slug = value.slug
  return `/${slug}`
}

function jsxConverters(
  searchParams?: LexicalRendererProps['searchParams']
): JSXConvertersFunction<NodeTypes> {
  return function ({ defaultConverters }) {
    return {
      ...defaultConverters,
      ...LinkJSXConverter({ internalDocToHref }),
      inlineBlocks: {
        // @ts-expect-error there may be some mismatch between the expected types here
        tagBlock: ({ node }) => (
          <TagBlock {...node.fields} searchParams={searchParams} />
        ),
      },
    };
  };
}

export async function LexicalRenderer({ collection, searchParams }: LexicalRendererProps) {
  return (
    <ConvertRichText
      converters={jsxConverters(searchParams)}
      className={joinStyles(collection.styles)}
      data={collection.content as DefaultTypedEditorState}
    />
  )
}
