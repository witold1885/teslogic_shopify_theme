import { useState, useMemo, useCallback, type ComponentType, type FC } from 'react'
import '../assets/styles/powermate.scss'
import { mountForShopify } from './mount'
import { scrollToElementLazy } from '../utils/scroll'
import { useInlineStyles } from '../hooks/inline-styles'
import { usePowermateCompatibilityPopups } from '../hooks/powermate-compatibility-popups'
import { getComponent } from '../layouts/components'
import LazySection from '../layouts/LazySection'
import ProductLayout from '../layouts/ProductLayout'
import PowermateBanner from '../components/Powermate/PowermateBanner'

import bannerDesktopBackground from '../assets/images/powermate/powermate_banner_desktop.png'
import bannerMobileBackground from '../assets/images/powermate/powermate_banner_mobile.png'

const slugs: string[] = ['Experience', 'Using', 'Examples', 'Comparison']
const sectionHeights: Record<string, any> = {
    Experience: { desktop: 970, mobile: 1516 },
    Using: { desktop: 774, mobile: 1702 },
    Examples: { desktop: 1048, mobile: 1232.5 },
    Comparison: { desktop: 1268, mobile: 1094 },
    Compatibility: { desktop: 1002, mobile: 1462 },
    Order: { desktop: 1249, mobile: 1574 },
    Info: { desktop: 852, mobile: 836 },
}
const sections: Record<string, ComponentType<any>> = slugs.reduce((acc, slug) => {
  acc[slug] = getComponent(() => import(`../components/Powermate/Powermate${slug}.tsx`))
  return acc
}, {} as Record<string, ComponentType<any>>)

const PowermateCompatibility = getComponent(() => import('../components/Powermate/PowermateCompatibility.tsx'))
const PowermateOrder = getComponent(() => import('../components/Powermate/PowermateOrder.tsx'))
const PowermateInfo = getComponent(() => import('../components/Powermate/PowermateInfo.tsx'))
const PowermateCompatibilityPopups = getComponent(() => import('../components/Popup/Powermate/PowermateCompatibilityPopups.tsx'), true)

const Powermate: FC = () => {
    const { isMobile } = useInlineStyles()

    const mode = useMemo(() => !isMobile ? 'desktop' : 'mobile', [isMobile])

    const [forceRender, setForceRender] = useState<Record<string, boolean>>({ order: false })
    
    const onOrder = () => {
        scrollToElementLazy('shop-now', () => setForceRender(prev => ({ ...prev, order: true })))
    }
    
    const getMinHeight = useCallback((slug: string) => {
        return sectionHeights[slug]?.[mode] 
                ? `calc(${sectionHeights[slug][mode]} * 100vw / ${mode === 'desktop' ? '1440' : '390'})` 
                : undefined
    }, [mode])

    const {
        warningPopupOpen, setWarningPopupOpen,
        checkPopupOpen, setCheckPopupOpen,
        resultPopupOpen, setResultPopupOpen,
        handleWarning, handleCheck, handleConfirm, handleComplete, handleBoostOrder,
        resultPopupType
    } = usePowermateCompatibilityPopups()

    return (<>
        <LazySection minHeight="0px">
            {PowermateCompatibilityPopups && (
                <PowermateCompatibilityPopups
                    {...{
                        warningPopupOpen, setWarningPopupOpen,
                        checkPopupOpen, setCheckPopupOpen,
                        resultPopupOpen, setResultPopupOpen,
                        handleWarning, handleCheck, handleConfirm, handleComplete, handleBoostOrder,
                        resultPopupType
                    }}
                />
            )}
        </LazySection>
        <ProductLayout className="powermate" onOrder={onOrder}>
            <PowermateBanner {...{bannerDesktopBackground, bannerMobileBackground}} onOrder={onOrder} />
            {Object.entries(sections).map(([slug, Component]) => (
                <LazySection key={slug} minHeight={getMinHeight(slug)}>
                    <Component />
                </LazySection>
            ))}
            <LazySection minHeight={getMinHeight('Compatibility')}>
                <PowermateCompatibility onCompatibilityCheck={() => handleCheck(onOrder)} />
            </LazySection>
            <LazySection id="shop-now" minHeight={getMinHeight('Order')} forceRender={forceRender.order}>
                <PowermateOrder onCompatibilityWarning={handleWarning} />
            </LazySection>
            <LazySection minHeight={getMinHeight('Info')}>
                <PowermateInfo />
            </LazySection>
        </ProductLayout>
    </>)
}

mountForShopify('react-powermate-root', Powermate)

export default Powermate
