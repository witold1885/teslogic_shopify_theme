import React, { useState, useCallback } from 'react'
import './product-order.scss'
import type { Product } from '../../types/product'
import { Image } from '../Common'

interface ProductOrderProps {
    product?: Product | null
    images?: string[]
    thumbs?: string[]
    prices?: PricesProps
    currency?: string
    tax?: number
}

interface PricesProps { current?: number | null; old?: number | null }

const ProductOrder: React.FC<ProductOrderProps> = ({ product, images, thumbs, prices, currency, tax }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0)
    
    const showVAT = useCallback((price?: number | null) => currency === 'EUR' && price && tax ? (
        <>
            <br />
            <div className="store_block-product-price-vat">
                +{((price || 0) * tax / 100).toFixed(0)} EUR (VAT {tax}%)
            </div>
        </>
    ) : <></>, [currency, tax])
    
    return product ? (
        <div className="store_block" id="shop-now">
            <div className="store_block-product">
                <div className="store_block-product-gallery">
                    <div className="store_block-product-gallery-items">
                        {thumbs?.map((thumb, index) => (
                            <Image
                                key={index}
                                className={`store_block-product-gallery-item ${
                                    index === currentImageIndex ? 'active' : ''
                                }`}
                                src={thumb}
                                onClick={() => setCurrentImageIndex(index)}
                            />
                        ))}
                    </div>
                    {images?.[currentImageIndex] && (
                        <Image
                            className="store_block-product-gallery-main"
                            src={images[currentImageIndex]}
                        />
                    )}
                </div>
                <div className="store_block-product-info">
                    <div className="store_block-product-info-main">
                        <div className="store_block-product-price">
                            <span className="store_block-product-price-new">
                                {prices?.current?.toFixed(0) || 0} {currency}
                                {showVAT(prices?.current)}
                            </span>
                            {(prices?.old || 0) > (prices?.current || 0) && (
                                <span className="store_block-product-price-old">{prices?.old?.toFixed(0) || 0} {currency}</span>
                            )}
                        </div>
                        <div className="store_block-product-title">{product.title}</div>
                    </div>
                </div>
            </div>
		</div>
    ) : null
}

export default ProductOrder
