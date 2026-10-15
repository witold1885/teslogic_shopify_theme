import React, { useEffect, useMemo } from 'react'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { getRate } from '../../redux/slices/products'
import { useInlineStyles } from '../../hooks/inline-styles'
import ProductOrder from '../Product/ProductOrder'

const ScreenmateDashOrder: React.FC = () => {
    const dispatch = useAppDispatch()

    const { isMobile } = useInlineStyles()

    const { rate, product, additionalProducts, addedToCart } = useAppSelector(state => state.products)
    const { country } = useAppSelector(state => state.content)

    useEffect(() => {
        dispatch(getRate('USD/EUR'))
    }, [dispatch])
    console.log({ product })

    const images = useMemo(() => product?.images?.filter(({ main }) => main.includes('full_')).map(({ main }) => main), [product])
    const thumbs = useMemo(() => product?.images?.filter(({ thumb }) => thumb.includes('thumb_')).map(({ thumb }) => thumb), [product])
    console.log({ images, thumbs })

    return <ProductOrder {...{product, images, thumbs}} />
}

export default ScreenmateDashOrder
