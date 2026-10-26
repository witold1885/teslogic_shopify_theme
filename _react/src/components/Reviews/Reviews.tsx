import { useMemo, type FC } from 'react'
import './reviews.scss'
import { useAppSelector } from '../../redux/hooks'
import { fetchProducts } from '../../redux/selectors/products'
import { selectReviews } from '../../redux/selectors/reviews'
import { useDynamicSlice } from '../../hooks/dynamic-slice'
import { useLazyData } from '../../hooks/lazy-data'
import ReviewsTop from './ReviewsTop'
import ReviewsGrid from './ReviewsGrid'
import ReviewsForm from './ReviewsForm'
import reviewsBackground from '../../assets/images/reviews-background.png'

const Reviews: FC<{ allSources?: boolean }> = ({ allSources = false }) => {
    const { fetchReviews, isLoaded: sliceLoaded } = useDynamicSlice('reviews', () => import('../../redux/slices/reviews'))

    const { product, products } = useAppSelector(fetchProducts)
    const { reviews, totalCount, avgRating } = useAppSelector(selectReviews)

    const source: string = useMemo(() => {
        if (typeof window !== 'undefined' && !allSources) {
            return window.location.host
        }
        return ''
    }, [allSources])

    const fetchAction: () => any = useMemo(() => {
        if (sliceLoaded) {
            const product_id = product?.id || products?.[0]?.id || null
            if (product_id) {
                return () => fetchReviews({ product_id, source })
            }
        }
        return () => {}
    }, [sliceLoaded, product, products, source, fetchReviews])
    
    const lazyParams = useMemo(() => ({
        condition: (!!product || products?.length !== 0) && sliceLoaded,
        action: fetchAction,
        selector: '.reviews'
    }), [sliceLoaded, product, products, fetchAction])
    
    useLazyData(lazyParams)

    return (
        <div className="reviews" style={{ backgroundImage: `url(${reviewsBackground})`, backgroundSize: 'cover' }}>
            <div className="container">
                <div>
                    <ReviewsTop {...{product, totalCount, avgRating}} />
                    <ReviewsGrid {...{reviews, totalCount}} />
                </div>
                <ReviewsForm {...{product}} />
            </div>
        </div>
    )
}

export default Reviews
