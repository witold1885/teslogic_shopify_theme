import React, { lazy } from 'react'
import { preload } from 'react-dom'
import '../assets/styles/screenmate-dash.scss'
import { mountForShopify } from './mount'
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

const ssrModules = import.meta.env.SSR
  ? import.meta.glob<any>('../components/ScreenmateDash/ScreenmateDash*.tsx', { eager: true })
  : {}

function getSectionComponent(filename: string) {
    if (import.meta.env.SSR) {
        const pathKey = Object.keys(ssrModules).find((key) => key.endsWith(`/${filename}.tsx`))

        if (!pathKey) {
            console.error(`[SSR/Client] Module not found: ${filename}`)
            return () => null
        }

        const mod = ssrModules[pathKey] as any
        return mod?.default || mod
    }

    return lazy(() => import(`../components/ScreenmateDash/${filename}.tsx`))
}

const ScreenmateDashUsing = getSectionComponent('ScreenmateDashUsing')

const slugs: string[] = ['Screens', 'DevicesSupporting', 'Significant', 'Shortcuts', 'Box', 'Bloggers', 'Order']
const sections: Record<string, React.ComponentType<any>> = slugs.reduce((acc, slug) => {
  acc[slug] = getSectionComponent(`ScreenmateDash${slug}`)
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
            <ScreenmateDashBanner />
            <LazySection>
                <ScreenmateDashUsing />
            </LazySection>
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
