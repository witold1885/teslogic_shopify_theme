import type { FC } from 'react'
import type { PromotionBannerProps } from './types'
import BlackFridayHero from './BlackFridayHero'

const promotionComponents: Record<string, FC<PromotionBannerProps>> = {
    bf26: BlackFridayHero
}

const PromotionBanner: FC<PromotionBannerProps> = ({ promotion, background, onExpand }) => {
    console.log({ promotion })
    const Component = promotion ? promotionComponents[promotion] : null
    
    return Component ? (
        <Component className="promotion-banner" background={background} onExpand={onExpand} />
    ) : null
}

export default PromotionBanner
