import { getCachedGlobal } from "@/lib/get-globals"
import { NavigationBar, Setting } from "@/payload-types"
import { draftMode } from "next/headers"
import { HeaderClient } from "./header-client"

export async function Header() {
  const { isEnabled } = await draftMode()
  const headerData = (await getCachedGlobal("navigationBar", 1, isEnabled)) as NavigationBar
  const settings = (await getCachedGlobal("settings", 1, isEnabled)) as Setting
  
  const lightLogo = settings.logo
  const darkLogo = settings?.logoDark ?? settings.logo
  if (typeof lightLogo !== "object" || typeof darkLogo !== "object") return null
  return (
    <HeaderClient 
      headerData={headerData}
      lightLogo={lightLogo}
      darkLogo={darkLogo}
    />
  )
}