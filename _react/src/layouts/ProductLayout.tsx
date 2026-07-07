import React, { lazy, Suspense, useEffect, type ReactNode } from 'react'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { fetchReviews } from '../redux/slices/reviews'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'

const Reviews = lazy(() => import('../components/Reviews/Reviews'))

interface ProductLayoutProps {
    className?: string
    onOrder?: () => void
    children?: ReactNode
}

const ProductLayout: React.FC<ProductLayoutProps> = ({ className, onOrder, children }) => {
    const dispatch = useAppDispatch()
    
    const { product } = useAppSelector(state => state.products)
    
    useEffect(() => {
        if (product) {
            dispatch(fetchReviews(product.id))
        }
    }, [product])

    return (<>
        <Header onOrder={onOrder} />
        <div {...{className}}>
            {children}
            <Suspense>
                <Reviews />
            </Suspense>
        </div>
        <Footer />
    </>)
}

export default ProductLayout
