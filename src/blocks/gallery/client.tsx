'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import type { GalleryBlock, Media as MediaType } from '@/payload-types'
import { cn } from '@/lib/utils'
import { Media } from '@/components/media'
import { PageContext } from '@/types/page-context'
import { NavigationBlockUI } from '../navigation'

interface GalleryBlockClientProps {
  galleryBlock: GalleryBlock
  pageContext: PageContext
}

export function GalleryBlockClient({ galleryBlock, pageContext }: GalleryBlockClientProps) {
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(null)

  const selectedItem = selectedMediaIndex !== null 
    ? galleryBlock.gallery?.[selectedMediaIndex]
    : null
  const selectedMedia = selectedItem?.image && typeof selectedItem.image === 'object' 
    ? selectedItem.image as MediaType 
    : null
  
  // if (galleryBlock.format === 'grid') {
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
  // }

  // if (galleryBlock.format === "carousel") {
  //   const navigation = () => {
  //   // @ts-expect-error there may be some mismatch between the expected types here
  //     return <NavigationBlockUI {...galleryBlock} pageContext={pageContext} />
  //   }
  //   return <></>
  // }

  // if (galleryBlock.format === "focus") {

  //   return <></>
  // }
  
  // return null
}