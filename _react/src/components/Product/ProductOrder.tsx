import React, { lazy, forwardRef, useState, useEffect, useMemo, useCallback, Suspense, type ReactNode } from 'react'
import './product-order.scss'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import type { Model } from '../../types/product'

const Slider = lazy(() =>
    import('react-slick').then(module => ({
        default: (module.default as any).default
    }))
)
import { type Settings } from 'react-slick'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

import { Button, Dropdown, Icon, Image } from '../Common'
import type { DropdownOption } from '../Common/Dropdown'
import shippingIcon from '../../assets/icons/feature_free_shipping.svg'
import noImportIcon from '../../assets/icons/feature_no_import.svg'

import { mapSimpleConfigs, useAnime, type AnimatedObjectOptions } from '../../hooks/anime'
import { useInlineStyles } from '../../hooks/inline-styles'
import { useDynamicSlice } from '../../hooks/dynamic-slice'
import { useLazyData } from '../../hooks/lazy-data'

const animatedObjects: Record<string, AnimatedObjectOptions> = {
    gallery: { yFrom: '40px', duration: 666 },
    slider: { yFrom: '40px', duration: 666 },
    title: { yFrom: '40px', duration: 666 },
    prices: { yFrom: '20px', duration: 333 },
    models: { yFrom: '20px', duration: 333 },
    additionals: { yFrom: '20px', duration: 333 },
    button: { yFrom: '20px', duration: 333 },
    details: { yFrom: '20px', duration: 333 },
}

interface ProductOrderProps {
    withDetails?: boolean
}

interface GallerySliderProps {
    sliderSettings: Settings
    images?: string[]
}

const GallerySlider = forwardRef<HTMLDivElement, GallerySliderProps>(({ sliderSettings, images }, ref) => {    
    const SlickSlider = (Slider as any).default || Slider

    const imagesList: ReactNode = useMemo(() => images?.map((image, index) => (
        <Image
            key={`image-${index}`}
            className="store_block-product-gallery-main"
            src={image}
        />
    )) || [], [images])
    
    return (
        <div ref={ref} className="store_block-product-gallery-slider-wrap">
            {import.meta.env.SSR ? (<>
                {imagesList}
            </>) : (
                <Suspense>
                    <SlickSlider className="store_block-product-gallery-slider" {...sliderSettings}>
                        {imagesList}
                    </SlickSlider>
                </Suspense>
            )}
        </div>
    )
})

const shopifyUrl: string = import.meta.env.VITE_SHOPIFY_URL || 'http://localhost:5173'

const ProductOrder: React.FC<ProductOrderProps> = ({ withDetails = false }) => {
    const dispatch = useAppDispatch()
    
    const { isMobile } = useInlineStyles()
    
    const { getRate, addToCart } = useDynamicSlice('products', () => import('../../redux/slices/products'))
    const { rate, product, additionalProducts, addedToCart } = useAppSelector(state => state.products)
    const { country } = useAppSelector(state => state.content)

    const lazyParams = useMemo(() => ({
        action: () => getRate('USD/EUR'),
        selector: '.store_block'
    }), [getRate])
    
    useLazyData(lazyParams)

    const images = useMemo(() => product?.images?.filter(({ main }) => main.includes('full_')).map(({ main }) => main), [product])
    const thumbs = useMemo(() => product?.images?.filter(({ thumb }) => thumb.includes('thumb_')).map(({ thumb }) => thumb), [product])

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

    const [selectedModel, setSelectedModel] = useState<Model | null>(null)
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

    const [selectedAdditionals, setSelectedAdditionals] = useState<number[]>([])

    const handleAdditionalSelect = (e: React.ChangeEvent<HTMLInputElement>, additionalId: number | null) => {
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
    
    const showVAT = useCallback((price?: number | null) => currency === 'EUR' && price && tax ? (
        <>+{((price || 0) * tax / 100).toFixed(0)} EUR (VAT {tax}%)</>
    ) : <></>, [currency, tax])
    
    const details: { icon?: string, main?: string, add?: string }[] = useMemo(() => withDetails ? [
        country?.iso_code === 'US' ? {
            icon: shippingIcon, main: 'Free shipping', add: 'within the US'
        } : {},
        { icon: noImportIcon, main: 'Duties and taxes', add: 'included in most countries*' },
    ].filter(({ icon, main, add }) => !!icon && !!main && !!add) : [], [withDetails, country])
    
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

    const animationConfigs = useMemo(() => mapSimpleConfigs(animatedObjects), [])
        
    const { anime } = useAnime(animationConfigs)

    return product ? (
        <div className="store_block" id="shop-now">
            <div className="store_block-product">
                <div {...anime('gallery')} className="store_block-product-gallery">
                    <div className="store_block-product-gallery-items">
                        {thumbs?.map((thumb, index) => (
                            <Image
                                key={`thumb-${index}`}
                                className={`store_block-product-gallery-item ${
                                    index === currentImageIndex ? 'active' : ''
                                }`}
                                src={thumb}
                                onClick={() => setCurrentImageIndex(index)}
                            />
                        ))}
                    </div>
                    <GallerySlider {...{sliderSettings, images}} />
                </div>
                <div className="store_block-product-info">
                    <div className="store_block-product-info-main">
                        <div {...anime('prices')}>
                            <div className="store_block-product-price">
                                <span className="store_block-product-price-new">{prices?.current?.toFixed(0) || 0} {currency}</span>
                                {(prices?.old || 0) > (prices?.current || 0) && (
                                    <span className="store_block-product-price-old">{prices?.old?.toFixed(0) || 0} {currency}</span>
                                )}
                            </div>
                            <div className="store_block-product-price-vat">{showVAT(prices?.current)}</div>
                        </div>
                        <div {...anime('title')} className="store_block-product-title">{product.title}</div>
                    </div>
                    <div {...anime('slider')} className="store_block-product-slider">
                        <GallerySlider {...{sliderSettings, images}} />
                    </div>
                    <div>
                        {product.description && <div className="store_block-product-description">{product.description}</div>}
                        <Dropdown
                            {...anime('models')}
                            theme="light"
                            placeholder="Select your Tesla model and year"
                            {...{options, error}}
                            onSelect={(modelId) => handleModelSelect(modelId as number)}
                        />
                        {additionals && (
                            <div {...anime('additionals')}>
                                {additionals.map(({ id, title, price, models }) => {
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
                                                    {price?.toFixed(0) || 0} {currency} {showVAT(price)}
                                                </span>
                                            </label>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                        <div className="store_block-product-order">
					        <Button {...anime('button')} className="store_block-product-order-add" onClick={handleSubmit}>
                                <div className="store_block-product-order-add-text">Order now</div>
                                {total && <div className="store_block-product-order-add-total">{total} {currency}</div>}
                            </Button>

                            {details.length !== 0 && (
                                <div {...anime('details')} className="store_block-product-order-details">
                                    {details.map(({ icon, main, add }, index) => (
                                        <div className="store_block-product-order-detail" key={index}>
                                            <Icon {...{icon}} />
                                            <span className="store_block-product-order-detail-text">
                                                <span className="store_block-product-order-detail-text-main">{main}</span>&nbsp;
                                                <span>{add}</span>
                                            </span>
                                        </div>
                                    ))}
                                    <div className="store_block-product-order-details-subtext">
                                        *See <a href="/shipping-delivery" target="_blank">Shipping page</a> for details. 
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
		</div>
    ) : null
}

export default ProductOrder
