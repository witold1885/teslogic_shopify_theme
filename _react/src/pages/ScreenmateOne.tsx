import React, { lazy, Suspense, useRef } from 'react'
import '../assets/styles/screenmate-one.scss'
import ProductLayout from '../layouts/ProductLayout'
import ScreenmateOneBanner from '../components/ScreenmateOne/ScreenmateOneBanner'
import { mountForShopify } from './mount'

const slugs: string[] = ['Features', 'Setup', 'Convenience', 'Integration', 'Dash', 'Specifications', 'Complectation', 'Order']
const sections: Record<string, React.ComponentType<any>> = slugs.reduce((acc, slug) => ({
    ...acc,
    [slug]: lazy(() => import(`../components/ScreenmateOne/ScreenmateOne${slug}.tsx`))
}), {})

const ScreenmateOne: React.FC = () => {
    const featuresRef = useRef<HTMLDivElement | null>(null)

    const scrollToFeatures = () => {
        featuresRef.current?.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        })
    }

    return (
        <ProductLayout className="screenmate-one">
            <ScreenmateOneBanner onExpand={scrollToFeatures} />
            {Object.entries(sections).map(([slug, Component]) => (
                <Suspense key={slug}>
                    <Component ref={slug === 'Features' ? featuresRef : null} />
                </Suspense>
            ))}
        </ProductLayout>
    )
}

mountForShopify('react-screenmate-one-root', ScreenmateOne)

export default ScreenmateOne
