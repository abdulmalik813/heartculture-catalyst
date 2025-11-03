import { getCachedGlobal } from '@/lib/get-globals'
import { Setting } from '@/payload-types'
import { draftMode } from 'next/headers'

export async function getAppSettings() {
  const { isEnabled } = await draftMode()
  const settings = (await getCachedGlobal('settings', 1, isEnabled)) as Setting

  const fallbackImage = typeof settings.fallbackImage === 'object' ? settings?.fallbackImage?.url : ''
  const favIconPng = typeof settings.favIconPng === 'object' ? settings?.favIconPng?.url : null
  const favIconSvg = typeof settings.favIconSvg === 'object' ? settings?.favIconSvg?.url : null
  const favIcon = typeof settings.favIcon === 'object' ? settings?.favIcon?.url : null

  return {
    appTitle: settings.appTitle,
    appDescription: settings.appDescription,
    fallbackImage,
    favIcon,
    favIconPng,
    favIconSvg
  }
}
