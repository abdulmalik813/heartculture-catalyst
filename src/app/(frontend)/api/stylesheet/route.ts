import { NextRequest, NextResponse } from "next/server";
import { getPayload } from "payload";
import configPromise from '@payload-config'
import { draftMode } from "next/headers";
import { unstable_cache } from "next/cache";
import { getCachedGlobal } from "@/lib/get-globals";

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
    let theme
    if (draft) {
        const payload = await getPayload({ config: configPromise })
        const result = await payload.find({
            collection: 'styles',
            limit: 100000,
            overrideAccess: true,
        })
        styles = result.docs
        theme = (await getCachedGlobal("settings", 0, true)).theme
    } else {
        theme = (await getCachedGlobal("settings")).theme
        styles = await getCachedStyles()
    }

    const combinedCSS = styles
        .map(style => style.stylesheet || '')
        .filter(css => css.trim() !== '')
        .join('\n\n')

    return new NextResponse("\n " + theme + "\n\n" + combinedCSS, {
        headers: {
            'Content-Type': 'text/css',
            'Cache-Control': 'no-store',
        }
    })
}