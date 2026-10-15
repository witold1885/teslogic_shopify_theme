import React from 'react'
import type { Product } from '../../types/product'
import { Image } from '../Common'

interface ProductOrderProps {
    product?: Product | null
    images?: string[]
    thumbs?: string[]
}

const ProductOrder: React.FC<ProductOrderProps> = ({ product, images, thumbs }) => {
    return product ? (
        <div className="store_block" id="shop-now">
            <div className="store_block-product">
                <div className="store_block-product-gallery">
                    <div className="store_block-product-gallery-items">
                        {thumbs?.map((thumb, index) => (
                            <Image key={index} className="store_block-product-gallery-item" src={thumb} />
                        ))}
                    </div>
                    <div className="store_block-product-gallery-main">
                        
                    </div>
                </div>
            </div>
		</div>
    ) : null
}

export default ProductOrder
