import { PAYLOAD } from '@/constants/init'

export const generatePreviewPath = (path: string = 'home') => {
  const encodedParams = new URLSearchParams({
    path,
    previewSecret: PAYLOAD.PREVIEW,
  })

  return `/next/preview?${encodedParams.toString()}`
}
