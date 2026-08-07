import React, { lazy, forwardRef, useState, useMemo, useEffect, Suspense } from 'react'
import './screenmate-one-order.scss'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { addToCart } from '../../redux/slices/products'
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
import chevronLeft from '@/assets/icons/chevron-white-left.svg'
import chevronRight from '@/assets/icons/chevron-white-right.svg'
import shipping from '@/assets/icons/shipping.svg'
import warranty from '@/assets/icons/warranty.svg'

import { mapSimpleConfigs, useAnime, type AnimatedObjectOptions } from '../../hooks/anime'
import { useInlineStyles } from '../../hooks/inline-styles'
import type { DropdownOption } from '../Common/Dropdown'

const animatedObjects: Record<string, AnimatedObjectOptions> = {
    slider: { yFrom: '20px', duration: 333 },
    name: { yFrom: '40px', duration: 666 },
    prices: { yFrom: '20px', duration: 333 },
    models: { yFrom: '20px', duration: 333 },
    additionals: { yFrom: '20px', duration: 333 },
    button: { yFrom: '40px', duration: 666 },
    details: { yFrom: '20px', duration: 333 },
}

const imageModules: Record<string, any> = import.meta.glob('@/assets/images/screenmate-one/gallery/*-original.{png,jpg,jpeg,svg}', { eager: true })
const thumbModules: Record<string, any> = import.meta.glob('@/assets/images/screenmate-one/gallery/*-thumb.{png,jpg,jpeg,svg}', { eager: true })
const galleryImages: string[] = Object.values(imageModules).map(mod => mod.default)
const galleryThumbs: string[] = Object.values(thumbModules).map(mod => mod.default)

const shopifyUrl: string = import.meta.env.VITE_SHOPIFY_URL || 'http://localhost:5173'

const ScreenmateOneOrder = forwardRef<HTMLDivElement, {}>(({}, ref) => {
    const dispatch = useAppDispatch()

    const { isMobile } = useInlineStyles()

    const { product, additionalProducts, addedToCart } = useAppSelector(state => state.products)

    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0)
    
    const SlickSlider = (Slider as any).default || Slider
    
    const sliderSettings: Settings = useMemo(() => ({
        dots: false,
        infinite: true,
        arrows: true,
        speed: 500,
        slidesToShow: !isMobile ? 6 : 4,
        slidesToScroll: 1,
        swipeToSlide: true,
        prevArrow: <div><Icon icon={chevronLeft} /></div>,
        nextArrow: <div><Icon icon={chevronRight} /></div>,
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

    const prices: { current?: number | null; old?: number | null } = useMemo(() => {
        let current = null, old = null
        console.log({ product })
        if (product) {
            current = product.maxPrice, old = product.oldPrice
            if (selectedModel) {
                current = selectedModel.price, old = selectedModel.oldPrice
            }
        }
        return { current, old }
    }, [product, selectedModel])

    const [selectedAdditionals, setSelectedAdditionals] = useState<number[]>([])

    const handleAdditionalSelect = (e: React.ChangeEvent<HTMLInputElement>, additionalId: number | null) => {
        if (additionalId) {
            const { checked } = e.target
            setSelectedAdditionals(prev => checked ? [ ...prev, additionalId ] : prev.filter(id => id !== additionalId))
        }
    }

    const details = useMemo(() => [
        { icon: shipping, main: 'Free shipping', add: !isMobile ? 'within the United States' : 'for the U.S.' },
        { icon: warranty, main: '3-year full warranty', add: 'for Screenmate ONE' },
    ], [isMobile])

    const handleSubmit = () => {
        if (selectedModel) {
            const items = [
                { id: selectedModel.id, quantity: 1 },
                ...selectedAdditionals.filter(Boolean).map(id => ({ id, quantity: 1 }))
            ]
            dispatch(addToCart({ items }))
        } else {
            setError(true)
        }
    }

    useEffect(() => {
        if (addedToCart) {
            window.open(`${shopifyUrl}/cart`, '_blank')
        }
    }, [addedToCart])

    const animationConfigs = useMemo(() => mapSimpleConfigs(animatedObjects), [])
        
    const { anime } = useAnime(animationConfigs)

    return (
        <div className="screenmate-one__order" ref={ref}>
            <div className="screenmate-one__order-gallery">
                {galleryImages.map((image, index) => (
                    <img
                        key={index}
                        className={`object-cover ${index === currentImageIndex ? '' : 'hidden'}`}
                        src={image}
                        alt=""
                    />
                ))}
                <div {...anime('slider')} className="screenmate-one__order-gallery-slider-wrap">
                    <Suspense>
                        <SlickSlider className="screenmate-one__order-gallery-slider" {...sliderSettings}>
                            {galleryThumbs.map((image, index) => (
                                <div className="screenmate-one__order-gallery-slider-item-wrap" key={index}>
                                    <Image                                    
                                        className={`screenmate-one__order-gallery-slider-item ${
                                            currentImageIndex === index ? 'active' : ''
                                        }`}
                                        src={image}
                                        onClick={() => setCurrentImageIndex(index)}
                                    />
                                </div>
                            ))}
                        </SlickSlider>
                    </Suspense>
                </div>
            </div>
            {product && (
                <div className="screenmate-one__order-form">
                    <div className="screenmate-one__order-form-wrap">
                        <div>
                            <div {...anime('name')} className="screenmate-one__order-form-name">{product.title}</div>
                            <div {...anime('prices')} className="screenmate-one__order-form-prices">
                                <span>{prices.current} USD</span>
                                {(prices.old || 0) > (prices.current || 0) && (
                                    <span>{prices.old} USD</span>
                                )}
                            </div>
                        </div>
                        <div>
                            <Dropdown
                                {...anime('models')}
                                placeholder="Select your Tesla model and year"
                                {...{options, error}}
                                onSelect={(modelId) => handleModelSelect(modelId as number)}
                            />
                            {additionalProducts && (
                                <div {...anime('additionals')} className="screenmate-one__order-form-additionals">
                                    {additionalProducts.map(({ id, title, price, models }) => {
                                        const modelId = models ? models[0].id : null
                                        return (
                                            <div key={id}>
                                                <input
                                                    type="checkbox"
                                                    id={`additional-product-${id}`}
                                                    checked={modelId !== null && selectedAdditionals.includes(modelId)}
                                                    onChange={(e) => handleAdditionalSelect(e, modelId)}
                                                />
                                                <label htmlFor={`additional-product-${id}`}>
                                                    <span>Add {title}</span>&nbsp;
                                                    <span>{price} USD</span>
                                                </label>
                                            </div>
                                        )
                                    })}
                                </div>
                            )}
                        </div>
                        <div>
                            <Button {...anime('button')} onClick={handleSubmit}>
                                <span>order now</span>
                            </Button>
                            <div {...anime('details')} className="screenmate-one__order-form-details">
                                {details.map(({ icon, main, add }, index) => (
                                    <div className="screenmate-one__order-form-details-item" key={index}>
                                        <Icon {...{icon}} />
                                        <span>
                                            <span>{main}</span>&nbsp;
                                            <span>{add}</span>
                                        </span>
                                    </div>
                                ))}
                                {selectedModel?.sku === 'TS12' && (
                                    <div className="screenmate-one__order-form-details-delivery">
                                        Delivery timeline: <span>September</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
})

export default ScreenmateOneOrder
