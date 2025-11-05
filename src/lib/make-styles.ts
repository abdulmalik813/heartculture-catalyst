import { Style } from "@/payload-types"

export function joinStyles (
  ...items: (Style | string | undefined | null | (Style | string | number)[] )[]
): string {
  let mapClass = ''
  let stringClass = ''

  for (const item of items) {
    if (Array.isArray(item)) {
      mapClass += ' ' + item
        .map((i) => (typeof i === 'object' && i !== null && i.alias ? sanitizeAlias(i.alias) : i))
        .filter(Boolean)
        .join(' ')
    } else if (typeof item === 'string') {
      stringClass += ` ${item}`
    }
  }
  
  const trimmedStringClass = stringClass.trim();
  const trimmedMapClass = mapClass.trim();

  return [trimmedStringClass, trimmedMapClass].filter(Boolean).join(' ');
}

function sanitizeAlias(alias: string): string {
  return alias
    .toLowerCase()             
    .trim()                    
    .replace(/\s+/g, '-')      
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')       
    .replace(/^-|-$/g, '');    
}