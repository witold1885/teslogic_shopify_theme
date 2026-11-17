import { useMemo, type FC } from 'react'
import './reviews.scss'
import { useAppSelector } from '../../redux/hooks'
import { fetchProducts } from '../../redux/selectors/products'
import { selectReviews } from '../../redux/selectors/reviews'
import { useDynamicSlice } from '../../hooks/dynamic-slice'
import { useLazyData } from '../../hooks/lazy-data'
import { foundCommon } from '../../utils/helpers'
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

    const productId: number | null = useMemo(() => product?.id || products?.[0]?.id || null, [product, products])
    const productTitle: string | null = useMemo(() => {
        if (product) {
            return product.title.replace('Kit', '').trim()
        } else if (products?.[0] && products?.[1]) {
            return foundCommon(products[0].title, products[1].title)
        }
        return null
    }, [product, products])

    return (
        <div className="reviews" style={{ backgroundImage: `url(${reviewsBackground})`, backgroundSize: 'cover' }}>
            <div className="container">
                <div>
                    <ReviewsTop {...{productTitle, totalCount, avgRating}} />
                    <ReviewsGrid {...{reviews, totalCount}} />
                </div>
                <ReviewsForm {...{productId, productTitle}} />
            </div>
        </div>
    )
}

export default Reviews
