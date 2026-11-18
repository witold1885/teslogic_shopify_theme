import type { FC } from 'react'
import { preload } from 'react-dom'
import type { PromotionBannerProps, PromotionBannerBackground } from './types'
import { getCurrentPromotion } from '../../utils/promotion'
import BlackFridayHero from './BlackFridayHero'

const promotionComponents: Record<string, FC<PromotionBannerProps>> = {
    bf26: BlackFridayHero
}

const promotionBackgrounds: Record<string, PromotionBannerBackground> = {
    bf26: { type: 'video', src: 'https://cdn.shopify.com/videos/c/o/v/fc26659e3e8f4009b89518b59bf703c5.mp4' }
}

const promotion = getCurrentPromotion()

const PromotionBanner: FC<PromotionBannerProps> = ({ onExpand }) => {
    const background = promotion ? promotionBackgrounds[promotion] : null

    if (background && typeof window !== 'undefined') {
        const { type, src } = background
        preload(src, { as: type, fetchPriority: 'high' })
    }

    const Component = promotion ? promotionComponents[promotion] : null
    
    return Component ? (
        <Component className="promotion-banner" background={background} onExpand={onExpand} />
    ) : null
}

export default PromotionBanner
