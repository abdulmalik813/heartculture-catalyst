import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { TabBlock } from '@/payload-types'
import { LexicalRenderer } from '@/components/lexical-renderer'
import { joinStyles } from '@/lib/make-styles'
import { GlobalData } from '@/types/global-data'

export async function TabBlockUI({
  globalData,
  ...tabBlock
}: TabBlock & { globalData: GlobalData }) {
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
            <LexicalRenderer
              content={tab.content}
              globalData={globalData}
            />
          </TabsContent>
        )
      })}
    </Tabs>
  )
}
