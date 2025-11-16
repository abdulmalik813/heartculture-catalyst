'use client'

import { useState } from 'react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { GalleryBlock, Media as MediaType } from '@/payload-types'
import { cn } from '@/lib/utils'
import { Media } from '@/components/media'
import { PageContext } from '@/types/page-context'
import { NavigationBlockUI } from '../navigation'
import { Button } from '@/components/ui/button'

interface GalleryBlockClientProps {
  galleryBlock: GalleryBlock
  pageContext: PageContext
}

export function GalleryBlockClient({ galleryBlock, pageContext }: GalleryBlockClientProps) {
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(null)

  const selectedItem =
    selectedMediaIndex !== null ? galleryBlock.gallery?.[selectedMediaIndex] : null
  const selectedMedia =
    selectedItem?.image && typeof selectedItem.image === 'object'
      ? (selectedItem.image as MediaType)
      : null

  if (galleryBlock.format === 'grid') {
    return (
      <section className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 md:gap-8 space-y-6 md:space-y-8">
          {(galleryBlock.gallery ?? []).map((item, index) => {
            const resource = item.image
            const isVideo =
              resource && typeof resource === 'object' && resource.mimeType?.includes('video')

            return (
              <div key={index} className="break-inside-avoid">
                <div
                  className={cn('group relative overflow-hidden rounded-lg', {
                    'cursor-pointer': !isVideo,
                  })}
                  onClick={() => {
                    if (!isVideo) {
                      setSelectedMediaIndex(index)
                    }
                  }}
                >
                  <Media
                    resource={resource}
                    imgClassName="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-300"
                    videoClassName="w-full h-auto object-cover"
                    autoPlay={false}
                    controls={true}
                    muted={false}
                    loop={false}
                    playsInline={false}
                  />
                  {!isVideo && <div className="absolute inset-0 group-hover:opacity-100" />}
                </div>
              </div>
            )
          })}
        </div>

        {selectedMedia && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm p-4"
            onClick={() => setSelectedMediaIndex(null)}
          >
            <button
              className="absolute top-4 right-4 p-2 rounded-md text-foreground hover:bg-secondary transition-colors z-10"
              onClick={() => setSelectedMediaIndex(null)}
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="relative max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
              <Media
                resource={selectedMedia}
                imgClassName="w-full h-auto max-h-[85vh] object-contain rounded-lg"
                videoClassName="w-full h-auto max-h-[85vh] object-contain rounded-lg"
                priority
              />
            </div>
          </div>
        )}
      </section>
    )
  }

if (galleryBlock.format === 'carousel') {
    const [currentIndex, setCurrentIndex] = useState(0)
    const gallery = galleryBlock.gallery ?? []
    const count = gallery.length

    const goToNext = () => {
      setCurrentIndex((prev) => (prev + 1) % count)
    }

    const goToPrevious = () => {
      setCurrentIndex((prev) => (prev - 1 + count) % count)
    }

    const goToSlide = (index: number) => {
      setCurrentIndex(index)
    }

    if (count === 0) return null

    return (
      <section className="w-full">
        <div className="relative w-full">
          <div className="relative aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] lg:aspect-[3/1] overflow-hidden rounded-lg bg-muted">
            {gallery.map((item, index) => {
              const resource = item.image
              return (
                <div
                  key={index}
                  className={cn(
                    'absolute inset-0 transition-opacity duration-500',
                    index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  )}
                >
                  <Media
                    resource={resource}
                    imgClassName="w-full h-full object-cover"
                    videoClassName="w-full h-full object-cover"
                    autoPlay={index === currentIndex}
                    controls={false}
                    muted={true}
                    loop={true}
                    playsInline={true}
                  />
                </div>
              )
            })}

            {/* Previous Button */}
            {count > 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-background/80 hover:bg-background/95 backdrop-blur-sm"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            )}

            {/* Next Button */}
            {count > 1 && (
              <Button
                variant="ghost"
                size="icon"
                onClick={goToNext}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-background/80 hover:bg-background/95 backdrop-blur-sm"
                aria-label="Next slide"
              >
                <ChevronRight className="h-6 w-6" />
              </Button>
            )}

            <div className="absolute left-1/2 -translate-x-1/2 bottom-[10%] text-center z-20">
              <NavigationBlockUI {...galleryBlock} pageContext={pageContext} />
            </div>

            {count > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {gallery.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={cn(
                      'w-2 h-2 rounded-full transition-all',
                      index === currentIndex
                        ? 'bg-white w-8'
                        : 'bg-white/50 hover:bg-white/75'
                    )}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    )
  }

  if (galleryBlock.format === 'focus') {
    return <></>
  }

  return null
}
