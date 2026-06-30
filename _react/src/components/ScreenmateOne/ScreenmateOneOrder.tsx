import React, { useState, useMemo } from 'react'
import { useAppSelector } from '../../redux/hooks'
import { Button, Dropdown, Icon, Image } from '../Common'

import chevronLeft from '@/assets/icons/chevron-white-left.svg'
import chevronRight from '@/assets/icons/chevron-white-right.svg'
import shipping from '@/assets/icons/shipping.svg'
import warranty from '@/assets/icons/warranty.svg'

import { mapSimpleConfigs, useAnime, type AnimatedObjectOptions } from '../../hooks/anime'
import { useInlineStyles } from '../../hooks/inline-styles'

const animatedObjects: Record<string, AnimatedObjectOptions> = {
    slider: { yFrom: '20px', duration: 333 },
    name: { yFrom: '40px', duration: 666 },
    prices: { yFrom: '20px', duration: 333 },
    models: { yFrom: '20px', duration: 333 },
    additionals: { yFrom: '20px', duration: 333 },
    button: { yFrom: '40px', duration: 666 },
    details: { yFrom: '20px', duration: 333 },
}

const imageModules: Record<string, any> = import.meta.glob('@/assets/images/screenmate-one/gallery/*.{png,jpg,jpeg,svg}', { eager: true })
const galleryImages: string[] = Object.values(imageModules).map(mod => mod.default)

interface Product {
    name: string,
    price?: number
}

const ScreenmateOneOrder: React.FC = () => {
    const { isMobile } = useInlineStyles()

    const { product } = useAppSelector(state => state.products)

    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0)

    const slidePrev = () => {
        if (currentImageIndex > 0) setCurrentImageIndex(currentImageIndex - 1)
    }

    const slideNext = () => {
        if (currentImageIndex < galleryImages.length - 1) setCurrentImageIndex(currentImageIndex + 1)
    }

    const options = (product?.models || []).map(({ name }) => ({ label: name, value: name }))

    const additionalProducts: Product[] = [
        { name: 'Wireless Phone Charger', price: 40 },
        { name: 'Screenmate Splitter', price: 40 },
    ]

    const details = useMemo(() => [
        { icon: shipping, main: 'Free shipping', add: !isMobile ? 'within the United States & Europe' : 'for the U.S. & Europe' },
        { icon: warranty, main: '3-year full warranty', add: 'for Screenmate ONE' },
    ], [isMobile])

    const animationConfigs = useMemo(() => mapSimpleConfigs(animatedObjects), [])
        
    const { anime } = useAnime(animationConfigs)

    return (
        <div className="screenmate-one__order">
            <div className="screenmate-one__order-gallery">
                <img
                    className="object-cover"
                    src={galleryImages[currentImageIndex]}
                    alt=""
                />
                <div {...anime('slider')} className="screenmate-one__order-gallery-slider">
                    <Icon className="screenmate-one__order-gallery-slider-nav" icon={chevronLeft} onClick={slidePrev} />
                    {galleryImages.map((image, index) => (
                        <Image
                            key={index}
                            className={`screenmate-one__order-gallery-slider-item ${
                                currentImageIndex === index ? 'active' : ''
                            } overflow-hidden`}
                            src={image}
                            onClick={() => setCurrentImageIndex(index)}
                        />
                    ))}
                    <Icon className="screenmate-one__order-gallery-slider-nav" icon={chevronRight} onClick={slideNext} />
                </div>
            </div>
            <div className="screenmate-one__order-form">
                <div className="screenmate-one__order-form-wrap">
                    <div className="flex-column gap-12 mob:gap-8">
                        <div {...anime('name')} className="font-manrope-52 mob:font-manrope-32 font-600">Screenmate ONE</div>
                        <div {...anime('prices')} className="flex-start-center gap-12">
                            <span className="font-manrope-36 mob:font-manrope-24 font-600 text-blue">890 USD</span>
                            <span className="font-manrope-32 mob:font-manrope-24 font-600 text-grey line-through">1190 USD</span>
                        </div>
                    </div>
                    <div className="w-full flex-column gap-20 mob:gap-16">
                        <Dropdown {...anime('models')} placeholder="Select your Tesla model and year" options={options} />
                        <div {...anime('additionals')} className="flex-column gap-16">
                            {additionalProducts.map(({ name, price }, index) => (
                                <div className="flex gap-12 cursor-pointer" key={index}>
                                    <input id={`additional-product-${index}`} type="checkbox" />
                                    <label htmlFor={`additional-product-${index}`} className="font-manrope-16 cursor-pointer">
                                        <span className="font-500">Add {name}</span>&nbsp;
                                        <span className="text-blue font-600">{price} USD</span>
                                    </label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex-column gap-32 mob:gap-24">
                        <Button {...anime('button')}>
                            <span>order now</span>
                        </Button>
                        <div {...anime('details')} className="screenmate-one__order-form-details">
                            {details.map(({ icon, main, add }, index) => (
                                <div className="flex gap-8" key={index}>
                                    <Icon className="flex-center" {...{icon}} />
                                    <span className="font-manrope-16">
                                        <span className="text-blue font-600">{main}</span>&nbsp;
                                        <span className="font-500">{add}</span>
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ScreenmateOneOrder
