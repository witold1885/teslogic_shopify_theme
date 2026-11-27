import { useState, useEffect } from 'react'
import { getCurrentPromotion } from '../utils/promotion'

const promotion = getCurrentPromotion()

export const useBundleSection = () => {
    const [bundleSlug, setBundleSlug] = useState<string | undefined>(undefined)
    const [bundleMode, setBundleMode] = useState<string | null>(null)
    const [bundleSectionShown, setBundleSectionShown] = useState<boolean>(false)
    const [bundleSectionScroll, setBundleSectionScroll] = useState<boolean>(false)

    useEffect(() => {
        const urlSearchParams: URLSearchParams | null = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
        const bundle: string | null = urlSearchParams?.get('bundle') || null
        const offer: string | null = urlSearchParams?.get('offer') || null
        const mode = promotion === 'bf26vip' && offer === 'vip' ? 'bf26vip' : promotion
        setBundleMode(mode)
        console.log({ bundle, offer, mode })

        if (bundle === 'boost' || bundle === 'performance') {
            setBundleSlug(`one-powermate-${bundle}`)
            setBundleSectionShown(true)
            setBundleSectionScroll(true)
        } else {
            setBundleSlug('one-powermate-boost')
            setBundleSectionShown(true)
        }
    }, [])

    return {
        bundleSlug, bundleMode,
        bundleSectionShown, setBundleSectionShown,
        bundleSectionScroll, setBundleSectionScroll
    }
}
