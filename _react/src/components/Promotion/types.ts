export interface PromotionBannerProps {
    className?: string
    background?: PromotionBannerBackground | null
    onExpand: () => void
}

export interface PromotionBannerBackground {
    type: 'video' | 'image'
    src: string
}
