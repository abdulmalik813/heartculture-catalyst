import React from 'react'
import type {
  AccordionBlock,
  CardBlock,
  DividerBlock,
  FormBlock,
  MediaBlock,
  NavigationBlock,
  Style,
  TabBlock,
  TableBlock,
} from '@/payload-types'
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
import { TabBlockUI } from '@/blocks/tab'
import { AccordionBlockUI } from '@/blocks/accordion'
import { DividerBlockUI } from '@/blocks/divider'
import { CardBlockUI } from '@/blocks/card'
import { FormBlockUI } from '@/blocks/form'
import { TableBlockUI } from '@/blocks/table'
import { GlobalData } from '@/types/global-data'

interface LexicalRendererProps {
  content?: DefaultTypedEditorState | null
  contentStyles?: (number | Style)[] | undefined | null
  globalData: GlobalData
  className?: string
}

type NodeTypes =
  | DefaultNodeTypes
  | SerializedBlockNode<
      | MediaBlock
      | NavigationBlock
      | TabBlock
      | AccordionBlock
      | DividerBlock
      | FormBlock
      | CardBlock
      | TableBlock
    >

function jsxConverters(globalData: GlobalData): JSXConvertersFunction<NodeTypes> {
  return function ({ defaultConverters }) {
    return {
      ...defaultConverters,
      heading: ({ node, nodesToJSX }) => {
        const Tag = node.tag
        const headingClasses = {
          h1: 'text-4xl font-bold mt-8 mb-4',
          h2: 'text-3xl font-bold mt-7 mb-3.5',
          h3: 'text-2xl font-semibold mt-6 mb-3',
          h4: 'text-xl font-semibold mt-5 mb-2.5',
          h5: 'text-lg font-semibold mt-4 mb-2',
          h6: 'text-base font-semibold mt-4 mb-2',
        }
        return (
          <Tag className={headingClasses[Tag as keyof typeof headingClasses]}>
            {nodesToJSX({ nodes: node.children })}
          </Tag>
        )
      },
      quote: ({ node, nodesToJSX }) => {
        return (
          <blockquote className="border-l-4 border-muted-foreground/30 pl-4 my-6 italic text-muted-foreground">
            {nodesToJSX({ nodes: node.children })}
          </blockquote>
        )
      },
      list: ({ node, nodesToJSX }) => {
        const Tag = node.tag
        const listClasses = Tag === 'ul' ? 'list-disc my-4 pl-8' : 'list-decimal my-4 pl-8'
        return <Tag className={listClasses}>{nodesToJSX({ nodes: node.children })}</Tag>
      },
      listitem: ({ node, nodesToJSX }) => {
        return <li className="my-2">{nodesToJSX({ nodes: node.children })}</li>
      },
      code: ({ node, nodesToJSX }) => {
        return (
          <code className="bg-muted px-1.5 py-0.5 rounded text-sm font-mono">
            {nodesToJSX({ nodes: node.children })}
          </code>
        )
      },
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
        return <NavigationBlockUI {...reconstructedNode.fields} globalData={globalData} />
      },
      inlineBlocks: {
        // @ts-expect-error there may be some mismatch between the expected types here
        navigationBlock: ({ node }) => (
          <NavigationBlockUI
            {...node.fields}
            globalData={globalData}
          />
        ),
      },
      blocks: {
        mediaBlock: ({ node }) => (
          <MediaBlockUI
            {...node.fields}
            globalData={globalData}
          />
        ),
        navigationBlock: ({ node }) => (
          <NavigationBlockUI
            {...node.fields}
            globalData={globalData}
          />
        ),
        tabBlock: ({ node }) => (
          <TabBlockUI {...node.fields} globalData={globalData} />
        ),
        accordionBlock: ({ node }) => (
          <AccordionBlockUI
            {...node.fields}
            globalData={globalData}
          />
        ),
        dividerBlock: ({ node }) => (
          <DividerBlockUI
            {...node.fields}
            globalData={globalData}
          />
        ),
        cardBlock: ({ node }) => (
          <CardBlockUI {...node.fields} globalData={globalData} />
        ),
        formBlock: ({ node }) => (
          <FormBlockUI {...node.fields} globalData={globalData} />
        ),
        tableBlock: ({ node }) => (
          <TableBlockUI
            {...node.fields}
            globalData={globalData}
          />
        ),
      },
    }
  }
}

export async function LexicalRenderer({
  content,
  className,
  globalData
}: LexicalRendererProps) {
  if (!content) return null
  return (
    <ConvertRichText
      converters={jsxConverters(globalData)}
      className={joinStyles('richtext-content break-words', className)}
      data={content as DefaultTypedEditorState}
    />
  )
}
