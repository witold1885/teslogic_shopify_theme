import { useRef, type FC } from 'react'
import { preload } from 'react-dom'
import { getComponent } from './components'
import Layout, { type LayoutProps } from './Layout'
import LazySection from './LazySection'
import PromotionBanner from '../components/Promotion/PromotionBanner.tsx'
import reviewsBackground from '../assets/images/reviews-background.png'

const Reviews = getComponent(() => import('../components/Reviews/Reviews.tsx'), true)

const ProductLayout: FC<LayoutProps> = ({ className, onOrder, children }) => {
    if (typeof window !== 'undefined') {
        preload(reviewsBackground, { as: 'image', fetchPriority: 'low' })
    }

    const childrenRef = useRef<HTMLDivElement>(null)

    const onExpand = () => {
        console.log(childrenRef?.current)
        childrenRef?.current?.scrollIntoView({ 
            behavior: 'smooth',
            block: 'start'
        })
    }

    return (
        <Layout theme="dark" orderButton={true} onOrder={onOrder}>
            <PromotionBanner onExpand={onExpand} />
            <div ref={childrenRef} {...{className}}>
                {children}
                {Reviews && (
                    <LazySection>
                        <Reviews allSources={className === 'screenmate-dash' || className === 'powermate'} />
                    </LazySection>
                )}
            </div>
        </Layout>
    )
}

export default ProductLayout
