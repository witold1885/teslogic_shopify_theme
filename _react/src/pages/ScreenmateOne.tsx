import React, { lazy, useEffect, useMemo, useRef } from 'react'
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

const ssrModules = import.meta.env.SSR
  ? import.meta.glob<any>('../components/ScreenmateOne/ScreenmateOne*.tsx', { eager: true })
  : {}

const clientModules = !import.meta.env.SSR
  ? import.meta.glob<any>('../components/ScreenmateOne/ScreenmateOne*.tsx')
  : {}

const sectionModules = import.meta.env.SSR ? ssrModules : clientModules

function getSectionComponent(filename: string) {
    const pathKey = Object.keys(sectionModules).find((key) => key.endsWith(`/${filename}.tsx`))

    if (!pathKey) {
        console.error(`[SSR/Client] Module not found: ${filename}`)
        return () => null
    }
    
    if (import.meta.env.SSR) {
        const mod = sectionModules[pathKey] as any
        return mod?.default || mod
    }

    return lazy(sectionModules[pathKey] as () => Promise<any>)
}

const ScreenmateOneFeatures = getSectionComponent('ScreenmateOneFeatures')
// const ScreenmateOneOrder = getSectionComponent('ScreenmateOneOrder')

const slugs: string[] = ['Setup', 'Convenience', 'Integration', 'Dash', 'Specifications', 'Complectation']
const blocks: Record<string, string[]> = {
    Convenience: ['dual-view-mode', 'beyond-basic-control'],
    Integration: ['familiar-interfaces', 'bigger-entertainment']
}
const sections: Record<string, React.ComponentType<any>> = slugs.reduce((acc, slug) => {
  acc[slug] = getSectionComponent(`ScreenmateOne${slug}`)
  return acc
}, {} as Record<string, React.ComponentType<any>>)

const ScreenmateOne: React.FC = () => {

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

    // const hash: string | null = useMemo(() => window.location.hash ? window.location.hash.replace('#', '') : null, [window.location.hash])

    // useEffect(() => {
    //     console.log({ hash })
    //     if (hash === 'order-now') {
    //         console.log('scrolling to order')
    //         scrollTo('Order')
    //     }
    // }, [hash])

    // useEffect(() => {
    //     const handleScrollToHash = () => {
    //         const currentHash = window.location.hash.replace('#', '')
    //         console.log({ currentHash })
    //         if (currentHash === 'order-now') {
    //             requestAnimationFrame(() => {
    //                 setTimeout(() => {
    //                     scrollTo('Order')
    //                 }, 1000)
    //             })
    //         }
    //     }

    //     handleScrollToHash()

    //     window.addEventListener('hashchange', handleScrollToHash)

    //     return () => window.removeEventListener('hashchange', handleScrollToHash)
    // }, [])

    return (
        <ProductLayout className="screenmate-one" onOrder={() => scrollTo('Order')}>
            <ScreenmateOneBanner
                onExpand={() => scrollTo('Features')}
                // onOrder={() => scrollTo('Order')}
            />
            <LazySection>
                <ScreenmateOneFeatures
                    ref={(el: HTMLDivElement) => setRef(el, 'Features')}
                    scrollTo={(anchor: string) => scrollTo(...(anchor?.split('.') as [slug: string | null, block?: string] || [null]))}
                />
            </LazySection>
            {Object.entries(sections).map(([slug, Component]) => (
                <LazySection key={slug}>
                    <Component ref={(el: HTMLDivElement) => setRef(el, slug)} />
                </LazySection>
            ))}
            {/* <LazySection> */}
                <ScreenmateOneOrder ref={(el: HTMLDivElement) => setRef(el, 'Order')} />
            {/* </LazySection> */}
        </ProductLayout>
    )
}

mountForShopify('react-screenmate-one-root', ScreenmateOne)

export default ScreenmateOne
