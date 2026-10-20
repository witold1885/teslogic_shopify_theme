import React, { useState, useRef, useMemo, useCallback } from 'react'
import { preload } from 'react-dom'
import '../assets/styles/screenmate-one.scss'
import { mountForShopify } from './mount'
import { getComponent } from '../layouts/components'
import LazySection from '../layouts/LazySection'
import ProductLayout from '../layouts/ProductLayout'
import ScreenmateOneBanner from '../components/ScreenmateOne/ScreenmateOneBanner'

import {
    bannerDesktop as bannerDesktopBackground,
    bannerMobile as bannerMobileBackground
} from '../assets/videos/screenmate-one/web/screenshots'
import {
    bannerDesktop,
    bannerMobile,
    streamingDesktop,
    streamingMobile,
    navigationDesktop,
    navigationMobile,
    gamingDesktop,
    gamingMobile,
    socialDesktop,
    socialMobile,
    dualViewModeDesktop,
    dualViewModeMobile,
    beyondBasicControlsDesktop,
    beyondBasicControlsMobile,
    carPlayAndAndroidAutoDesktop,
    carPlayAndAndroidAutoMobile,
    connectConsolesDesktop,
    connectConsolesMobile
} from '../assets/videos/screenmate-one'

import { mediaDesktop, mediaMobile, useInlineStyles } from '../hooks/inline-styles'
import { scrollToElementLazy } from '../utils/scroll'

interface PreloadContent {
    fetchPriority?: "high" | "low" | "auto"
    media?: string
}

interface PreloadImage extends PreloadContent {
    image: string
}

interface PreloadVideo extends PreloadContent {
    video: string
}

const preloadImages: PreloadImage[] = [
    { image: bannerDesktopBackground, fetchPriority: 'high', media: mediaDesktop },
    { image: bannerMobileBackground, fetchPriority: 'high', media: mediaMobile },
]

const preloadVideos: PreloadVideo[] = [
    { video: bannerDesktop, fetchPriority: 'high', media: mediaDesktop },
    { video: bannerMobile, fetchPriority: 'high', media: mediaMobile },
    { video: streamingDesktop, fetchPriority: 'high', media: mediaDesktop },
    { video: streamingMobile, fetchPriority: 'high', media: mediaMobile },
    { video: navigationDesktop, fetchPriority: 'low', media: mediaDesktop },
    { video: navigationMobile, fetchPriority: 'low', media: mediaMobile },
    { video: gamingDesktop, fetchPriority: 'low', media: mediaDesktop },
    { video: gamingMobile, fetchPriority: 'low', media: mediaMobile },
    { video: socialDesktop, fetchPriority: 'low', media: mediaDesktop },
    { video: socialMobile, fetchPriority: 'low', media: mediaMobile },
    { video: dualViewModeDesktop, fetchPriority: 'low', media: mediaDesktop },
    { video: dualViewModeMobile, fetchPriority: 'low', media: mediaMobile },
    { video: beyondBasicControlsDesktop, fetchPriority: 'low', media: mediaDesktop },
    { video: beyondBasicControlsMobile, fetchPriority: 'low', media: mediaMobile },
    { video: carPlayAndAndroidAutoDesktop, fetchPriority: 'low', media: mediaDesktop },
    { video: carPlayAndAndroidAutoMobile, fetchPriority: 'low', media: mediaMobile },
    { video: connectConsolesDesktop, fetchPriority: 'low', media: mediaDesktop },
    { video: connectConsolesMobile, fetchPriority: 'low', media: mediaMobile },
]

const slugs: string[] = ['Setup', 'Interfaces', 'Convenience', 'Experience', 'Dash', 'Specifications', 'Complectation']
const sectionHeights: Record<string, any> = {
    Features: { desktop: 1186, mobile: 502 },
    Setup: { desktop: 1003, mobile: 655 },
    Interfaces: { desktop: 1414, mobile: 984 },
    Convenience: { desktop: 3248, mobile: 2186 },
    Experience: { desktop: 1394, mobile: 1244 },
    Dash: { desktop: 852, mobile: 898 },
    Specifications: { desktop: 2031, mobile: 1517 },
    Complectation: { desktop: 1484, mobile: 2187 },
    Order: { desktop: 810, mobile: 1044 }
}
const blocks: Record<string, string[]> = {
    Convenience: ['dual-view-mode', 'beyond-basic-control']
}
const sections: Record<string, React.ComponentType<any>> = slugs.reduce((acc, slug) => {
  acc[slug] = getComponent(() => import(`../components/ScreenmateOne/ScreenmateOne${slug}.tsx`))
  return acc
}, {} as Record<string, React.ComponentType<any>>)

const ScreenmateOneFeatures = getComponent(() => import('../components/ScreenmateOne/ScreenmateOneFeatures.tsx'))
const ScreenmateOneOrder = getComponent(() => import('../components/ScreenmateOne/ScreenmateOneOrder.tsx'))

const ScreenmateOne: React.FC = () => {
    const { isMobile } = useInlineStyles()
    
    const mode = useMemo(() => !isMobile ? 'desktop' : 'mobile', [isMobile])

    if (typeof window !== 'undefined') {
        preloadImages.forEach(({ image, fetchPriority, media }) => preload(image, { 
            as: 'image', 
            fetchPriority,
            ...(media && { media })
        }))

        preloadVideos.forEach(({ video, fetchPriority, media }) => preload(video, { 
            as: 'video', 
            fetchPriority,
            ...(media && { media })
        }))
    }

    const [forceRender, setForceRender] = useState<Record<string, boolean>>({ order: false })

    const onExpand = () => {
        scrollTo('Features')
    }

    const onOrder = () => {
        scrollToElementLazy('order-now', () => setForceRender(prev => ({ ...prev, order: true })))
    }
    
    const getMinHeight = useCallback((slug: string) => {
        return sectionHeights[slug][mode] 
             ? `calc(${sectionHeights[slug][mode]} * 100vw / ${mode === 'desktop' ? '1440' : '390'})` 
             : undefined
    }, [mode])

    const sectionRefs = useRef<Record <string, any>>({})

    const setRef = (el: HTMLDivElement, slug: string) => {
        if (el) sectionRefs.current[slug] = el
        else delete sectionRefs.current[slug]
    }

    const scrollTo = (slug: string | null, block?: string) => {
        if (slug) {
            let target = sectionRefs.current[slug]
            if (block && blocks[slug].includes(block)) {
                target = sectionRefs.current[slug]?.getBlock(block)
            }
            target?.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            })
        }
    }

    return (
        <ProductLayout className="screenmate-one" onOrder={onOrder}>
            <ScreenmateOneBanner
                bannerDesktopVideo={bannerDesktop}
                bannerMobileVideo={bannerMobile}
                {...{bannerDesktopBackground, bannerMobileBackground, onExpand, onOrder}}
            />
            <LazySection minHeight={getMinHeight('Features')}>
                <ScreenmateOneFeatures
                    ref={(el: HTMLDivElement) => setRef(el, 'Features')}
                    scrollTo={(anchor: string) => scrollTo(...(anchor?.split('.') as [slug: string | null, block?: string] || [null]))}
                />
            </LazySection>
            {Object.entries(sections).map(([slug, Component]) => (
                <LazySection key={slug} minHeight={getMinHeight(slug)}>
                    <Component ref={(el: HTMLDivElement) => setRef(el, slug)} />
                </LazySection>
            ))}
            <LazySection id="order-now" minHeight={getMinHeight('Order')} forceRender={forceRender.order}>
                <ScreenmateOneOrder ref={(el: HTMLDivElement) => setRef(el, 'Order')} />
            </LazySection>
        </ProductLayout>
    )
}

mountForShopify('react-screenmate-one-root', ScreenmateOne)

export default ScreenmateOne
