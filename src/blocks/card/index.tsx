import { CardBlock } from '@/payload-types'
import { SearchParams } from '@/types/search-params'

export async function CardBlockUI({
  searchParams,
  ...cardBlock
}: Partial<CardBlock> & { searchParams?: SearchParams }) {
  return <div>card goes here</div>
}
