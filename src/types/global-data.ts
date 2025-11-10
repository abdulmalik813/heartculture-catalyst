import { Page, Post, Setting } from "@/payload-types"
import { SearchParams } from "@/types/search-params"

export type GlobalData = {
    searchParams?: SearchParams
    setting?: Setting | null
    page?: Page | Post | null
    draft?: boolean | false
    slug?: string | null
}