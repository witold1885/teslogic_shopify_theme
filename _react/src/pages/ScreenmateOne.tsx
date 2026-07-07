import React, { lazy, Suspense, useRef } from 'react'
import '../assets/styles/screenmate-one.scss'
import { mountForShopify } from './mount'
import ProductLayout from '../layouts/ProductLayout'
import ScreenmateOneBanner from '../components/ScreenmateOne/ScreenmateOneBanner'
import ScreenmateOneOrder from '../components/ScreenmateOne/ScreenmateOneOrder'

const slugs: string[] = ['Features', 'Setup', 'Convenience', 'Integration', 'Dash', 'Specifications', 'Complectation']
const sections: Record<string, React.ComponentType<any>> = slugs.reduce((acc, slug) => ({
    ...acc,
    [slug]: lazy(() => import(`../components/ScreenmateOne/ScreenmateOne${slug}.tsx`))
}), {})

const ScreenmateOne: React.FC = () => {
    const sectionRefs = useRef<Record <string, HTMLDivElement | null>>({})

    const scrollTo = (slug: string) => {
        sectionRefs.current[slug]?.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        })
    }

    return (
        <ProductLayout className="screenmate-one" onOrder={() => scrollTo('Order')}>
            <ScreenmateOneBanner
                onExpand={() => scrollTo('Features')}
                onOrder={() => scrollTo('Order')}
            />
            {Object.entries(sections).map(([slug, Component]) => (
                <Suspense key={slug}>
                    <Component
                        ref={(el: HTMLDivElement) => {
                            if (el) sectionRefs.current[slug] = el
                            else delete sectionRefs.current[slug]
                        }}
                    />
                </Suspense>
            ))}
            <ScreenmateOneOrder
                ref={(el: HTMLDivElement) => {
                    if (el) sectionRefs.current['Order'] = el
                    else delete sectionRefs.current['Order']
                }}
            />
        </ProductLayout>
    )
}

mountForShopify('react-screenmate-one-root', ScreenmateOne)

export default ScreenmateOne
