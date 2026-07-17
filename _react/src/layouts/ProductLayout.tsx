import React, { lazy, Suspense, type ReactNode } from 'react'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'
import LazySection from '../pages/LazySection'

const Reviews = lazy(() => import('../components/Reviews/Reviews'))

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
    <Footer />
</>)

export default ProductLayout
