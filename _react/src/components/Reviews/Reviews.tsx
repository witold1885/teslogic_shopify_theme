import React, { useMemo } from 'react'
import './reviews.scss'
import { useAppSelector } from '../../redux/hooks'
import { fetchReviews } from '../../redux/slices/reviews'
import { useLazyData } from '../../hooks/lazy-data'
import ReviewsTop from './ReviewsTop'
import ReviewsGrid from './ReviewsGrid'
import ReviewsForm from './ReviewsForm'
import reviewsBackground from '../../assets/images/reviews-background.png'

const Reviews: React.FC<{ allSources?: boolean }> = ({ allSources = false }) => {
    const { product } = useAppSelector(state => state.products)

    const source: string = useMemo(() => {
        if (typeof window !== 'undefined' && !allSources) {
            return window.location.host
        }
        return ''
    }, [allSources])
    
    useLazyData({
        condition: !!product,
        action: product 
              ? () => fetchReviews({ product_id: product.id, source }) 
              : () => {},
        selector: '.reviews',
        rootMargin: '810px'
    })

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
