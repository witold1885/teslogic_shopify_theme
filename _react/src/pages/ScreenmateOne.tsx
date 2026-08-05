import React, { lazy, Suspense, useRef } from 'react'
import { preload } from 'react-dom'
import '../assets/styles/screenmate-one.scss'
import { mountForShopify } from './mount'
import LazySection from '../layouts/LazySection'
import ProductLayout from '../layouts/ProductLayout'
import ScreenmateOneBanner from '../components/ScreenmateOne/ScreenmateOneBanner'
import ScreenmateOneOrder from '../components/ScreenmateOne/ScreenmateOneOrder'

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

import { mediaDesktop, mediaMobile } from '../hooks/inline-styles'

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

const ScreenmateOneFeatures = lazy(() => import('../components/ScreenmateOne/ScreenmateOneFeatures'))

const slugs: string[] = ['Setup', 'Convenience', 'Integration', 'Dash', 'Specifications', 'Complectation']
const blocks: Record<string, string[]> = {
    Convenience: ['dual-view-mode', 'beyond-basic-control'],
    Integration: ['familiar-interfaces', 'bigger-entertainment']
}
const sections: Record<string, React.ComponentType<any>> = slugs.reduce((acc, slug) => ({
    ...acc,
    [slug]: lazy(() => import(`../components/ScreenmateOne/ScreenmateOne${slug}.tsx`))
}), {})

const ScreenmateOne: React.FC = () => {

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
        <ProductLayout className="screenmate-one" onOrder={() => scrollTo('Order')}>
            <ScreenmateOneBanner
                onExpand={() => scrollTo('Features')}
                onOrder={() => scrollTo('Order')}
            />
            <LazySection>
                <Suspense>
                    <ScreenmateOneFeatures
                        ref={(el: HTMLDivElement) => setRef(el, 'Features')}
                        scrollTo={(anchor) => scrollTo(...(anchor?.split('.') as [slug: string | null, block?: string] || [null]))}
                    />
                </Suspense>
            </LazySection>
            {Object.entries(sections).map(([slug, Component]) => (
                <LazySection key={slug}>
                    <Suspense>
                        <Component ref={(el: HTMLDivElement) => setRef(el, slug)} />
                    </Suspense>
                </LazySection>
            ))}
            <ScreenmateOneOrder ref={(el: HTMLDivElement) => setRef(el, 'Order')} />
        </ProductLayout>
    )
}

mountForShopify('react-screenmate-one-root', ScreenmateOne)

export default ScreenmateOne
