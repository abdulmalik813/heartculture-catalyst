import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from '@payload-config'
import { draftMode } from "next/headers";
import { unstable_cache } from "next/cache";

const getCachedStyles = unstable_cache(
    async () => {
        const payload = await getPayload({ config: configPromise })
        const result = await payload.find({
            collection: 'styles',
            limit: 100000,
        })
        return result.docs
    },
    ['styles-cache'],
    {
        tags: ['styles-tag'],
        revalidate: false
    }
)

export async function GET(req: NextRequest) {
    const { isEnabled: draft } = await draftMode()

    let styles;

    if (draft) {
        const payload = await getPayload({ config: configPromise })
        const result = await payload.find({
            collection: 'styles',
            limit: 100000,
            overrideAccess: true,
        })
        styles = result.docs
    } else {
        styles = await getCachedStyles()
    }

    const combinedCSS = styles
        .map(style => style.stylesheet || '')
        .filter(css => css.trim() !== '')
        .join('\n\n')

    return new NextResponse("\n " + combinedCSS, {
        headers: {
            'Content-Type': 'text/css',
            'Cache-Control': 'no-store',
        }
    })
}