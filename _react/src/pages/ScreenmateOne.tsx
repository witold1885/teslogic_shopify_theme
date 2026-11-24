import { useState, useEffect, useRef, type ComponentType, type FC } from 'react'
import type { PreloadImage, PreloadVideo } from './types.ts'
import '../assets/styles/screenmate-one.scss'
import { mountForShopify } from './mount'
import { scrollToElementLazy } from '../utils/scroll'
import { mediaDesktop, mediaMobile } from '../hooks/inline-styles'
import { usePreSections, type PreSection } from '../hooks/pre-sections.ts'
import { getComponent } from '../layouts/components'
import { usePowermateCompatibilityPopups } from '../hooks/powermate-compatibility-popups.ts'
import { useBundleSection } from '../hooks/bundle-section.ts'
import { useHashChange } from '../hooks/hash-change.ts'
import LazySection from '../layouts/LazySection'
import ProductLayout from '../layouts/ProductLayout'
import ScreenmateOneBanner from '../components/ScreenmateOne/ScreenmateOneBanner'

import {
    bannerDesktop as bannerDesktopBackground,
    bannerMobile as bannerMobileBackground
} from '../assets/videos/screenmate-one/web/screenshots'
import dashBackground from '../assets/images/screenmate-one/dash-background.png'
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
import PowermateCompatibilityPopups from '../components/Popup/Powermate/PowermateCompatibilityPopups.tsx'

const preloadImages: PreloadImage[] = [
    { image: bannerDesktopBackground, fetchPriority: 'high', media: mediaDesktop },
    { image: bannerMobileBackground, fetchPriority: 'high', media: mediaMobile },
    { image: dashBackground, fetchPriority: 'low' },
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

const preSections: Record<string, PreSection> = {
    Features: { desktop: 1186, mobile: 502 },
    Setup: { desktop: 1003, mobile: 655 },
    Interfaces: { desktop: 1414, mobile: 984 },
    Convenience: { desktop: 3248, mobile: 2186, background: 'linear-gradient(#1d1d1f 0% 100%), #191919' },
    Experience: { desktop: 1394, mobile: 1244 },
    Dash: { desktop: 852, mobile: 898 },
    Specifications: { desktop: 2031, mobile: 1517 },
    Complectation: { desktop: 1484, mobile: 2187, background: 'linear-gradient(#1d1d1f00 0%, #202022 57.88%, #252528 100%)' },
    Order: { desktop: 810, mobile: 1044, background: 'radial-gradient(56.25% 100% at 50% 100%, #1d1d1f 0%, #0e0e0e 100%), linear-gradient(#fff 0%, #f6f6f6 100%)' }
}
const blocks: Record<string, string[]> = {
    Convenience: ['dual-view-mode', 'beyond-basic-control']
}
const sections: Record<string, ComponentType<any>> = ['Setup', 'Interfaces', 'Convenience', 'Experience', 'Dash', 'Specifications', 'Complectation'].reduce((acc, slug) => {
  acc[slug] = getComponent(() => import(`../components/ScreenmateOne/ScreenmateOne${slug}.tsx`))
  return acc
}, {} as Record<string, ComponentType<any>>)

const ScreenmateOneFeatures = getComponent(() => import('../components/ScreenmateOne/ScreenmateOneFeatures.tsx'))
const ScreenmateOneOrder = getComponent(() => import('../components/ScreenmateOne/ScreenmateOneOrder.tsx'))
const BundleSection = getComponent(() => import('../components/Promotion/BundleSection.tsx'))

const ScreenmateOne: FC = () => {    
    const { getPreSectionStyle } = usePreSections(preSections)

    const [forceRender, setForceRender] = useState<Record<string, boolean>>({ features: false, order: false, bundle: false })

    const onExpand = () => {
        scrollToElementLazy('features', () => setForceRender(prev => ({ ...prev, features: true })))
    }

    const onOrder = () => {
        scrollToElementLazy('order-now', () => setForceRender(prev => ({ ...prev, order: true })))
    }

    useHashChange('order-now', onOrder)

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

    const {
        warningPopupOpen, setWarningPopupOpen,
        checkPopupOpen, setCheckPopupOpen,
        resultPopupOpen, setResultPopupOpen,
        resultPopupType, isBundle,
        handleWarning, handleCheck, handleConfirm, handleComplete, handleBoostOrder
    } = usePowermateCompatibilityPopups()
    
    const { bundleSlug, bundleDiscount, bundleSectionShown } = useBundleSection()

    useEffect(() => {
        if (bundleSectionShown) {
            scrollToElementLazy('bundle', () => setForceRender(prev => ({ ...prev, bundle: true })))
        }
    }, [bundleSectionShown])

    return (<>
        {PowermateCompatibilityPopups && (warningPopupOpen || checkPopupOpen || resultPopupOpen)  && (
            <LazySection minHeight="0px" forceRender={true}>
                <PowermateCompatibilityPopups {...{
                    warningPopupOpen, setWarningPopupOpen,
                    checkPopupOpen, setCheckPopupOpen,
                    resultPopupOpen, setResultPopupOpen,
                    handleCheck, handleConfirm, handleComplete, handleBoostOrder,
                    resultPopupType, isBundle
                }} />
            </LazySection>
        )}
        <ProductLayout images={preloadImages} videos={preloadVideos} className="screenmate-one" onOrder={onOrder}>
            <ScreenmateOneBanner
                bannerDesktopVideo={bannerDesktop}
                bannerMobileVideo={bannerMobile}
                {...{bannerDesktopBackground, bannerMobileBackground, onExpand, onOrder}}
            />
            <LazySection id="features" {...getPreSectionStyle('Features')} forceRender={forceRender.features} rootMargin="-10px">
                <ScreenmateOneFeatures
                    ref={(el: HTMLDivElement) => setRef(el, 'Features')}
                    scrollTo={(anchor: string) => scrollTo(...(anchor?.split('.') as [slug: string | null, block?: string] || [null]))}
                />
            </LazySection>
            {Object.entries(sections).map(([slug, Component]) => (
                <LazySection key={slug} {...getPreSectionStyle(slug)}>
                    <Component ref={(el: HTMLDivElement) => setRef(el, slug)} />
                </LazySection>
            ))}
            <LazySection id="order-now" {...getPreSectionStyle('Order')} forceRender={forceRender.order}>
                <ScreenmateOneOrder ref={(el: HTMLDivElement) => setRef(el, 'Order')} />
            </LazySection>
            {BundleSection && bundleSectionShown && (
                <LazySection id="bundle" minHeight="0px" forceRender={forceRender.bundle}>
                    <BundleSection
                        slug={bundleSlug}
                        discount={bundleDiscount}
                        onCompatibilityCheck={handleCheck}
                        onCompatibilityWarning={handleWarning}
                        linkTo={{ href: '/pro', text: 'Powermate' }}
                    />
                </LazySection>
            )}
        </ProductLayout>
    </>)
}

mountForShopify('react-screenmate-one-root', ScreenmateOne)

export default ScreenmateOne
