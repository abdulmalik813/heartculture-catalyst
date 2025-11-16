'use client'

import { useState, useRef } from 'react'
import { X } from 'lucide-react'
import type { GalleryBlock } from '@/payload-types'
import { cn } from '@/lib/utils'
import { Media } from '@/components/media'
import { PageContext } from '@/types/page-context'
import { NavigationBlockUI } from '../navigation'
import { Card } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import Autoplay from 'embla-carousel-autoplay'

interface GalleryBlockClientProps {
  galleryBlock: GalleryBlock
  pageContext: PageContext
}

export function GalleryBlockClient({ galleryBlock, pageContext }: GalleryBlockClientProps) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null)
  const autoplayPlugin = useRef(
    Autoplay({
      delay: 4000,
      stopOnInteraction: true,
      stopOnMouseEnter: true,
    })
  )

  const selectedItem = selectedImage !== null ? galleryBlock.gallery?.[selectedImage] : null

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
                      setSelectedImage(index)
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

        {selectedItem && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 backdrop-blur-sm p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 p-2 rounded-md text-foreground hover:bg-secondary transition-colors z-10"
              onClick={() => setSelectedImage(null)}
              aria-label="Close"
            >
              <X className="h-6 w-6" />
            </button>

            <div className="relative max-w-6xl w-full" onClick={(e) => e.stopPropagation()}>
              <Media
                resource={selectedItem.image}
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
    return (
      <section className="container mx-auto px-4 py-8 md:py-12">
        <div className="relative">
          <Carousel
            className="w-full"
            plugins={[autoplayPlugin.current]}
            opts={{
              loop: true,
              align: 'center',
            }}
          >
            <CarouselContent>
              {(galleryBlock.gallery ?? []).map((item, index) => (
                <CarouselItem key={index}>
                  <Card className="overflow-hidden bg-muted">
                    <div className="flex items-center justify-center h-[350px] md:h-[450px] lg:h-[500px]">
                      <Media
                        resource={item.image}
                        imgClassName="w-full h-full object-contain"
                        videoClassName="w-full h-full object-contain"
                      />
                    </div>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex" />
            <CarouselNext className="hidden md:flex" />
          </Carousel>
          <div className="flex justify-center mt-6">
            <NavigationBlockUI 
              {...galleryBlock} 
              pageContext={pageContext}
              className="mx-auto"
            />
          </div>
        </div>
      </section>
    )
  }

  if (galleryBlock.format === 'focus') {
    const focusItem = galleryBlock.gallery?.[0]
    if (!focusItem) return null

    const resource = focusItem.image
    const isVideo = resource && typeof resource === 'object' && resource.mimeType?.includes('video')

    return (
      <section className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
        <div className="max-w-5xl mx-auto">
          <div className="relative aspect-video rounded-xl overflow-hidden bg-muted shadow-2xl">
            <Media
              resource={resource}
              imgClassName="w-full h-full object-cover"
              videoClassName="w-full h-full object-cover"
              autoPlay={true}
              controls={true}
              muted={true}
              loop={true}
              playsInline={true}
            />
          </div>

          {/* Thumbnail Gallery */}
          {galleryBlock.gallery && galleryBlock.gallery.length > 1 && (
            <div className="mt-8 grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {galleryBlock.gallery.map((item, index) => {
                const thumbResource = item.image
                const isThumbVideo =
                  thumbResource &&
                  typeof thumbResource === 'object' &&
                  thumbResource.mimeType?.includes('video')
                
                const thumbnailUrl = isThumbVideo && 
                  thumbResource.videoThumbnail &&
                  typeof thumbResource.videoThumbnail === 'object'
                  ? thumbResource.videoThumbnail
                  : thumbResource

                return (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={cn(
                      'relative aspect-video rounded-lg overflow-hidden bg-muted transition-all duration-300',
                      'hover:ring-2 hover:ring-primary hover:scale-105',
                      selectedImage === index ? 'ring-2 ring-primary scale-105' : 'opacity-70'
                    )}
                  >
                    <Media
                      resource={thumbnailUrl}
                      imgClassName="w-full h-full object-cover"
                      videoClassName="w-full h-full object-cover"
                      autoPlay={false}
                      controls={false}
                      muted={true}
                      loop={false}
                      playsInline={false}
                    />
                    {isThumbVideo && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                        <div className="w-8 h-8 rounded-full bg-white/90 flex items-center justify-center">
                          <div className="w-0 h-0 border-l-[8px] border-l-black border-t-[5px] border-t-transparent border-b-[5px] border-b-transparent ml-1" />
                        </div>
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          )}

          <div className="flex justify-center mt-8">
            <NavigationBlockUI 
              {...galleryBlock} 
              pageContext={pageContext}
              className="mx-auto"
            />
          </div>
        </div>
      </section>
    )
  }
}