'use client'

import { cn } from '@/lib/utils'
import React from 'react'
import Video from 'next-video'
import type { Props as MediaProps } from './types'
import { getMediaUrl } from '@/lib/get-media-url'

export const VideoMedia: React.FC<MediaProps> = (props) => {
  const {
    onClick,
    resource,
    videoClassName,
    autoPlay = true,
    controls = true,
    loop = true,
    muted = true,
    playsInline = true,
  } = props

  if (resource && typeof resource === 'object') {
    return (
      <Video
        src={getMediaUrl(resource.url)}
        autoPlay={autoPlay}
        controls={controls}
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        onClick={onClick}
        className={cn(videoClassName)}
      />
    )
  }

  return null
}
