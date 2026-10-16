import React, { useEffect, useMemo } from 'react'
import './reviews.scss'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { fetchReviews } from '../../redux/slices/reviews'
import ReviewsTop from './ReviewsTop'
import ReviewsGrid from './ReviewsGrid'
import ReviewsForm from './ReviewsForm'
import reviewsBackground from '../../assets/images/reviews-background.png'

const Reviews: React.FC<{ allSources?: boolean }> = ({ allSources = false }) => {
    const dispatch = useAppDispatch()
    
    const { product } = useAppSelector(state => state.products)

    const source: string = useMemo(() => {
        if (typeof window !== 'undefined' && !allSources) {
            return window.location.host
        }
        return ''
    }, [allSources])

    useEffect(() => {
        if (!product) return

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                dispatch(fetchReviews({ product_id: product.id, source }))
                observer.disconnect()
            }
        }, { rootMargin: '810px' })

        const element = document.querySelector('.reviews')
        if (element) observer.observe(element)

        return () => observer.disconnect()
    }, [product, source, dispatch])

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
