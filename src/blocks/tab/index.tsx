import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs'
import { TabBlock } from '@/payload-types'
import { LexicalRenderer } from '@/components/lexical-renderer'
import { SearchParams } from '@/types/search-params'
import { joinStyles } from '@/lib/make-styles'

export async function TabBlockUI({
  searchParams,
  ...tabBlock
}: TabBlock & { searchParams?: SearchParams }) {
  if (!tabBlock.tabs || tabBlock.tabs.length === 0) {
    return null
  }

  const defaultTabValue = tabBlock.tabs[0]?.title || ''

  return (
    <Tabs defaultValue={defaultTabValue} className={joinStyles(tabBlock.tabStyles)}>
      <TabsList className={joinStyles(tabBlock.tabListStyles)}>
        {tabBlock.tabs.map((tab) => {
          if (!tab.title) return null
          return (
            <TabsTrigger value={tab.title} key={tab.id} className={joinStyles(tab.titleStyles)}>
              {tab.title}
            </TabsTrigger>
          )
        })}
      </TabsList>
      {tabBlock.tabs.map((tab) => {
        if (!tab.title || !tab.content) return null
        return (
          <TabsContent value={tab.title} key={tab.id} className={joinStyles(tab.contentStyles)}>
            <LexicalRenderer content={tab.content} />
          </TabsContent>
        )
      })}
    </Tabs>
  )
}