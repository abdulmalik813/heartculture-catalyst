'use client'

import { useState } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { GalleryBlock, Media as MediaType } from '@/payload-types'
import { cn } from '@/lib/utils'
import { Media } from '@/components/media'
import { Button } from '@/components/ui/button'
import { PageContext } from '@/types/page-context'
import { NavigationBlockUI } from '../navigation'

interface GalleryBlockClientProps {
  galleryBlock: GalleryBlock
  pageContext: PageContext
}

export function GalleryBlockClient({ galleryBlock, pageContext }: GalleryBlockClientProps) {
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(null)
  const [carouselIndex, setCarouselIndex] = useState(0)

  const galleryItems = galleryBlock.gallery ?? []

  const selectedItem = selectedMediaIndex !== null 
    ? galleryItems[selectedMediaIndex]
    : null
  const selectedMedia = selectedItem?.image && typeof selectedItem.image === 'object' 
    ? selectedItem.image as MediaType 
    : null
  
  if (galleryBlock.format === 'grid') {
    return (
      <section className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 md:gap-8 space-y-6 md:space-y-8">
          {galleryItems.map((item, index) => {
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
    const handlePrevious = () => {
      setCarouselIndex((prev) => (prev === 0 ? galleryItems.length - 1 : prev - 1))
    }

    const handleNext = () => {
      setCarouselIndex((prev) => (prev === galleryItems.length - 1 ? 0 : prev + 1))
    }

    const currentItem = galleryItems[carouselIndex]
    const resource = currentItem?.image

    return (
      <section className="w-full">
        <div className="relative w-full">
          <div className="relative aspect-[21/9] md:aspect-[3/1] overflow-hidden bg-muted">
            <Media
              resource={resource}
              imgClassName="w-full h-full object-cover"
              videoClassName="w-full h-full object-cover"
              autoPlay={false}
              controls={true}
              muted={false}
              loop={false}
              playsInline={false}
            />
            
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/20 pointer-events-none" />
          </div>

          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 h-10 w-10 md:h-12 md:w-12 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background shadow-lg border-background/20"
            onClick={handlePrevious}
            aria-label="Previous"
          >
            <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 h-10 w-10 md:h-12 md:w-12 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background shadow-lg border-background/20"
            onClick={handleNext}
            aria-label="Next"
          >
            <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
          </Button>

          <div className="absolute bottom-4 md:bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {galleryItems.map((_, index) => (
              <button
                key={index}
                onClick={() => setCarouselIndex(index)}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  index === carouselIndex 
                    ? "w-8 bg-foreground" 
                    : "w-2 bg-foreground/40 hover:bg-foreground/60"
                )}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          <div className="absolute top-4 right-4 md:top-6 md:right-6 px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm text-xs md:text-sm font-medium shadow-lg">
            {carouselIndex + 1} / {galleryItems.length}
          </div>
        </div>
        
        {/* @ts-expect-error there may be some mismatch between the expected types here */}
        <NavigationBlockUI {...galleryBlock} pageContext={pageContext} />
      </section>
    )
  }

  if (galleryBlock.format === "focus") {
    return <></>
  }
  
  return null
}