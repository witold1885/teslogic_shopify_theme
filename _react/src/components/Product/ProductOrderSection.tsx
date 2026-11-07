import { forwardRef, type CSSProperties, type FC, type ReactNode } from 'react'
import Button from '../Common/Button'

export interface ProductOrderProps {
    productType: 'main' | 'other'
}

interface ProductOrderBlockProps {
    style?: CSSProperties
    className?: string
    children: string | ReactNode
}

const ProductOrderBlock = forwardRef<HTMLDivElement, ProductOrderBlockProps>(({ style, className, children }, ref) => {
    const params = { ref, style, className }

    return !import.meta.env.SSR ? (
        <div {...params}>{children}</div>
    ) : (
        <div {...params} dangerouslySetInnerHTML={{ __html: children as TrustedHTML }} />
    )
})

interface ProductOrderSectionProps extends ProductOrderProps {
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

const ProductOrderSection: FC<ProductOrderSectionProps> = ({
    productType,
    thumbs, gallery, slider,
    price, oldPrice, currency, vat,
    title, description,
    models, additionals, details,
    total, onSubmit
}) => {
    return (
        <div className={`store_block store_block-${productType}`}>
            <div className="store_block-product">
                <div className={`store_block-product-gallery ${productType === 'main' ? 'animate animate-big' : ''}`}>
                    {thumbs && <ProductOrderBlock className="store_block-product-gallery-items">{thumbs}</ProductOrderBlock>}
                    {gallery && <ProductOrderBlock className="store_block-product-gallery-slider-wrap">{gallery}</ProductOrderBlock>}
                </div>
                <div className="store_block-product-info">
                    <div className="store_block-product-info-main">
                        <div className="animate animate-small">
                            <div className="store_block-product-price">
                                <span className="store_block-product-price-new">{price} {currency}</span>
                                {oldPrice !== null && <span className="store_block-product-price-old">{oldPrice} {currency}</span>}
                            </div>
                            {vat && <div className="store_block-product-price-vat">{vat}</div>}
                        </div>
                        <h2 className={`store_block-product-title ${productType === 'main' ? 'animate animate-big' : ''}`}>{title}</h2>
                    </div>
                    <div className={`store_block-product-slider ${productType === 'main' ? 'animate animate-big' : ''}`}>
                        {slider && <ProductOrderBlock className="store_block-product-gallery-slider-wrap">{slider}</ProductOrderBlock>}
                    </div>
                    <div>
                        {description && (
                            <div
                                className="store_block-product-description animate animate-small"
                                dangerouslySetInnerHTML={{ __html: description }}
                            />
                        )}
                        {models && <ProductOrderBlock style={{ display: 'contents' }}>{models}</ProductOrderBlock>}
                        {additionals && <ProductOrderBlock className="animate animate-small">{additionals}</ProductOrderBlock>}
                        <div className="store_block-product-order">
                            <Button className="store_block-product-order-add animate animate-small" onClick={onSubmit}>
                                <div className="store_block-product-order-add-text">Order now</div>
                                {total && <div className="store_block-product-order-add-total">{total} {currency}</div>}
                            </Button>

                            {details && (
                                <div className="store_block-product-order-details animate animate-small">
                                    <ProductOrderBlock style={{ display: 'contents' }}>{details}</ProductOrderBlock>
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

export default ProductOrderSection
