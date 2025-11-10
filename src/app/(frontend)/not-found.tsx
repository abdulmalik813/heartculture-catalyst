import { AlertCircle, Home, Link } from 'lucide-react'
import { Footer } from '@/components/footer'
import { NavigationBarUI } from '@/components/navigation-bar'
import { GlobalData } from '@/types/global-data'
import { Setting } from '@/payload-types'
import { getCachedGlobal } from '@/lib/get-globals'
import { draftMode } from 'next/headers'
import { SlugProps } from '@/types/slug-props'
import { CardHeader, CardTitle, CardDescription, CardContent, Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

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
        <article className="min-h-[70vh] flex items-center justify-center px-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                <div className="rounded-full bg-destructive/10 p-3">
                  <AlertCircle className="h-10 w-10 text-destructive" />
                </div>
              </div>
              <CardTitle className="text-3xl font-bold">404 - Page Not Found</CardTitle>
              <CardDescription className="text-base mt-2">
                The page you&apos;re looking for doesn&apos;t exist or has been moved.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Button asChild className="w-full">
                <Link href="/">
                  <Home className="mr-2 h-4 w-4" />
                  Go to Homepage
                </Link>
              </Button>
            </CardContent>
          </Card>
        </article>
      </main>
      <Footer globalData={globalData} />
    </>
  )
}
