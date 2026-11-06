import { forwardRef, useState, useEffect, useRef, useMemo, useCallback, type ReactNode, type FC, type ChangeEvent } from 'react'
import './product-order.scss'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { fetchProducts } from '../../redux/selectors/products'
import { fetchOrder } from '../../redux/selectors/order'
import { fetchContent } from '../../redux/selectors/content'
import type { Model } from '../../types/product'
import ProductOrderSection, { type ProductOrderProps } from './ProductOrderSection'

import SlickSlider, { type Settings } from '../Common/SlickSlider'
import Icon from '../Common/Icon'
import Image from '../Common/Image'
import Dropdown, { type DropdownOption } from '../Common/Dropdown'
import shippingIcon from '../../assets/icons/feature_free_shipping.svg'
import noImportIcon from '../../assets/icons/feature_no_import.svg'

import { useInlineStyles } from '../../hooks/inline-styles'
import { useDynamicSlice } from '../../hooks/dynamic-slice'
import { useLazyData } from '../../hooks/lazy-data'

interface GallerySliderProps extends ProductOrderProps {
    sliderSettings: Settings
    images?: string[]
}

const GallerySlider = forwardRef<HTMLDivElement, GallerySliderProps>(({ productType, sliderSettings, images }, ref) => {
    const imagesList: ReactNode = useMemo(() => images?.map((image, index) => (
        <Image
            key={`image-${index}`}
            className="store_block-product-gallery-main"
            src={image}
            loading={productType === 'main' ? 'lazy' : 'eager'}
            fetchPriority={productType === 'main' ? 'auto' : 'high'}
        />
    )) || [], [productType, images])
    
    return (
        <div className="store_block-product-gallery-slider-wrap">
            {import.meta.env.SSR ? (<>
                {imagesList}
            </>) : (
                <SlickSlider ref={ref} className="store_block-product-gallery-slider" {...sliderSettings}>
                    {imagesList}
                </SlickSlider>
            )}
        </div>
    )
})

const shopifyUrl: string = import.meta.env.VITE_SHOPIFY_URL || 'http://localhost:5173'

const ProductOrderDynamic: FC<ProductOrderProps> = ({ productType }) => {
    const dispatch = useAppDispatch()
    
    const { isMobile } = useInlineStyles()
    
    const { getRate, addToCart } = useDynamicSlice('order', () => import('../../redux/slices/order'))
    const { product, additionalProducts } = useAppSelector(fetchProducts)
    const { rate, addedToCart } = useAppSelector(fetchOrder)
    const { country } = useAppSelector(fetchContent)

    const lazyParams = useMemo(() => ({
        action: getRate ? () => getRate('USD/EUR') : () => {},
        selector: '.store_block'
    }), [getRate])
    
    useLazyData(lazyParams)

    const sliderRef = useRef<any>(null)

    const images = useMemo(() => product?.images?.map(({ main }) => main).sort(), [product])
    const thumbs = useMemo(() => product?.images?.map(({ thumb }) => thumb).sort(), [product])

    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0)
    
    const sliderSettings: Settings = useMemo(() => ({
        dots: isMobile,
        infinite: true,
        arrows: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        swipeToSlide: true,
        beforeChange: (_, next) => setCurrentImageIndex(next)
    }), [isMobile])

    const options: DropdownOption[] = (product?.models || []).flatMap(({ id, title }) =>
        title.split('|').map((model) => ({ label: model.trim(), value: id }))
    )

    const [selectedModel, setSelectedModel] = useState<Model | null>(options.length === 1 ? (product?.models?.[0] || null) : null)
    const [error, setError] = useState<boolean>(false)

    const handleModelSelect = (modelId: number) => {
        setError(false)
        const model = product?.models?.find(({ id }) => id === modelId) || null
        setSelectedModel(model)
    }
    
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

    const tax: number = useMemo(() => country?.vat_percent || 20, [country])
    
    const additionals = useMemo(() => additionalProducts?.map(({ price, ...item }) => ({
        ...item,
        price: (price || 0) * coef
    })), [additionalProducts, coef])

    const showCurrency: string = useMemo(() => coef === 1 ? 'USD' : currency, [coef, currency])

    const [selectedAdditionals, setSelectedAdditionals] = useState<number[]>([])

    const handleAdditionalSelect = (e: ChangeEvent<HTMLInputElement>, additionalId: number | null) => {
        if (additionalId) {
            const { checked } = e.target
            setSelectedAdditionals(prev => checked ? [ ...prev, additionalId ] : prev.filter(id => id !== additionalId))
        }
    }

    const [total, setTotal] = useState<number | string | null>(null)

    useEffect(() => {
        let total = prices?.current || 0
        if (additionals && selectedAdditionals.length !== 0) {
            for (const { price, models } of additionals) {
                const { id } = models?.[0] || {}
                if (id && selectedAdditionals.includes(id)) total += price || 0
            }
        }
        setTotal(total.toFixed(0))
    }, [prices, additionals, selectedAdditionals])
    
    const showVAT = useCallback((price?: number | null) => showCurrency === 'EUR' && price && tax ? (
        <>+{((price || 0) * tax / 100).toFixed(0)} EUR (VAT {tax}%)</>
    ) : <></>, [showCurrency, tax])

    const details: { icon?: string, main?: string, add?: string }[] = useMemo(() => productType === 'main' ? [
        country?.iso_code === 'US' ? {
            icon: shippingIcon, main: 'Free shipping', add: 'within the US'
        } : {},
        { icon: noImportIcon, main: 'Duties and taxes', add: 'included in most countries*' },
    ].filter(({ icon, main, add }) => !!icon && !!main && !!add) : [], [productType, country])

    const handleSubmit = useCallback(() => {
        if (selectedModel) {
            const items = [
                { id: selectedModel.id, quantity: 1 },
                ...selectedAdditionals.filter(Boolean).map(id => ({ id, quantity: 1 }))
            ]
            dispatch(addToCart({ items }))
        } else {
            setError(true)
        }
    }, [selectedModel, selectedAdditionals, dispatch, addToCart])

    useEffect(() => {
        if (addedToCart && typeof window !== 'undefined') {
            window.open(`${shopifyUrl}/cart`, '_blank')
        }
    }, [addedToCart])

    return <ProductOrderSection
        {...{productType, total}}
        thumbs={<>
            {thumbs?.map((thumb, index) => (
                <Image
                    key={`thumb-${index}`}
                    className={`store_block-product-gallery-item ${
                        index === currentImageIndex ? 'active' : ''
                    }`}
                    src={thumb}
                    onClick={() => {
                        setCurrentImageIndex(index)
                        sliderRef?.current?.slickGoTo(index)
                    }}
                />
            ))}
        </>}
        gallery={<GallerySlider ref={sliderRef} {...{productType, sliderSettings, images}} />}
        slider={<GallerySlider {...{productType, sliderSettings, images}} />}
        price={prices?.current?.toFixed(0) || 0}
        oldPrice={(prices?.old || 0) > (prices?.current || 0) ? prices?.old?.toFixed(0) || 0 : null}
        vat={showVAT(prices?.current)}
        currency={showCurrency}
        title={product?.title}
        description={product?.description}
        models={options.length > 1 ? (
            <Dropdown
                theme="light"
                placeholder="Select your Tesla model and year"
                {...{options, error}}
                onSelect={(modelId) => handleModelSelect(modelId as number)}
            />
        ) : undefined}
        additionals={additionals?.map(({ id, title, price, models }) => {
            const modelId = models ? models[0].id : null
            return (
                <div key={id} className="store_block-product-add">
                    <input
                        type="checkbox"
                        id={`select-${id}`}
                        className="store_block-product-add-checkbox"
                        checked={modelId !== null && selectedAdditionals.includes(modelId)}
                        onChange={(e) => handleAdditionalSelect(e, modelId)}
                    />
                    <label htmlFor={`select-${id}`} className="store_block-product-add-title">
                        With Additional {title}&nbsp;
                        <span className="store_block-product-add-price">
                            {price?.toFixed(0) || 0} {showCurrency} {showVAT(price)}
                        </span>
                    </label>
                </div>
            )
        })}
        details={details.map(({ icon, main, add }, index) => (
            <div className="store_block-product-order-detail" key={index}>
                <Icon {...{icon}} />
                <span className="store_block-product-order-detail-text">
                    <span className="store_block-product-order-detail-text-main">{main}</span>&nbsp;
                    <span>{add}</span>
                </span>
            </div>
        ))}
        onSubmit={handleSubmit}
    />
}

export default ProductOrderDynamic
