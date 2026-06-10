'use client'

import { ImageCarouselBlock, Media as MediaType } from '@/payload-types'
import { PageContext } from '@/types/page-context'
import { Media } from '@/components/media'
import { joinStyles } from '@/lib/make-styles'
import { useMemo } from 'react'

export function ImageCarouselBlockClient({
  pageContext,
  ...imageCarouselBlock
}: Partial<ImageCarouselBlock> & { pageContext: PageContext }) {
  const validMedias = useMemo(() => {
    return (imageCarouselBlock.medias || []).filter(
      (m): m is MediaType => typeof m !== 'number' && m !== null && m !== undefined,
    )
  }, [imageCarouselBlock.medias])

  if (validMedias.length === 0) return null

  // Duplicate media array for seamless looping
  const duplicatedMedias = [...validMedias, ...validMedias, ...validMedias]

  return (
    <section className="w-full overflow-hidden bg-background py-12 md:py-16">
      <div className="relative w-full overflow-hidden">
        {/* Gradient overlays for smooth edges */}
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-background to-transparent" />

        {/* Carousel container */}
        <div className="flex gap-6 md:gap-8 lg:gap-12 px-4 md:px-8">
          {/* Scrolling wrapper */}
          <div
            className="flex gap-6 md:gap-8 lg:gap-12"
            style={{
              animation: `scroll ${validMedias.length * 4}s linear infinite`,
            }}
          >
            {duplicatedMedias.map((media, index) => (
              <div
                key={`${media.id}-${index}`}
                className="flex-shrink-0 flex items-center justify-center"
                style={{
                  height: '120px',
                  minWidth: 'auto',
                }}
              >
                <div className="h-full w-auto max-w-xs">
                  <Media resource={media} imgClassName="h-full w-auto object-contain" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CSS Animation */}
      <style>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(calc(-100% / 3));
          }
        }
      `}</style>
    </section>
  )
}
