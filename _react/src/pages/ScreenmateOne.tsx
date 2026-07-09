import React, { lazy, Suspense, useRef } from 'react'
import '../assets/styles/screenmate-one.scss'
import { mountForShopify } from './mount'
import ProductLayout from '../layouts/ProductLayout'
import ScreenmateOneBanner from '../components/ScreenmateOne/ScreenmateOneBanner'
import ScreenmateOneFeatures from '../components/ScreenmateOne/ScreenmateOneFeatures'
import ScreenmateOneOrder from '../components/ScreenmateOne/ScreenmateOneOrder'

const slugs: string[] = ['Setup', 'Convenience', 'Integration', 'Dash', 'Specifications', 'Complectation']
const blocks: Record<string, string[]> = {
    Convenience: ['dual-view-mode', 'beyond-basic-control'],
    Integration: ['familiar-interfaces', 'bigger-entertainment']
}
const sections: Record<string, React.ComponentType<any>> = slugs.reduce((acc, slug) => ({
    ...acc,
    [slug]: lazy(() => import(`../components/ScreenmateOne/ScreenmateOne${slug}.tsx`))
}), {})

const ScreenmateOne: React.FC = () => {
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

    return (
        <ProductLayout className="screenmate-one" onOrder={() => scrollTo('Order')}>
            <ScreenmateOneBanner
                onExpand={() => scrollTo('Features')}
                onOrder={() => scrollTo('Order')}
            />
            <Suspense>
                <ScreenmateOneFeatures
                    ref={(el: HTMLDivElement) => setRef(el, 'Features')}
                    scrollTo={(anchor) => scrollTo(...(anchor?.split('.') as [slug: string | null, block?: string] || [null]))}
                />
            </Suspense>
            {Object.entries(sections).map(([slug, Component]) => (
                <Suspense key={slug}>
                    <Component ref={(el: HTMLDivElement) => setRef(el, slug)} />
                </Suspense>
            ))}
            <ScreenmateOneOrder ref={(el: HTMLDivElement) => setRef(el, 'Order')} />
        </ProductLayout>
    )
}

mountForShopify('react-screenmate-one-root', ScreenmateOne)

export default ScreenmateOne
