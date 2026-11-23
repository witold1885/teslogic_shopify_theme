import { useState, type ComponentType, type FC } from 'react'
import '../assets/styles/powermate.scss'
import { mountForShopify } from './mount'
import { scrollToElementLazy } from '../utils/scroll'
import { getPreloadImages } from '../utils/preload.ts'
import { usePreSections, type PreSection } from '../hooks/pre-sections.ts'
import { getComponent } from '../layouts/components'
import { usePowermateCompatibilityPopups } from '../hooks/powermate-compatibility-popups.ts'
import { useBundlePopup } from '../hooks/bundle-popup.ts'
import LazySection from '../layouts/LazySection'
import ProductLayout from '../layouts/ProductLayout'
import PowermateBanner from '../components/Powermate/PowermateBanner'

import bannerDesktopBackground from '../assets/images/powermate/powermate_banner_desktop.png'
import bannerMobileBackground from '../assets/images/powermate/powermate_banner_mobile.png'
import bothBackground from '../assets/images/powermate/experience/pro-experience-both-bg.png'
import bothImage from '../assets/images/powermate/experience/pro-experience-both-image-desktop.png'
import comparisonBackground from '../assets/images/powermate/comparison/pro_comparison_bg.png'

const modelImageModules: Record<string, any> = import.meta.glob('@/assets/images/powermate/examples/pro-model-*.svg', { eager: true })
const modelImages: Record<string, any> = Object.entries(modelImageModules).reduce((acc, [key, mod]) => ({
    ...acc,
    [key.replace('/src/assets/images/powermate/examples/pro-model-', '').replace('.svg', '')]: mod.default
}), {})

const preloadImages = getPreloadImages(modelImages)
preloadImages.push({ image: bothBackground, fetchPriority: 'low' })
preloadImages.push({ image: bothImage, fetchPriority: 'low' })
preloadImages.push({ image: comparisonBackground, fetchPriority: 'low' })

const preSections: Record<string, PreSection> = {
    Experience: { desktop: 970, mobile: 1516, background: '#0a0a0a' },
    Using: { desktop: 774, mobile: 1702, background: '#101010' },
    Examples: { desktop: 1048, mobile: 1232.5, background: 'linear-gradient(#171717 0%, #2d2d2d 100%)' },
    Comparison: { desktop: 1268, mobile: 1094 },
    Compatibility: { desktop: 1002, mobile: 1462, background: 'linear-gradient(#2d2d2d 0%, #181818 33.25%, #171717 54.93%)' },
    Order: { desktop: 1249, mobile: 1574, background: '#020202' },
    Info: { desktop: 852, mobile: 836, background: '#121212' },
}

const sections: Record<string, ComponentType<any>> = ['Using', 'Examples', 'Comparison'].reduce((acc, slug) => {
  acc[slug] = getComponent(() => import(`../components/Powermate/Powermate${slug}.tsx`))
  return acc
}, {} as Record<string, ComponentType<any>>)

const PowermateExperience = getComponent(() => import('../components/Powermate/PowermateExperience.tsx'))
const PowermateCompatibility = getComponent(() => import('../components/Powermate/PowermateCompatibility.tsx'))
const PowermateOrder = getComponent(() => import('../components/Powermate/PowermateOrder.tsx'))
const PowermateInfo = getComponent(() => import('../components/Powermate/PowermateInfo.tsx'))
const PowermateCompatibilityPopups = getComponent(() => import('../components/Popup/Powermate/PowermateCompatibilityPopups.tsx'), true)
const BundlePopup = getComponent(() => import('../components/Popup/Bundle/BundlePopup.tsx'))

const Powermate: FC = () => {
    const { getPreSectionStyle } = usePreSections(preSections)

    const [forceRender, setForceRender] = useState<Record<string, boolean>>({ order: false })
    
    const onOrder = () => {
        scrollToElementLazy('shop-now', () => setForceRender(prev => ({ ...prev, order: true })))
    }

    const {
        warningPopupOpen, setWarningPopupOpen,
        checkPopupOpen, setCheckPopupOpen,
        resultPopupOpen, setResultPopupOpen,
        resultPopupType, isBundle,
        handleWarning, handleCheck, handleConfirm, handleComplete, handleBoostOrder
    } = usePowermateCompatibilityPopups()
    
    const { bundleSlug, bundleDiscount, bundlePopupOpen, setBundlePopupOpen } = useBundlePopup()

    const handleBundlePopupOpen = () => {
        setBundlePopupOpen(true)
    }

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
        {BundlePopup && (
            <LazySection minHeight="0px" forceRender={true}>
                <BundlePopup
                    slug={bundleSlug}
                    discount={bundleDiscount}
                    open={bundlePopupOpen}
                    onClose={() => setBundlePopupOpen(false)}
                    onCompatibilityCheck={handleCheck}
                    onCompatibilityWarning={handleWarning}
                />
            </LazySection>
        )}
        <ProductLayout images={preloadImages} className="powermate" onOrder={onOrder}>
            <PowermateBanner {...{bannerDesktopBackground, bannerMobileBackground}} onOrder={onOrder} />
            <LazySection {...getPreSectionStyle('Experience')} rootMargin="-10px">
                <PowermateExperience />
            </LazySection>
            {Object.entries(sections).map(([slug, Component]) => (
                <LazySection key={slug} {...getPreSectionStyle(slug)}>
                    <Component />
                </LazySection>
            ))}
            <LazySection {...getPreSectionStyle('Compatibility')}>
                <PowermateCompatibility onCompatibilityCheck={() => handleCheck(onOrder)} />
            </LazySection>
            <LazySection id="shop-now" {...getPreSectionStyle('Order')} forceRender={forceRender.order}>
                <PowermateOrder onCompatibilityWarning={handleWarning} onBundlePopupOpen={handleBundlePopupOpen} />
            </LazySection>
            <LazySection {...getPreSectionStyle('Info')}>
                <PowermateInfo />
            </LazySection>
        </ProductLayout>
    </>)
}

mountForShopify('react-powermate-root', Powermate)

export { PowermateBanner }
export default Powermate
