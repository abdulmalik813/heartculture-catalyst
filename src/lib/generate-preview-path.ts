import { PAYLOAD } from '@/constants/init'

export const generatePreviewPath = (path: string = "home") => {

  const encodedParams = new URLSearchParams({
    path,
    previewSecret: PAYLOAD.PREVIEW,
  })

  const url = `/next/preview?${encodedParams.toString()}`

  return url
}