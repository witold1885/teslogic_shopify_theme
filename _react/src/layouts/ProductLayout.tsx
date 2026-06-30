import React, { lazy, Suspense, useEffect, type ReactNode } from 'react'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { fetchProduct } from '../redux/slices/products'
import { fetchReviews } from '../redux/slices/reviews'

const Reviews = lazy(() => import('../components/Reviews/Reviews'))

interface ProductLayoutProps {
    className?: string
    children?: ReactNode
}

const ProductLayout: React.FC<ProductLayoutProps> = ({ className, children }) => {
    const dispatch = useAppDispatch()
    const path = window.location.pathname
    const slug = path.replace(/^\/+/, '')

    useEffect(() => {
        if (slug) dispatch(fetchProduct(slug))
    }, [dispatch, slug])
    
    const { product } = useAppSelector(state => state.products)
    
    useEffect(() => {
        if (product) {
            dispatch(fetchReviews(product.productId))
        }
    }, [product])

    return (
        <div {...{className}}>
            {children}
            <Suspense>
                <Reviews />
            </Suspense>
        </div>
    )
}

export default ProductLayout
