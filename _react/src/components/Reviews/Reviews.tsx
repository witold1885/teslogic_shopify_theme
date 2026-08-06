import React, { useEffect } from 'react'
import './reviews.scss'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { fetchReviews } from '../../redux/slices/reviews'
import ReviewsTop from './ReviewsTop'
import ReviewsGrid from './ReviewsGrid'
import ReviewsForm from './ReviewsForm'
import reviewsBackground from '../../assets/images/reviews-background.png'

const Reviews: React.FC = () => {
    const dispatch = useAppDispatch()
    
    const { product } = useAppSelector(state => state.products)

    useEffect(() => {
        if (!product) return

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                dispatch(fetchReviews({ product_id: product.id, source: window.location.host }))
                observer.disconnect()
            }
        }, { rootMargin: '810px' })

        const element = document.querySelector('.reviews')
        if (element) observer.observe(element)

        return () => observer.disconnect()
    }, [product, dispatch])

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
