import { Loader2 } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'
import { Footer } from '@/components/footer'
import { NavigationBarUI } from '@/components/navigation-bar'
import { GlobalData } from '@/types/global-data'
import { Setting } from '@/payload-types'
import { getCachedGlobal } from '@/lib/get-globals'
import { draftMode } from 'next/headers'
import { SlugProps } from '@/types/slug-props'

export default async function Loading({ params, searchParams }: Readonly<SlugProps>) {
  const param = await params
  const page = null
  const setting = (await getCachedGlobal('settings', 1, false)) as Setting
  const { isEnabled: draft } = await draftMode()
  const slug = param?.slug ? param.slug.join('/') : 'home'

  const globalData: GlobalData = {
    page,
    setting,
    searchParams,
    draft,
    slug,
  }

  return (
    <>
      <NavigationBarUI globalData={globalData} />
      <main className="flex-1">
        <article className="min-h-[70vh]">
          <div className="w-full h-64 bg-muted animate-pulse mb-8" />

          <div className="container mx-auto px-4">
            <div className="grid grid-cols-4 lg:grid-cols-12 gap-4">
              <div className="col-span-4 lg:col-span-8 space-y-4">
                <Skeleton className="h-8 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />

                <div className="pt-6 space-y-3">
                  <Skeleton className="h-6 w-1/2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-4/5" />
                </div>
              </div>

              <div className="col-span-4 space-y-4">
                <Skeleton className="h-48 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
            <div className="flex justify-center items-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          </div>
        </article>
      </main>
      <Footer globalData={globalData} />
    </>
  )
}
