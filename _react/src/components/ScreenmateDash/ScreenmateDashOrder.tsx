import React, { useEffect, useMemo, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { getRate } from '../../redux/slices/products'
import { useInlineStyles } from '../../hooks/inline-styles'
import ProductOrder from '../Product/ProductOrder'
import type { Model } from '../../types/product'

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

    const [selectedModel, setSelectedModel] = useState<Model | null>(null)
    
    const currency: string = useMemo(() => country?.currency_code || 'USD', [country])
    // const currency: string = 'USD'

    const coef: number = useMemo(() => currency === 'EUR' ? (rate || 1) : 1, [currency, rate])

    const prices: { current?: number | null; old?: number | null } = useMemo(() => {
        let current = null, old = null
        if (product) {
            current = product.maxPrice
            old = product.oldPrice
            if (selectedModel) {
                current = selectedModel.price
                old = selectedModel.oldPrice
            }
        }
        return { current: (current || 0) * coef, old: (old || 0) * coef }
    }, [product, selectedModel, coef])
    

    return <ProductOrder {...{product, images, thumbs, prices, currency}} />
}

export default ScreenmateDashOrder
