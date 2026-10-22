import { useState, useMemo, useCallback, type ComponentType, type FC } from 'react'
import { preload } from 'react-dom'
import '../assets/styles/powermate.scss'
import { mountForShopify } from './mount'
import { getComponent } from '../layouts/components'
import LazySection from '../layouts/LazySection'
import ProductLayout from '../layouts/ProductLayout'
import PowermateBanner from '../components/Powermate/PowermateBanner'

import bannerDesktop from '../assets/images/powermate/banner_desktop.png'
import bannerMobile from '../assets/images/powermate/banner_mobile.png'

import { mediaDesktop, mediaMobile, useInlineStyles } from '../hooks/inline-styles'
import { scrollToElementLazy } from '../utils/scroll'

interface PreloadContent {
    fetchPriority?: "high" | "low" | "auto"
    media?: string
}

interface PreloadImage extends PreloadContent {
    image: string
}

const preloadImages: PreloadImage[] = [
    { image: bannerDesktop, fetchPriority: 'high', media: mediaDesktop },
    { image: bannerMobile, fetchPriority: 'high', media: mediaMobile },
]

const slugs: string[] = ['Experience', 'Using', 'Examples', 'Comparison', 'Compatibility']
const sectionHeights: Record<string, any> = {
    Experience: { desktop: 970, mobile: 1516 },
    Using: { desktop: 774, mobile: 1702 },
    Examples: { desktop: 1048, mobile: 1232.5 },
    Comparison: { desktop: 1268, mobile: 1094 },
    Compatibility: { desktop: 1002, mobile: 1462 },
    Order: { desktop: 1249, mobile: undefined },
    Info: { desktop: 852, mobile: 836 },
}
const sections: Record<string, ComponentType<any>> = slugs.reduce((acc, slug) => {
  acc[slug] = getComponent(() => import(`../components/Powermate/Powermate${slug}.tsx`))
  return acc
}, {} as Record<string, ComponentType<any>>)

const PowermateOrder = getComponent(() => import('../components/Powermate/PowermateOrder.tsx'))
const PowermateInfo = getComponent(() => import('../components/Powermate/PowermateInfo.tsx'))

const Powermate: FC = () => {
    const { isMobile } = useInlineStyles()

    const mode = useMemo(() => !isMobile ? 'desktop' : 'mobile', [isMobile])
    
    if (typeof window !== 'undefined') {
        preloadImages.forEach(({ image, fetchPriority, media }) => preload(image, { 
            as: 'image', 
            fetchPriority,
            ...(media && { media })
        }))
    }

    const [forceRender, setForceRender] = useState<Record<string, boolean>>({ order: false })
    
    const onOrder = () => {
        scrollToElementLazy('shop-now', () => setForceRender(prev => ({ ...prev, order: true })))
    }
    
    const getMinHeight = useCallback((slug: string) => {
        return sectionHeights[slug]?.[mode] 
                ? `calc(${sectionHeights[slug][mode]} * 100vw / ${mode === 'desktop' ? '1440' : '390'})` 
                : undefined
    }, [mode])

    return (
        <ProductLayout className="powermate" onOrder={onOrder}>
            <PowermateBanner {...{bannerDesktop, bannerMobile}} onOrder={onOrder} />
            {Object.entries(sections).map(([slug, Component]) => (
                <LazySection key={slug} minHeight={getMinHeight(slug)}>
                    <Component />
                </LazySection>
            ))}
            <LazySection id="shop-now" minHeight={getMinHeight('Order')} forceRender={forceRender.order}>
                <PowermateOrder />
            </LazySection>
            <LazySection minHeight={getMinHeight('Info')}>
                <PowermateInfo />
            </LazySection>
        </ProductLayout>
    )
}

mountForShopify('react-powermate-root', Powermate)

export default Powermate
