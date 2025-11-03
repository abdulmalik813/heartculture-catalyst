import { Page } from '@/payload-types'
import { SearchParams } from '@/types/search-params'
import { joinStyles } from '@/lib/make-styles'
import { Media } from '@/components/media'
import type { Media as MediaCollection } from '@/payload-types'
import { NavigationBlockUI } from '@/blocks/navigation'

const browserPlayableTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm']

export async function Hero({
  searchParams,
  hero,
}: {
  searchParams?: SearchParams
  hero: NonNullable<Page['hero']>
}) {
  const media = hero.media as MediaCollection | undefined
  const isPlayable = media && browserPlayableTypes.includes(media.mimeType || '')

  if (hero.heroLayout === 'fullscreen') {
    return (
      <section className="relative min-h-screen flex items-center justify-center">
        {media && (
          <div className="absolute inset-0 -z-10">
            {isPlayable ? (
              <Media
                className="w-full h-full"
                imgClassName={`object-cover w-full h-full ${joinStyles(hero.contentStyles)}`}
                videoClassName={`object-cover w-full h-full ${joinStyles(hero.contentStyles)}`}
                resource={media}
              />
            ) : null}
          </div>
        )}

        <div className="container mx-auto px-8 text-center">
          <h1 className={joinStyles(hero.titleStyles)}>{hero.heroTitle}</h1>
          {hero.description && (
            <p className={joinStyles(hero.descriptionStyles)}>{hero.description}</p>
          )}
          {hero.navigations && hero.navigations.length > 0 && (
            <div className="flex flex-wrap gap-4 justify-center mt-8">
              {hero.navigations.map((nav, index) => (
                <NavigationBlockUI key={index} {...nav} searchParams={searchParams} />
              ))}
            </div>
          )}
        </div>
      </section>
    )
  }

  if (hero.heroLayout === 'heading-with-image') {
    return (
      <section className="relative min-h-[600px] py-16">
        {media && (
          <div className="absolute inset-0 -z-10">
            {isPlayable ? (
              <Media
                className="w-full h-full"
                imgClassName={`object-cover w-full h-full ${joinStyles(hero.contentStyles)}`}
                videoClassName={`object-cover w-full h-full ${joinStyles(hero.contentStyles)}`}
                resource={media}
              />
            ) : null}
          </div>
        )}

        <div className="container mx-auto px-8">
          <div className={`max-w-2xl ${joinStyles(hero.cardStyles)}`}>
            <h1 className={joinStyles(hero.titleStyles)}>{hero.heroTitle}</h1>
            {hero.description && (
              <p className={joinStyles(hero.descriptionStyles)}>{hero.description}</p>
            )}
            {hero.navigations && hero.navigations.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-6">
                {hero.navigations.map((nav, index) => (
                  <NavigationBlockUI key={index} {...nav} searchParams={searchParams} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-16 bg-muted/50">
      <div className="container mx-auto px-8 text-center max-w-4xl">
        <h1 className={joinStyles(hero.titleStyles)}>{hero.heroTitle}</h1>
        {hero.description && (
          <p className={joinStyles(hero.descriptionStyles)}>{hero.description}</p>
        )}
        {hero.navigations && hero.navigations.length > 0 && (
          <div className="flex flex-wrap gap-4 justify-center mt-8">
            {hero.navigations.map((nav, index) => (
              <NavigationBlockUI key={index} {...nav} searchParams={searchParams} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}