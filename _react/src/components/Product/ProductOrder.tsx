import React from 'react'
import type { Product } from '../../types/product'

interface ProductOrderProps {
    product?: Product | null
}

const ProductOrder: React.FC<ProductOrderProps> = ({ product }) => {
    console.log({ product })
    return product ? (
        <div className="store_block" id="shop-now">
            <div className="store_block-product">
                <div className="store_block-product-gallery">
                    <div className="store_block-product-gallery-items">
                        
                    </div>
                    <div className="store_block-product-gallery-main">
                        
                    </div>
                </div>
            </div>
		</div>
    ) : null
}

export default ProductOrder
