import { PAYLOAD } from '@/constants/init'
import { getServerSideURL } from './get-url'

export const generatePreviewPath = (path: string = "home") => {

  const encodedParams = new URLSearchParams({
    path,
    previewSecret: PAYLOAD.PREVIEW,
  })

  return `${getServerSideURL()}/api/draft/enable?${encodedParams.toString()}`
}