import { useMemo, type FC } from 'react'
import type { PromotionBannerProps } from './types'
import BlackFridayHero from './BlackFridayHero'

const promotionDates: Record<string, string[]> = {
    bf26: ['2026-11-27', '2026-11-29']
}

const promotionComponents: Record<string, FC<PromotionBannerProps>> = {
    bf26: BlackFridayHero
}

const PromotionBanner: FC<PromotionBannerProps> = ({ onExpand }) => {
    const Component: FC<PromotionBannerProps> | null = useMemo(() => {
        const now = new Date().getTime()

        for (const [key, [startDate, endDate]] of Object.entries(promotionDates)) {
            const start = new Date(startDate)
            start.setHours(0, 0, 0, 0)
            const end = new Date(endDate)
            end.setHours(23, 59, 59, 999)
            if (now >= start.getTime() && now <= end.getTime()) {
                return promotionComponents[key] || null
            }
        }

        const urlSearchParams: URLSearchParams | null = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
        const promotion = urlSearchParams?.get('promotion') || null
        return promotion ? promotionComponents[promotion] : null
    }, [])
    
    return Component ? (
        <Component onExpand={onExpand} />
    ) : null
}

export default PromotionBanner
