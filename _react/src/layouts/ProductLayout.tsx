import { useRef, type FC } from 'react'
import { preload } from 'react-dom'
import type { PreloadImage, PreloadVideo } from '../pages/types.ts'
import type { PromotionBannerBackground } from '../components/Promotion/types.ts'
import { getComponent } from './components'
import { getCurrentPromotion } from '../utils/promotion.ts'
import Layout, { type LayoutProps } from './Layout'
import LazySection from './LazySection'
import reviewsBackground from '../assets/images/reviews-background.png'

const PromotionBanner = getComponent(() => import('../components/Promotion/PromotionBanner.tsx'))
const Reviews = getComponent(() => import('../components/Reviews/Reviews.tsx'), true)

interface PreloadProps {
    images?: PreloadImage[]
    videos?: PreloadVideo[]
}

const promotionBackgrounds: Record<string, PromotionBannerBackground> = {
    bf26: { type: 'video', src: 'https://cdn.shopify.com/videos/c/o/v/fc26659e3e8f4009b89518b59bf703c5.mp4' }
}

const promotion = getCurrentPromotion()

const ProductLayout: FC<LayoutProps & PreloadProps> = ({ images, videos, className, onOrder, children }) => {
    const background = promotion ? promotionBackgrounds[promotion] : null

    if (typeof window !== 'undefined') {
        if (background) {
            const { type, src } = background
            preload(src, { as: type, fetchPriority: 'high' })
        }

        images?.forEach(({ image, fetchPriority, media }) => preload(image, { 
            as: 'image', 
            fetchPriority,
            ...(media && { media })
        }))

        videos?.forEach(({ video, fetchPriority, media }) => preload(video, { 
            as: 'video', 
            fetchPriority,
            ...(media && { media })
        }))

        preload(reviewsBackground, { as: 'image', fetchPriority: 'low' })
    }

    const childrenRef = useRef<HTMLDivElement>(null)

    const onExpand = () => {
        console.log(childrenRef?.current)
        childrenRef?.current?.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        })
    }

    return (
        <Layout theme="dark" orderButton={true} onOrder={onOrder}>
            {promotion && PromotionBanner && <PromotionBanner {...{promotion, background, onExpand}} />}
            <div ref={childrenRef} {...{className}}>
                {children}
                {Reviews && (
                    <LazySection>
                        <Reviews allSources={className === 'screenmate-dash' || className === 'powermate'} />
                    </LazySection>
                )}
            </div>
        </Layout>
    )
}

export default ProductLayout
