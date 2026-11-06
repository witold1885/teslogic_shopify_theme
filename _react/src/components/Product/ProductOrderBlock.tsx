import { useMemo, type FC, type ReactNode } from 'react'
import Button from '../Common/Button'
import { mapSimpleConfigs, useAnime, type AnimatedObjectOptions } from '../../hooks/anime'

const animatedObjects: Record<string, AnimatedObjectOptions> = {
    gallery: { yFrom: '40px', duration: 666 },
    slider: { yFrom: '40px', duration: 666 },
    title: { yFrom: '40px', duration: 666 },
    prices: { yFrom: '20px', duration: 333 },
    description: { yFrom: '20px', duration: 333 },
    models: { yFrom: '20px', duration: 333 },
    additionals: { yFrom: '20px', duration: 333 },
    button: { yFrom: '20px', duration: 333 },
    details: { yFrom: '20px', duration: 333 },
}

export interface ProductOrderProps {
    productType: 'main' | 'other'
}

interface ProductOrderBlockProps extends ProductOrderProps {
    thumbs?: ReactNode
    gallery?: ReactNode
    slider?: ReactNode
    price: number | string
    oldPrice: number | string | null
    currency: string
    vat?: ReactNode
    title?: string
    description?: ReactNode
    models?: ReactNode
    additionals?: ReactNode
    details?: ReactNode
    total: number | string | null
    onSubmit: () => void
}

const ProductOrderBlock: FC<ProductOrderBlockProps> = ({ productType, thumbs, gallery, slider, price, oldPrice, currency, vat, title, description, models, additionals, details, total, onSubmit }) => {
    const animationConfigs = useMemo(() => mapSimpleConfigs(animatedObjects), [])
        
    const { anime } = useAnime(animationConfigs)

    return (
        <div className="store_block">
            <div className="store_block-product">
                <div {...(productType === 'main' ? anime('gallery') : {})} className="store_block-product-gallery">
                    {thumbs && <div className="store_block-product-gallery-items" dangerouslySetInnerHTML={{ __html: thumbs }} />}
                    {gallery && <div className="store_block-product-gallery-slider-wrap" dangerouslySetInnerHTML={{ __html: gallery }} />}
                </div>
                <div className="store_block-product-info">
                    <div className="store_block-product-info-main">
                        <div {...anime('prices')}>
                            <div className="store_block-product-price">
                                <span className="store_block-product-price-new">{price} {currency}</span>
                                {oldPrice !== null && <span className="store_block-product-price-old">{oldPrice} {currency}</span>}
                            </div>
                            {vat && <div className="store_block-product-price-vat">{vat}</div>}
                        </div>
                        <h2 {...(productType === 'main' ? anime('title') : {})} className="store_block-product-title">{title}</h2>
                    </div>
                    <div {...(productType === 'main' ? anime('slider') : {})} className="store_block-product-slider">
                        {slider && <div className="store_block-product-gallery-slider-wrap" dangerouslySetInnerHTML={{ __html: slider }} />}
                    </div>
                    <div>
                        {description && (
                            <div
                                {...anime('description')}
                                className="store_block-product-description"
                                dangerouslySetInnerHTML={{ __html: description }}
                            />
                        )}
                        {models && <div {...anime('models')} dangerouslySetInnerHTML={{ __html: models }} />}
                        {additionals && <div {...anime('additionals')} dangerouslySetInnerHTML={{ __html: additionals }} />}
                        <div className="store_block-product-order">
					        <Button {...anime('button')} className="store_block-product-order-add" onClick={onSubmit}>
                                <div className="store_block-product-order-add-text">Order now</div>
                                {total && <div className="store_block-product-order-add-total">{total} {currency}</div>}
                            </Button>

                            {details && (
                                <div {...anime('details')} className="store_block-product-order-details">
                                    <div style={{ display: 'contents' }} dangerouslySetInnerHTML={{ __html: details }} />
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
    )
}

export default ProductOrderBlock
