import React, { useMemo, useState } from 'react'
import { preload } from 'react-dom'
import '../assets/styles/screenmate-dash.scss'
import { mountForShopify } from './mount'
import { getComponent } from '../layouts/components'
import LazySection from '../layouts/LazySection'
import ProductLayout from '../layouts/ProductLayout'
import ScreenmateDashBanner from '../components/ScreenmateDash/ScreenmateDashBanner'

import bannerDesktop from '../assets/images/screenmate-dash/banner_desktop.png'
import bannerMobile from '../assets/images/screenmate-dash/banner_mobile.png'

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

const slugs: string[] = ['Using', 'Screens', 'DevicesSupporting', 'Significant', 'Shortcuts', 'Box', 'Bloggers']
const sectionHeights: Record<string, any> = {
    Using: { desktop: 748, mobile: 1698 },
    Screens: { desktop: 1240, mobile: 1054 },
    DevicesSupporting: { desktop: 636, mobile: 700 },
    Significant: { desktop: 760, mobile: 660 },
    Shortcuts: { desktop: 2252, mobile: 2127.5 },
    Box: { desktop: 1331, mobile: 1814 },
    Bloggers: { desktop: 965, mobile: 715 }
}
const sections: Record<string, React.ComponentType<any>> = slugs.reduce((acc, slug) => {
  acc[slug] = getComponent(() => import(`../components/ScreenmateDash/ScreenmateDash${slug}.tsx`))
  return acc
}, {} as Record<string, React.ComponentType<any>>)

const ScreenmateDashOrder = getComponent(() => import('../components/ScreenmateDash/ScreenmateDashOrder.tsx'))

const ScreenmateDash: React.FC = () => {
    const { isMobile } = useInlineStyles()

    const mode = useMemo(() => !isMobile ? 'desktop' : 'mobile', [isMobile])

    if (typeof window !== 'undefined') {
        preloadImages.forEach(({ image, fetchPriority, media }) => preload(image, { 
            as: 'image', 
            fetchPriority,
            ...(media && { media })
        }))
    }

    const [forceRenderOrder, setForceRenderOrder] = useState(false)

    return (
        <ProductLayout className="screenmate-dash">
            <ScreenmateDashBanner
                {...{bannerDesktop, bannerMobile}}
                onOrder={() => scrollToElementLazy('shop-now', () => setForceRenderOrder(true), 80)}
            />
            {Object.entries(sections).map(([slug, Component], index) => (
                <LazySection
                    key={slug}
                    minHeight={
                        sectionHeights[slug][mode] 
                            ? `calc(${sectionHeights[slug][mode]} * 100vw / ${mode === 'desktop' ? '1440' : '390'})` 
                            : undefined
                    }
                    {...(index === 0 ? { rootMargin: '-10px' } : {})}
                >
                    <Component />
                </LazySection>
            ))}
            <LazySection id="shop-now" minHeight="810px" forceRender={forceRenderOrder}>
                <ScreenmateDashOrder />
            </LazySection>
        </ProductLayout>
    )
}

mountForShopify('react-screenmate-dash-root', ScreenmateDash)

export default ScreenmateDash
