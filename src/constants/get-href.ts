export function getHref(link: any) {
  return link?.type === 'custom'
    ? link.url
    : link?.reference?.relationTo === 'pages'
      ? typeof link.reference.value === 'object'
        ? `/${link.reference.value.slug}`
        : null
      : null
}
