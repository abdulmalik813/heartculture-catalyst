import { NavigationBar } from "@/payload-types"
import { NavigationItem } from "./navigation-item"

interface DesktopNavProps {
  navigation?: NavigationBar['navigation']
  cta?: NavigationBar['cta']
  style: NavigationBar['style']
}

export function DesktopNav({ navigation, cta, style }: DesktopNavProps) {
  const layoutMap = {
    default: "hidden md:flex items-center gap-6",
    transparent: "hidden md:flex items-center gap-8",
    floating: "hidden md:flex items-center gap-6",
    glass: "hidden md:flex items-center gap-8",
    minimal: "hidden md:flex items-center gap-4",
    centered: "hidden md:flex items-center gap-6",
    split: "hidden md:flex items-center justify-center gap-6",
    sidebar: "flex flex-col gap-3 w-full"
  }

  const ctaLayoutMap = {
    default: "hidden md:flex items-center gap-4",
    transparent: "hidden md:flex items-center gap-4",
    floating: "hidden md:flex items-center gap-3",
    glass: "hidden md:flex items-center gap-4",
    minimal: "hidden md:flex items-center gap-3",
    centered: "hidden md:flex items-center gap-4",
    split: "hidden md:flex items-center justify-end gap-4",
    sidebar: "flex flex-col gap-2 w-full mt-auto"
  }

  if (style === 'centered') {
    return (
      <div className="hidden md:flex flex-col items-center gap-4 w-full">
        <nav className={layoutMap[style]}>
          {navigation?.map((item) => (
            <NavigationItem key={item.id} item={item} />
          ))}
        </nav>
        {cta?.ctaLinks && cta.ctaLinks.length > 0 && (
          <div className={ctaLayoutMap[style]}>
            {cta.ctaLinks.map((item) => (
              <NavigationItem key={item.id} item={item} isCTA />
            ))}
          </div>
        )}
      </div>
    )
  }

  if (style === 'split') {
    return (
      <>
        <nav className={layoutMap[style]}>
          {navigation?.map((item) => (
            <NavigationItem key={item.id} item={item} />
          ))}
        </nav>
        {cta?.ctaLinks && cta.ctaLinks.length > 0 && (
          <div className={ctaLayoutMap[style]}>
            {cta.ctaLinks.map((item) => (
              <NavigationItem key={item.id} item={item} isCTA />
            ))}
          </div>
        )}
      </>
    )
  }

  return (
    <div className="hidden md:flex items-center gap-8">
      <nav className={layoutMap[style]}>
        {navigation?.map((item) => (
          <NavigationItem key={item.id} item={item} />
        ))}
      </nav>
      {cta?.ctaLinks && cta.ctaLinks.length > 0 && (
        <div className={ctaLayoutMap[style]}>
          {cta.ctaLinks.map((item) => (
            <NavigationItem key={item.id} item={item} isCTA />
          ))}
        </div>
      )}
    </div>
  )
}