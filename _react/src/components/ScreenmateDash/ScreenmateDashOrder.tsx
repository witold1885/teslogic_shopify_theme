import React, { useEffect } from 'react'
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

    return <ProductOrder {...{product}} />
}

export default ScreenmateDashOrder
