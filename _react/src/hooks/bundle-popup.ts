import { useState, useEffect } from 'react'
import { getCurrentPromotion } from '../utils/promotion'

const promotion = getCurrentPromotion()

export const useBundlePopup = () => {
    const [bundleSlug, setBundleSlug] = useState<string | undefined>(undefined)
    const [bundleDiscount, setBundleDiscount] = useState<number | undefined>(undefined)
    const [bundlePopupOpen, setBundlePopupOpen] = useState<boolean>(false)

    useEffect(() => {
        const urlSearchParams: URLSearchParams | null = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
        const bundle: string | null = urlSearchParams?.get('bundle') || null
        const offer: string | null = urlSearchParams?.get('offer') || null
        
        setBundleDiscount(promotion === 'bf26vip' && offer === 'vip' ? 30 : (promotion === 'bf26' ? 25 : 20))

        if (bundle === 'boost' || bundle === 'performance') {
            setBundleSlug(`one-powermate-${bundle}`)
            setBundlePopupOpen(true)
        }
    }, [])

    return { bundleSlug, bundleDiscount, bundlePopupOpen, setBundlePopupOpen }
}
