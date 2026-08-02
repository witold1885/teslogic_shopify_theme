import React, { lazy, Suspense, useEffect, type ReactNode } from 'react'
import '@/assets/styles/common.scss'
import '@/assets/styles/cookies-banner.scss'
import Header from '../components/Header/Header'
import LazySection from './LazySection'

const Reviews = lazy(() => import('../components/Reviews/Reviews'))
const Footer = lazy(() => import('../components/Footer/Footer'))

interface ProductLayoutProps {
    className?: string
    onOrder?: () => void
    children?: ReactNode
}

const ProductLayout: React.FC<ProductLayoutProps> = ({ className, onOrder, children }) => {    
    useEffect(() => {
        if (window.history && 'scrollRestoration' in window.history) {
            window.history.scrollRestoration = 'manual'
        }

        window.scrollTo(0, 0)
    }, [])

    return (<>
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
}

export default ProductLayout
