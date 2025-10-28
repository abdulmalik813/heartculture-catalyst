import type { Redirect } from 'next/dist/lib/load-custom-routes'

const redirects = async (): Promise<Redirect[]> => {
  const internetExplorerRedirect: Redirect = {
    destination: '/ie-incompatible.html',
    has: [
      {
        type: 'header',
        key: 'user-agent',
        value: '(.*Trident.*)',
      },
    ],
    permanent: false,
    source: '/:path((?!ie-incompatible.html$).*)',
  }

  const redirects = [internetExplorerRedirect]

  return redirects
}

export default redirects