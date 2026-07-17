import React, { lazy, Suspense, type ReactNode } from 'react'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'

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
        <Suspense>
            <Reviews />
        </Suspense>
    </div>
    <Footer />
</>)

export default ProductLayout
