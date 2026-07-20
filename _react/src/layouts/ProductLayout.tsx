import React, { lazy, Suspense, type ReactNode } from 'react'
import '@/assets/styles/common.scss'
import Header from '../components/Header/Header'
import LazySection from './LazySection'

const Reviews = lazy(() => import('../components/Reviews/Reviews'))
const Footer = lazy(() => import('../components/Footer/Footer'))

interface ProductLayoutProps {
    className?: string
    onOrder?: () => void
    children?: ReactNode
}

const ProductLayout: React.FC<ProductLayoutProps> = ({ className, onOrder, children }) => (<>
    <Header onOrder={onOrder} />
    <div {...{className}}>
        {children}
        <LazySection>
            <Suspense>
                <Reviews />
            </Suspense>
        </LazySection>
    </div>
    <LazySection>
        <Suspense>
            <Footer />
        </Suspense>
    </LazySection>
</>)

export default ProductLayout
