import React from 'react'
import { preload } from 'react-dom'
import '../assets/styles/screenmate-dash.scss'
import { mountForShopify } from './mount'
import { getComponent } from '../layouts/components'
import LazySection from '../layouts/LazySection'
import ProductLayout from '../layouts/ProductLayout'
import ScreenmateDashBanner from '../components/ScreenmateDash/ScreenmateDashBanner'

import bannerDesktop from '../assets/images/screenmate-dash/banner_desktop.png'
import bannerMobile from '../assets/images/screenmate-dash/banner_mobile.png'

import { mediaDesktop, mediaMobile } from '../hooks/inline-styles'

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

const slugs: string[] = ['Using', 'Screens', 'DevicesSupporting', 'Significant', 'Shortcuts', 'Box', 'Bloggers', 'Order']
const sections: Record<string, React.ComponentType<any>> = slugs.reduce((acc, slug) => {
  acc[slug] = getComponent(() => import(`../components/ScreenmateDash/ScreenmateDash${slug}.tsx`))
  return acc
}, {} as Record<string, React.ComponentType<any>>)

const ScreenmateDash: React.FC = () => {
    if (typeof window !== 'undefined') {
        preloadImages.forEach(({ image, fetchPriority, media }) => preload(image, { 
            as: 'image', 
            fetchPriority,
            ...(media && { media })
        }))
    }

    return (
        <ProductLayout className="screenmate-dash">
            <ScreenmateDashBanner {...{bannerDesktop, bannerMobile}} />
            {Object.entries(sections).map(([slug, Component]) => (
                <LazySection key={slug}>
                    <Component />
                </LazySection>
            ))}
        </ProductLayout>
    )
}

mountForShopify('react-screenmate-dash-root', ScreenmateDash)

export default ScreenmateDash
