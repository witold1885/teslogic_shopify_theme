import React, { lazy } from 'react'
import '../assets/styles/screenmate-dash.scss'
import { mountForShopify } from './mount'
import LazySection from '../layouts/LazySection'
import ProductLayout from '../layouts/ProductLayout'
import ScreenmateDashBanner from '../components/ScreenmateDash/ScreenmateDashBanner'

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

const slugs: string[] = ['Screens', 'DevicesSupporting', 'Significant', 'Shortcuts', 'Box', 'Bloggers']
const sections: Record<string, React.ComponentType<any>> = slugs.reduce((acc, slug) => {
  acc[slug] = getSectionComponent(`ScreenmateDash${slug}`)
  return acc
}, {} as Record<string, React.ComponentType<any>>)

const ScreenmateDash: React.FC = () => (
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

mountForShopify('react-screenmate-dash-root', ScreenmateDash)

export default ScreenmateDash
