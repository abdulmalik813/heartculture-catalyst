import { Media } from "@/payload-types"
import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface LogoProps {
  lightLogo: Media
  darkLogo: Media
  style: 'default' | 'transparent' | 'floating' | 'glass' | 'minimal' | 'centered' | 'split' | 'sidebar'
  className?: string
}

export function Logo({ lightLogo, darkLogo, style, className }: LogoProps) {
  const logoUrl = typeof lightLogo === 'object' ? lightLogo.url : null
  const darkLogoUrl = typeof darkLogo === 'object' ? darkLogo.url : null

  if (!logoUrl) return null

  const sizeMap = {
    default: "h-8 w-auto",
    transparent: "h-10 w-auto",
    floating: "h-8 w-auto",
    glass: "h-10 w-auto",
    minimal: "h-8 w-auto",
    centered: "h-12 w-auto",
    split: "h-8 w-auto",
    sidebar: "h-10 w-auto"
  }

  return (
    <Link href="/" className={cn("relative flex-shrink-0", className)}>
      {/* Light mode logo */}
      <Image
        src={logoUrl}
        alt="Logo"
        width={150}
        height={40}
        className={cn(sizeMap[style], "dark:hidden")}
        priority
      />
      
      {/* Dark mode logo */}
      {darkLogoUrl && (
        <Image
          src={darkLogoUrl}
          alt="Logo"
          width={150}
          height={40}
          className={cn(sizeMap[style], "hidden dark:block")}
          priority
        />
      )}
    </Link>
  )
}