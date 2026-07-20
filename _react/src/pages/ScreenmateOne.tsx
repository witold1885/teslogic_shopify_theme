import React, { lazy, Suspense, useRef } from 'react'
import { preload } from 'react-dom'
import '../assets/styles/screenmate-one.scss'
import { mountForShopify } from './mount'
import LazySection from '../layouts/LazySection'
import ProductLayout from '../layouts/ProductLayout'
import ScreenmateOneBanner from '../components/ScreenmateOne/ScreenmateOneBanner'
import ScreenmateOneFeatures from '../components/ScreenmateOne/ScreenmateOneFeatures'
import ScreenmateOneOrder from '../components/ScreenmateOne/ScreenmateOneOrder'

import { bannerDesktop as bannerDesktopVideo, bannerMobile as bannerMobileVideo } from '../assets/videos/screenmate-one'
import {
    streaming as streamingVideo,
    navigation as navigationVideo,
    gaming as gamingVideo,
    social as socialVideo
} from '../assets/videos/screenmate-one'

const preloadVideos: string[] = [
    bannerDesktopVideo,
    bannerMobileVideo,
    streamingVideo,
    navigationVideo,
    gamingVideo,
    socialVideo,
]

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

    preloadVideos.forEach(video => preload(video, { 
        as: 'video', 
        fetchPriority: 'high' 
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
            <Suspense>
                <ScreenmateOneFeatures
                    ref={(el: HTMLDivElement) => setRef(el, 'Features')}
                    scrollTo={(anchor) => scrollTo(...(anchor?.split('.') as [slug: string | null, block?: string] || [null]))}
                />
            </Suspense>
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
