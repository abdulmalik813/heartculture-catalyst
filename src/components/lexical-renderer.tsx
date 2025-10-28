import React, { cache } from 'react'
import type { Page, TagBlock as TagBlockType } from '@/payload-types'
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
import { JSDOM } from 'jsdom'

interface LexicalRendererProps {
  collection: Page
  searchParams?:
    | Record<string, string | string[] | undefined | null>
    | Promise<Record<string, string | string[] | undefined | null>>
}

type NodeTypes = DefaultNodeTypes | SerializedBlockNode<TagBlockType>

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
      blocks: {},
      inlineBlocks: {
        // @ts-expect-error there may be some mismatch between the expected types here
        tagBlock: ({ node }) => (
          <TagBlock {...node.fields} searchParams={searchParams} />
        ),
      },
    }
  }
}

function processMarkersWithDOM(htmlString: string): string {
  const dom = new JSDOM(htmlString)
  const document = dom.window.document
  
  const markers = Array.from(document.querySelectorAll('span.__tag-marker__'))
  
  const startMarkers: Array<{ element: Element; tag: string; className: string }> = []
  
  for (const marker of markers) {
    const content = marker.textContent || ''
    const [type, tag, className] = content.split('::')
    
    if (type === 'START') {
      startMarkers.push({ element: marker, tag, className: className || '' })
    } else if (type === 'END') {
      const matchingStart = startMarkers.slice().reverse().find(s => s.tag === tag)
      
      if (matchingStart) {
        const wrapper = document.createElement(tag)
        if (matchingStart.className) {
          wrapper.className = matchingStart.className
        }
        let current = matchingStart.element.nextSibling
        const nodesToMove: Node[] = []
        
        while (current && current !== marker) {
          nodesToMove.push(current)
          current = current.nextSibling
        }
    
        nodesToMove.forEach(node => wrapper.appendChild(node))
        
        matchingStart.element.replaceWith(wrapper)
        
        marker.remove()
        startMarkers.splice(startMarkers.indexOf(matchingStart), 1)
      }
    }
  }
  
  return document.body.innerHTML
}

const renderContent = cache(async (
  content: DefaultTypedEditorState,
  collection: Page,
  searchParams?: LexicalRendererProps['searchParams']
) => {
  const jsxContent = (
    <ConvertRichText
      converters={jsxConverters(searchParams)}
      className={joinStyles(collection.styles)}
      data={content}
    />
  )
  
  const { renderToString } = await import('react-dom/server')
  const htmlString = renderToString(jsxContent)
  return processMarkersWithDOM(htmlString)
})

export async function LexicalRenderer({ collection, searchParams }: LexicalRendererProps) {
  const finalHTML = await renderContent(
    collection.content as DefaultTypedEditorState,
    collection,
    searchParams
  )
  return <div dangerouslySetInnerHTML={{ __html: finalHTML }} />
}