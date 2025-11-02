import { TabBlock } from '@/payload-types'
import { SearchParams } from '@/types/search-params'

export async function TabBlockUI({
  searchParams,
  ...tabBlock
}: TabBlock & { searchParams?: SearchParams }) {
  return <div>tab go here</div>
}
