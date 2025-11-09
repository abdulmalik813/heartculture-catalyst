import { AlertCircle, Home, Search } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function NotFound() {
  return (
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
            The page you're looking for doesn't exist or has been moved.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button asChild className="w-full">
            <Link href="/">
              <Home className="mr-2 h-4 w-4" />
              Go to Homepage
            </Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/search">
              <Search className="mr-2 h-4 w-4" />
              Search Site
            </Link>
          </Button>
        </CardContent>
      </Card>
    </article>
  )
}
