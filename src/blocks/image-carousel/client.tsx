'use client'

import { useId, useMemo } from 'react'
import { ImageCarouselBlock } from '@/payload-types'
import type { Media as MediaResource } from '@/payload-types'
import { PageContext } from '@/types/page-context'
import { Media } from '@/components/media'

export function ImageCarouselBlockClient({
  pageContext,
  ...imageCarouselBlock
}: Partial<ImageCarouselBlock> & { pageContext: PageContext }) {
  const id = `ic-${useId().replaceAll(':', '-')}`

  const rawMedias = (imageCarouselBlock?.medias || [])

  const medias = useMemo(() => {
    return (rawMedias || []).filter((m): m is MediaResource => typeof m !== 'number')
  }, [rawMedias])

  if (!medias || medias.length === 0) return null

  const slides = useMemo(() => [...medias, ...medias], [medias])
  const duration = Math.max(10, medias.length * 4)

  return (
    <section className="w-full">
      <style>{`
        .carousel-wrap-${id} { overflow: hidden; }
        .carousel-track-${id} { display: flex; gap: 0; }
        .carousel-slide-${id} { flex: 0 0 100%; }
        @media (min-width: 768px) {
          .carousel-slide-${id} { flex: 0 0 33.333%; }
        }
        .carousel-anim-${id} { display: flex; animation: scroll-${id} ${duration}s linear infinite; }
        @keyframes scroll-${id} { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
      `}</style>

      <div className={`carousel-wrap-${id}`}>
        <div className={`carousel-anim-${id}`}>
          <div className={`carousel-track-${id}`}>
            {slides.map((m, i) => (
              <div key={i++} className={`carousel-slide-${id}`}>
                <div className="relative w-full h-48 md:h-64">
                  {m ? (
                    <Media resource={m} imgClassName="w-full h-full object-cover" />
                  ) : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
