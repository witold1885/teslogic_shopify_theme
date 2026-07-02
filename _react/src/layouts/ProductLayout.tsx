import React, { lazy, Suspense, useEffect, type ReactNode } from 'react'
import { useAppDispatch, useAppSelector } from '../redux/hooks'
import { fetchProduct } from '../redux/slices/products'
import { fetchReviews } from '../redux/slices/reviews'
import Header from '../components/Header/Header'
import Footer from '../components/Footer/Footer'

const Reviews = lazy(() => import('../components/Reviews/Reviews'))

interface ProductLayoutProps {
    className?: string
    children?: ReactNode
}

const slugMap: Record<string, string> = {
    'screenmate-one-react': 'screenmate'
}

const ProductLayout: React.FC<ProductLayoutProps> = ({ className, children }) => {
    const dispatch = useAppDispatch()
    const path = window.location.pathname
    const tail = path.split('/').filter(Boolean).pop() as string
    const slug = slugMap[tail] || tail || null

    useEffect(() => {
        if (slug) dispatch(fetchProduct(slug))
    }, [dispatch, slug])
    
    const { product } = useAppSelector(state => state.products)
    
    useEffect(() => {
        if (product) {
            dispatch(fetchReviews(product.productId))
        }
    }, [product])

    return (<>
        <Header />
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
