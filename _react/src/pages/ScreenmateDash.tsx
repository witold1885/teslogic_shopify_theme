import { useState, type ComponentType, type FC } from 'react'
import { preload } from 'react-dom'
import '../assets/styles/screenmate-dash.scss'
import { mountForShopify } from './mount'
import { scrollToElementLazy } from '../utils/scroll'
import { getPreloadImages } from '../utils/preload.ts'
import { useMinHeights, type SectionHeight } from '../hooks/min-heights.ts'
import { getComponent } from '../layouts/components'
import LazySection from '../layouts/LazySection'
import ProductLayout from '../layouts/ProductLayout'
import ScreenmateDashBanner from '../components/ScreenmateDash/ScreenmateDashBanner'

import bannerDesktopBackground from '../assets/images/screenmate-dash/screenmate_dash_banner_desktop.png'
import bannerMobileBackground from '../assets/images/screenmate-dash/screenmate_dash_banner_mobile.png'

const screenImageModules: Record<string, any> = import.meta.glob('@/assets/images/screenmate-dash/screens/screens/*.png', { eager: true })
const screenImages: Record<string, any> = Object.entries(screenImageModules).reduce((acc, [key, mod]) => ({
    ...acc,
    [key.replace('/src/assets/images/screenmate-dash/screens/screens/', '').replace('.png', '')]: mod.default
}), {})
const deviceImageModules: Record<string, any> = import.meta.glob('@/assets/images/screenmate-dash/devices/devices_supporting-*.png', { eager: true })
const deviceImages: Record<string, any> = Object.entries(deviceImageModules).reduce((acc, [key, mod]) => ({
    ...acc,
    [key.replace('/src/assets/images/screenmate-dash/devices/devices_supporting-', '').replace('.png', '')]: mod.default
}), {})
const shortcutImageModules: Record<string, any> = import.meta.glob('@/assets/images/screenmate-dash/shortcuts/shortcuts-*.png', { eager: true })
const shortcutImages: Record<string, any> = Object.entries(shortcutImageModules).reduce((acc, [key, mod]) => ({
    ...acc,
    [key.replace('/src/assets/images/screenmate-dash/shortcuts/shortcuts-', '').replace('.png', '')]: mod.default
}), {})

const preloadImages = getPreloadImages(screenImages, deviceImages, shortcutImages)

const sectionHeights: Record<string, SectionHeight> = {
    Using: { desktop: 748, mobile: 1698 },
    Screens: { desktop: 1240, mobile: 1054 },
    DevicesSupporting: { desktop: 996, mobile: 892 },
    Significant: { desktop: 760, mobile: 660 },
    Shortcuts: { desktop: 2252, mobile: 2127.5 },
    Box: { desktop: 1331, mobile: 1814 },
    Bloggers: { desktop: 965, mobile: 715 },
    Order: { desktop: 976, mobile: 970 }
}

const sections: Record<string, { component: ComponentType<any>, params: any }> = Object.entries({
    'Screens': { screenImages },
    'DevicesSupporting': { images: deviceImages },
    'Significant': {},
    'Shortcuts': { images: shortcutImages},
    'Box': {},
    'Bloggers': {}
}).reduce((acc, [slug, params]) => {
  acc[slug] = { component: getComponent(() => import(`../components/ScreenmateDash/ScreenmateDash${slug}.tsx`)), params }
  return acc
}, {} as Record<string, { component: ComponentType<any>, params: any }>)

const ScreenmateDashUsing = getComponent(() => import('../components/ScreenmateDash/ScreenmateDashUsing.tsx'))
const ScreenmateDashOrder = getComponent(() => import('../components/ScreenmateDash/ScreenmateDashOrder.tsx'))

const ScreenmateDash: FC = () => {
    if (typeof window !== 'undefined') {
        preloadImages.forEach(({ image, fetchPriority, media }) => preload(image, { 
            as: 'image', 
            fetchPriority,
            ...(media && { media })
        }))
    }

    const { getMinHeight } = useMinHeights(sectionHeights)

    const [forceRender, setForceRender] = useState<Record<string, boolean>>({ using: false, order: false })

    const onExpand = () => {
        scrollToElementLazy('using', () => setForceRender(prev => ({ ...prev, using: true })))
    }

    const onOrder = () => {
        scrollToElementLazy('shop-now', () => setForceRender(prev => ({ ...prev, order: true })))
    }

    return (
        <ProductLayout className="screenmate-dash" onOrder={onOrder}>
            <ScreenmateDashBanner {...{bannerDesktopBackground, bannerMobileBackground}} onExpand={onExpand} onOrder={onOrder} />
            <LazySection id="using" minHeight={getMinHeight('Using')} forceRender={forceRender.using} rootMargin="-10px">
                <ScreenmateDashUsing />
            </LazySection>
            {Object.entries(sections).map(([slug, { component: Component, params }]) => (
                <LazySection key={slug} minHeight={getMinHeight(slug)}>
                    <Component {...params} />
                </LazySection>
            ))}
            <LazySection id="shop-now" minHeight={getMinHeight('Order')} forceRender={forceRender.order}>
                <ScreenmateDashOrder />
            </LazySection>
        </ProductLayout>
    )
}

mountForShopify('react-screenmate-dash-root', ScreenmateDash)

export { ScreenmateDashBanner }
export default ScreenmateDash
