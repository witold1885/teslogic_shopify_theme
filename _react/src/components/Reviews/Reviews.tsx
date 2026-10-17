import React, { useMemo } from 'react'
import './reviews.scss'
import { useAppSelector } from '../../redux/hooks'
import { useDynamicSlice } from '../../hooks/dynamic-slice'
import { useLazyData } from '../../hooks/lazy-data'
import ReviewsTop from './ReviewsTop'
import ReviewsGrid from './ReviewsGrid'
import ReviewsForm from './ReviewsForm'
import reviewsBackground from '../../assets/images/reviews-background.png'
import { fetchProducts } from '../../redux/selectors/products'

const Reviews: React.FC<{ allSources?: boolean }> = ({ allSources = false }) => {
    const { fetchReviews } = useDynamicSlice('reviews', () => import('../../redux/slices/reviews'))

    const { product } = useAppSelector(fetchProducts)

    const source: string = useMemo(() => {
        if (typeof window !== 'undefined' && !allSources) {
            return window.location.host
        }
        return ''
    }, [allSources])
    
    const lazyParams = useMemo(() => ({
        condition: !!product,
        action: product 
              ? () => fetchReviews({ product_id: product.id, source }) 
              : () => {},
        selector: '.reviews'
    }), [product, fetchReviews])
    
    useLazyData(lazyParams)

    return (
        <div className="reviews" style={{ backgroundImage: `url(${reviewsBackground})`, backgroundSize: 'cover' }}>
            <div className="container">
                <div>
                    <ReviewsTop />
                    <ReviewsGrid />
                </div>
                <ReviewsForm />
            </div>
        </div>
    )
}

export default Reviews
