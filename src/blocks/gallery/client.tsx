'use client'

import { useState } from 'react'
import { X, ChevronLeft, ChevronRight, Play } from 'lucide-react'
import type { GalleryBlock, Media as MediaType } from '@/payload-types'
import { cn } from '@/lib/utils'
import { Media } from '@/components/media'
import { PageContext } from '@/types/page-context'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogClose,
} from '@/components/ui/dialog'

interface GalleryBlockClientProps {
  galleryBlock: GalleryBlock
  pageContext: PageContext
}

export function GalleryBlockClient({ galleryBlock, pageContext }: GalleryBlockClientProps) {
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(null)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [focusIndex, setFocusIndex] = useState(0)

  const selectedItem = selectedMediaIndex !== null 
    ? galleryBlock.gallery?.[selectedMediaIndex]
    : null
  const selectedMedia = selectedItem?.image && typeof selectedItem.image === 'object' 
    ? selectedItem.image as MediaType 
    : null
  
  const galleryItems = galleryBlock.gallery ?? []

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
                <button
                  className={cn(
                    'group relative overflow-hidden rounded-lg w-full block',
                    !isVideo && 'cursor-pointer'
                  )}
                  onClick={() => {
                    if (!isVideo) {
                      setSelectedMediaIndex(index)
                    }
                  }}
                  disabled={isVideo ? true : false}
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
                  {!isVideo && (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  )}
                </button>
              </div>
            )
          })}
        </div>

        <Dialog open={selectedMediaIndex !== null} onOpenChange={(open) => !open && setSelectedMediaIndex(null)}>
          <DialogContent className="max-w-7xl w-full p-0 border-0 bg-transparent">
            <DialogClose className="absolute top-4 right-4 z-50">
              <Button
                variant="secondary"
                size="icon"
                className="h-10 w-10 rounded-full shadow-lg"
              >
                <X className="h-5 w-5" />
                <span className="sr-only">Close</span>
              </Button>
            </DialogClose>
            
            {selectedMedia && (
              <div className="flex items-center justify-center p-4">
                <Media
                  resource={selectedMedia}
                  imgClassName="w-full h-auto max-h-[85vh] object-contain rounded-lg"
                  videoClassName="w-full h-auto max-h-[85vh] object-contain rounded-lg"
                  priority
                />
              </div>
            )}
          </DialogContent>
        </Dialog>
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
      <section className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <div className="relative max-w-6xl mx-auto">
          <div className="relative aspect-[16/9] overflow-hidden rounded-xl bg-muted">
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
          </div>

          <Button
            variant="outline"
            size="icon"
            className="absolute left-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-background/90 backdrop-blur-sm hover:bg-background shadow-lg"
            onClick={handlePrevious}
            aria-label="Previous"
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-4 top-1/2 -translate-y-1/2 h-12 w-12 rounded-full bg-background/90 backdrop-blur-sm hover:bg-background shadow-lg"
            onClick={handleNext}
            aria-label="Next"
          >
            <ChevronRight className="h-6 w-6" />
          </Button>

          <div className="text-center mt-6 text-sm text-muted-foreground font-medium">
            {carouselIndex + 1} / {galleryItems.length}
          </div>
        </div>
      </section>
    )
  }

  if (galleryBlock.format === 'focus') {
    const focusedItem = galleryItems[focusIndex]
    const focusedResource = focusedItem?.image
    const isFocusedVideo =
      focusedResource && typeof focusedResource === 'object' && focusedResource.mimeType?.includes('video')

    return (
      <section className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <div className="max-w-5xl mx-auto">
          {/* Main focused media */}
          <div className="relative aspect-video overflow-hidden rounded-xl bg-muted mb-6">
            <Media
              resource={focusedResource}
              imgClassName="w-full h-full object-contain"
              videoClassName="w-full h-full object-contain"
              autoPlay={false}
              controls={true}
              muted={false}
              loop={false}
              playsInline={false}
            />
          </div>

          {/* Thumbnail strip */}
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {galleryItems.map((item, index) => {
              const resource = item.image
              const isVideo =
                resource && typeof resource === 'object' && resource.mimeType?.includes('video')

              return (
                <Button
                  key={index}
                  variant="ghost"
                  onClick={() => setFocusIndex(index)}
                  className={cn(
                    'relative flex-shrink-0 w-24 h-24 p-0 overflow-hidden rounded-lg border-2 transition-all hover:opacity-100',
                    focusIndex === index
                      ? 'border-primary ring-2 ring-primary/20 opacity-100'
                      : 'border-border opacity-70 hover:border-primary/50'
                  )}
                >
                  <Media
                    resource={resource}
                    imgClassName="w-full h-full object-cover"
                    videoClassName="w-full h-full object-cover"
                  />
                  
                  {isVideo && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/40 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                        <Play className="h-4 w-4 text-black ml-0.5" fill="currentColor" />
                      </div>
                    </div>
                  )}

                  {focusIndex === index && (
                    <div className="absolute inset-0 border-2 border-primary rounded-lg pointer-events-none" />
                  )}
                </Button>
              )
            })}
          </div>
        </div>
      </section>
    )
  }
  
  return null
}