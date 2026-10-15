import React, { useState, useMemo, useCallback } from 'react'
import './product-order.scss'
import { useAppSelector } from '../../redux/hooks'
import type { Model, Product } from '../../types/product'
import { Dropdown, Image } from '../Common'
import type { DropdownOption } from '../Common/Dropdown'

interface ProductOrderProps {
    product?: Product | null
    images?: string[]
    thumbs?: string[]
}

interface PricesProps { current?: number | null; old?: number | null }

const ProductOrder: React.FC<ProductOrderProps> = ({ product, images, thumbs }) => {
    const { country } = useAppSelector(state => state.content)
    const { rate } = useAppSelector(state => state.products)

    const [currentImageIndex, setCurrentImageIndex] = useState<number>(0)
    
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
    
    const showVAT = useCallback((price?: number | null) => currency === 'EUR' && price && tax ? (
        <>
            <br />
            <span className="store_block-product-price-vat">
                +{((price || 0) * tax / 100).toFixed(0)} EUR (VAT {tax}%)
            </span>
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
                    <div>
                        {product.description && <div className="store_block-product-description">{product.description}</div>}
                        <Dropdown
                            placeholder="Select your Tesla model and year"
                            {...{options, error}}
                            onSelect={(modelId) => handleModelSelect(modelId as number)}
                        />
                        <div className="store_block-product-order">
					        <button className="store_block-product-add">Order now</button>
                        </div>
                    </div>
                </div>
            </div>
		</div>
    ) : null
}

export default ProductOrder
