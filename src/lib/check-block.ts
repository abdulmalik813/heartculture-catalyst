import { Post, Page } from "@/payload-types"

export const checkBlock = (page: Post | Page, blockName: string): boolean => {
  let blockFound = false

  const traverse = (obj: any): void => {
    if (!obj || typeof obj !== 'object' || blockFound) return

    if (
      typeof obj === 'object' &&
      'blockType' in obj &&
      obj.blockType === blockName
    ) {
      blockFound = true
      return
    }

    if (Array.isArray(obj)) {
      obj.forEach(item => traverse(item))
      return
    }

    if (obj.root && obj.root.children) {
      traverse(obj.root.children)
    }

    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key]
        
        if (key === 'blocks' && Array.isArray(value)) {
          traverse(value)
        }
        
        if (key === 'layout' && Array.isArray(value)) {
          traverse(value)
        }
        
        if (typeof value === 'object' && value !== null) {
          traverse(value)
        }
      }
    }
  }

  traverse(page)
  return blockFound
}