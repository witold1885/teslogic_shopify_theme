import { useState, type ComponentType, type FC } from 'react'
import '../assets/styles/screenmate-dash.scss'
import { mountForShopify } from './mount'
import { scrollToElementLazy } from '../utils/scroll'
import { useMinHeights, type SectionHeight } from '../hooks/min-heights.ts'
import { getComponent } from '../layouts/components'
import LazySection from '../layouts/LazySection'
import ProductLayout from '../layouts/ProductLayout'
import ScreenmateDashBanner from '../components/ScreenmateDash/ScreenmateDashBanner'

import bannerDesktopBackground from '../assets/images/screenmate-dash/screenmate_dash_banner_desktop.png'
import bannerMobileBackground from '../assets/images/screenmate-dash/screenmate_dash_banner_mobile.png'

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

const sections: Record<string, ComponentType<any>> = ['Screens', 'DevicesSupporting', 'Significant', 'Shortcuts', 'Box', 'Bloggers'].reduce((acc, slug) => {
  acc[slug] = getComponent(() => import(`../components/ScreenmateDash/ScreenmateDash${slug}.tsx`))
  return acc
}, {} as Record<string, ComponentType<any>>)

const ScreenmateDashUsing = getComponent(() => import('../components/ScreenmateDash/ScreenmateDashUsing.tsx'))
const ScreenmateDashOrder = getComponent(() => import('../components/ScreenmateDash/ScreenmateDashOrder.tsx'))

const ScreenmateDash: FC = () => {
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

export { ScreenmateDashBanner }
export default ScreenmateDash
