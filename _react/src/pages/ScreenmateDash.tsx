import { useState, useMemo, useCallback, type ComponentType, type FC } from 'react'
import { preload } from 'react-dom'
import '../assets/styles/screenmate-dash.scss'
import { mountForShopify } from './mount'
import { getComponent } from '../layouts/components'
import LazySection from '../layouts/LazySection'
import ProductLayout from '../layouts/ProductLayout'
import ScreenmateDashBanner from '../components/ScreenmateDash/ScreenmateDashBanner'

import bannerDesktopBackground from '../assets/images/screenmate-dash/banner_desktop.png'
import bannerMobileBackground from '../assets/images/screenmate-dash/banner_mobile.png'

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
    { image: bannerDesktopBackground, fetchPriority: 'high', media: mediaDesktop },
    { image: bannerMobileBackground, fetchPriority: 'high', media: mediaMobile },
]

const slugs: string[] = ['Screens', 'DevicesSupporting', 'Significant', 'Shortcuts', 'Box', 'Bloggers']
const sectionHeights: Record<string, any> = {
    Using: { desktop: 748, mobile: 1698 },
    Screens: { desktop: 1240, mobile: 1054 },
    DevicesSupporting: { desktop: 996, mobile: 892 },
    Significant: { desktop: 760, mobile: 660 },
    Shortcuts: { desktop: 2252, mobile: 2127.5 },
    Box: { desktop: 1331, mobile: 1814 },
    Bloggers: { desktop: 965, mobile: 715 },
    Order: { desktop: 976, mobile: 970 }
}
const sections: Record<string, ComponentType<any>> = slugs.reduce((acc, slug) => {
  acc[slug] = getComponent(() => import(`../components/ScreenmateDash/ScreenmateDash${slug}.tsx`))
  return acc
}, {} as Record<string, ComponentType<any>>)

const ScreenmateDashUsing = getComponent(() => import('../components/ScreenmateDash/ScreenmateDashUsing.tsx'))
const ScreenmateDashOrder = getComponent(() => import('../components/ScreenmateDash/ScreenmateDashOrder.tsx'))

const ScreenmateDash: FC = () => {
    const { isMobile } = useInlineStyles()

    const mode = useMemo(() => !isMobile ? 'desktop' : 'mobile', [isMobile])

    if (typeof window !== 'undefined') {
        preloadImages.forEach(({ image, fetchPriority, media }) => preload(image, { 
            as: 'image', 
            fetchPriority,
            ...(media && { media })
        }))
    }

    const [forceRender, setForceRender] = useState<Record<string, boolean>>({ using: false, order: false })

    const onExpand = () => {
        scrollToElementLazy('using', () => setForceRender(prev => ({ ...prev, using: true })))
    }

    const onOrder = () => {
        scrollToElementLazy('shop-now', () => setForceRender(prev => ({ ...prev, order: true })))
    }

    const getMinHeight = useCallback((slug: string) => {
        return sectionHeights[slug][mode] 
             ? `calc(${sectionHeights[slug][mode]} * 100vw / ${mode === 'desktop' ? '1440' : '390'})` 
             : undefined
    }, [mode])

    return (
        <ProductLayout className="screenmate-dash" onOrder={onOrder}>
            <ScreenmateDashBanner onExpand={onExpand} onOrder={onOrder} />
            <LazySection id="using" minHeight={getMinHeight('Using')} forceRender={forceRender.using} rootMargin="-10px">
                <ScreenmateDashUsing />
            </LazySection>
            {Object.entries(sections).map(([slug, Component]) => (
                <LazySection key={slug} minHeight={getMinHeight(slug)}>
                    <Component />
                </LazySection>
            ))}
            <LazySection id="shop-now" minHeight={getMinHeight('Order')} forceRender={forceRender.order}>
                <ScreenmateDashOrder />
            </LazySection>
        </ProductLayout>
    )
}

mountForShopify('react-screenmate-dash-root', ScreenmateDash)

export default ScreenmateDash
