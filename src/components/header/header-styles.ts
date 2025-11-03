import { NavigationBar } from "@/payload-types"
import { cn } from "@/lib/utils"

export function getHeaderStyles(
  headerData: NavigationBar,
  isScrolled: boolean,
  isHidden: boolean
) {
  const baseStyles = "w-full transition-all duration-300 z-50"
  
  // Position styles
  const positionStyles = {
    static: "",
    sticky: "sticky top-0",
    hide: "sticky top-0",
    shrink: "sticky top-0"
  }[headerData.behavior]

  // Hide behavior
  const hideStyles = isHidden ? "-translate-y-full" : "translate-y-0"

  // Style-specific base styles
  const styleMap = {
    default: "bg-background border-b",
    transparent: isScrolled ? "bg-background/80 backdrop-blur-md border-b" : "bg-transparent",
    floating: cn(
      "mx-auto mt-4 max-w-7xl rounded-full border",
      isScrolled ? "bg-background/95 backdrop-blur-md shadow-lg" : "bg-background/80 backdrop-blur-sm"
    ),
    glass: "bg-background/30 backdrop-blur-xl border-b border-white/10",
    minimal: "bg-transparent",
    centered: "bg-background border-b",
    split: "bg-background border-b",
    sidebar: "fixed left-0 top-0 h-screen w-64 border-r bg-background"
  }[headerData.style]

  // Background override (only for applicable styles)
  let backgroundStyle = styleMap
  if (headerData.style !== 'transparent' && headerData.style !== 'glass' && headerData.background) {
    const bgMap = {
      opaque: "bg-background",
      blur: "bg-background/80 backdrop-blur-md",
      gradient: "bg-gradient-to-r from-background via-background/95 to-background"
    }
    backgroundStyle = bgMap[headerData.background]
  }

  // Shadow
  const shadowStyle = headerData.shadow && (isScrolled || headerData.style === 'floating') 
    ? "shadow-md" 
    : ""

  // Border
  const borderStyle = headerData.border && headerData.style !== 'floating'
    ? "border-b" 
    : ""

  // Shrink behavior
  const shrinkStyles = headerData.behavior === 'shrink' && isScrolled
    ? "py-2"
    : headerData.style === 'floating'
    ? "py-2 px-4"
    : "py-4"

  const containerStyles = cn(
    baseStyles,
    positionStyles,
    hideStyles,
    backgroundStyle,
    shadowStyle,
    borderStyle,
    shrinkStyles
  )

  // Inner container styles based on layout
  const innerMap = {
    default: "container mx-auto flex items-center justify-between px-4",
    transparent: "container mx-auto flex items-center justify-between px-4",
    floating: "flex items-center justify-between px-6",
    glass: "container mx-auto flex items-center justify-between px-4",
    minimal: "container mx-auto flex items-center justify-between px-4",
    centered: "container mx-auto flex flex-col items-center justify-center gap-4 px-4",
    split: "container mx-auto grid grid-cols-3 items-center px-4",
    sidebar: "flex flex-col items-start gap-8 p-6"
  }[headerData.style]

  return {
    container: containerStyles,
    inner: innerMap
  }
}