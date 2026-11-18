export interface PromotionBannerProps {
    className?: string
    promotion?: string | null
    background?: PromotionBannerBackground | null
    onExpand: () => void
}

export interface PromotionBannerBackground {
    type: 'video' | 'image'
    src: string
}
