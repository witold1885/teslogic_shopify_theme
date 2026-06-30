import React from 'react'
import './reviews.scss'
import ReviewsTop from './ReviewsTop'
import ReviewsGrid from './ReviewsGrid'
import ReviewsForm from './ReviewsForm'

const Reviews: React.FC = () => (
    <div className="reviews">
        <div className="container flex-column gap-50 mob:gap-48">
            <div className="flex-column gap-60 mob:gap-40">
                <ReviewsTop />
                <ReviewsGrid />
            </div>
            <ReviewsForm />
        </div>
    </div>
)

export default Reviews
