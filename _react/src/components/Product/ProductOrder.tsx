import React, { useState, useEffect, useMemo, useCallback } from 'react'
import './product-order.scss'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { getRate } from '../../redux/slices/products'
import type { Model } from '../../types/product'
import { Dropdown, Icon, Image } from '../Common'
import type { DropdownOption } from '../Common/Dropdown'
import shippingIcon from '../../assets/icons/feature_free_shipping.svg'
import noImportIcon from '../../assets/icons/feature_no_import.svg'

interface ProductOrderProps {
    withDetails?: boolean
}

const ProductOrder: React.FC<ProductOrderProps> = ({ withDetails = false }) => {
    const dispatch = useAppDispatch()
    
    const { rate, product, additionalProducts, addedToCart } = useAppSelector(state => state.products)
    const { country } = useAppSelector(state => state.content)

    useEffect(() => {
        dispatch(getRate('USD/EUR'))
    }, [dispatch])

    console.log({ product, additionalProducts })

    const images = useMemo(() => product?.images?.filter(({ main }) => main.includes('full_')).map(({ main }) => main), [product])
    const thumbs = useMemo(() => product?.images?.filter(({ thumb }) => thumb.includes('thumb_')).map(({ thumb }) => thumb), [product])

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
    
    const details: { icon?: string, main?: string, add?: string }[] = useMemo(() => withDetails ? [
        country?.iso_code === 'US' ? {
            icon: shippingIcon, main: 'Free shipping', add: 'within the US'
        } : {},
        { icon: noImportIcon, main: 'Duties and taxes', add: 'included in most countries*' },
    ].filter(({ icon, main, add }) => !!icon && !!main && !!add) : [], [withDetails, country])

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
                            theme="light"
                            placeholder="Select your Tesla model and year"
                            {...{options, error}}
                            onSelect={(modelId) => handleModelSelect(modelId as number)}
                        />
                        <div className="store_block-product-add">
                            <input type="checkbox" id="select-charger" className="store_block-product-add-checkbox" checked />
                            <label htmlFor="select-charger" className="store_block-product-add-title">
                                With Additional Wireless Charger <span className="store_block-product-add-price"></span>
                            </label>
                        </div>
                        <div className="store_block-product-order">
					        <button className="store_block-product-order-add">Order now</button>

                            {details.length !== 0 && (
                                <div className="store_block-product-order-details">
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
