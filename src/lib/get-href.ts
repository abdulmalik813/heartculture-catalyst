export function getHref(link: any) {
  if (link.type === 'postListingPage') {
    return `/${link?.postListingPageUrl}`
  }
  return link?.type === 'custom'
    ? link.url
    : link?.reference?.relationTo === 'pages'
      ? typeof link.reference.value === 'object'
        ? link.reference.value.slug === 'home'
          ? '/'
          : `/${link.reference.value.slug}`
        : null
      : null
}
