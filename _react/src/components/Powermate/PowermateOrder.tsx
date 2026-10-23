import { useState, useEffect, useMemo, useCallback, type FC, type ChangeEvent, type ReactNode } from 'react'
import './powermate-order.scss'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { fetchProducts } from '../../redux/selectors/products'
import { fetchOrder } from '../../redux/selectors/order'
import { fetchContent } from '../../redux/selectors/content'
import Icon from '../Common/Icon'
import shipping from '../../assets/icons/powermate/order/pro_order_free_shipping.svg'
import noTax from '../../assets/icons/powermate/order/pro_order_no_tax.svg'

import { useDynamicSlice } from '../../hooks/dynamic-slice'
import { useLazyData } from '../../hooks/lazy-data'

const shopifyUrl: string = import.meta.env.VITE_SHOPIFY_URL || 'http://localhost:5173'

interface OrderDetail {
    icon?: string
    text?: ReactNode
}

const PowermateOrderDetails: FC<{ mode: 'desktop' | 'mobile'; details: OrderDetail[] }> = ({ mode, details }) => (
    <div className={`order-product-data-preorder-details order-product-data-preorder-details-${mode}`}>
        {details.map(({ icon, text }, index) => (
            <div className="order-product-data-preorder-details-item" key={index}>
                <Icon className="order-product-data-preorder-details-item-icon" icon={icon} />
                <div className="order-product-data-preorder-details-item-text">{text}</div>
            </div>
        ))}
        <div className="order-product-data-preorder-details-item-subtext">
            *See <a href="/shipping-delivery" target="_blank">Shipping page</a> for details. 
        </div>
    </div>
)

const PowermateOrder: FC = () => {
    const dispatch = useAppDispatch()

    const { getRate, addToCart } = useDynamicSlice('order', () => import('../../redux/slices/order'))
    const { products, additionalProducts } = useAppSelector(fetchProducts)
    const { rate, addedToCart } = useAppSelector(fetchOrder)
    const { country } = useAppSelector(fetchContent)

    const lazyParams = useMemo(() => ({
        action: getRate ? () => getRate('USD/EUR') : () => {},
        selector: '#pro-order'
    }), [getRate])
    
    useLazyData(lazyParams)

    console.log({ products })

    const currency: string = useMemo(() => country?.currency_code || 'USD', [country])
    // const currency: string = 'USD'

    const coef: number = useMemo(() => currency === 'EUR' ? (rate || 1) : 1, [currency, rate])

    const items = useMemo(() => products?.map(({ id, images, title, price, oldPrice }) => ({
        id,
        image: images?.[0].main,
        title,
        price: (price || 0) * coef,
        oldPrice: (oldPrice || 0) * coef

    })) || [], [products, coef])
    
    const tax: number = useMemo(() => country?.vat_percent || 20, [country])

    const additionals = useMemo(() => additionalProducts?.map(({ price, ...item }) => ({
        ...item,
        price: (price || 0) * coef
    })), [additionalProducts, coef])

    const showCurrency: string = useMemo(() => coef === 1 ? 'USD' : currency, [coef, currency])

    const [selectedAdditionals, setSelectedAdditionals] = useState<number[]>([])

    const handleAdditionalSelect = (e: ChangeEvent<HTMLInputElement>, additionalId: number | null) => {
        if (additionalId) {
            const { checked } = e.target
            setSelectedAdditionals(prev => checked ? [ ...prev, additionalId ] : prev.filter(id => id !== additionalId))
        }
    }

    const showVAT = useCallback((price?: number | null) => showCurrency === 'EUR' ? (
        <>+{((price || 0) * tax / 100).toFixed(0)} EUR (VAT {tax}%)</>
    ) : <></>, [showCurrency, tax])

    const details: OrderDetail[] = useMemo(() => [
        country?.iso_code === 'US' ? {
            icon: shipping, text: <><span>Free shipping</span> within the US</>
        } : {},
        { icon: noTax, text: <><span>Duties & taxes</span> included in most countries*</> },
    ].filter(({ icon, text }) => !!icon && !!text), [country])

    const handleSubmit = useCallback((productId: number) => {
        const items = [
            { id: productId, quantity: 1 },
            ...selectedAdditionals.filter(Boolean).map(id => ({ id, quantity: 1 }))
        ]
        dispatch(addToCart({ items }))
    }, [selectedAdditionals, dispatch, addToCart])

    useEffect(() => {
        if (addedToCart && typeof window !== 'undefined') {
            window.open(`${shopifyUrl}/cart`, '_blank')
        }
    }, [addedToCart])

    return (
        <div className="order-container">
            <div className="order-wrap">
                <div id="pro-order" className="order">
                    <div className="order-top">
                        <div className="order-title">Ready to take your Model 3/Y <br />to the next level?</div>
                        <div className="order-subtitle">Order Powermate and start your journey towards<br />unmatched driving performance and satisfaction</div>
                    </div>
                    <div className="order-body">
                        <div className="order-products">
                            {items.map(({ id, image, title, price, oldPrice }) => (
                                <div className="order-product" key={id}>
                                    <div className="order-product-image">
                                        <img src={image} />
                                    </div>
                                    <div className="order-product-data">
                                        <div className="order-product-data-info">
                                            <div className="order-product-data-info-price">
                                                <div className="order-product-data-info-price-main">{price}</div>
                                                <div className="order-product-data-info-price-old">{oldPrice}</div>
                                            </div>
                                            <div className="order-product-data-info-title">{title}</div>								
                                        </div>
                                        <div className="order-product-data-preorder">
                                            <button
                                                type="button"
                                                className="order-product-data-preorder-button preorder-boost"
                                                onClick={() => handleSubmit(id)}
                                            >
                                                Order Now
                                            </button>
                                            <PowermateOrderDetails mode="desktop" {...{details}} />
                                        </div>
                                        {additionals && (<>                                            
                                            {additionals.map(({ id, title, price, models }) => {
                                                const modelId = models ? models[0].id : null
                                                return (
                                                    <div className="order-product-data-add" key={id}>
                                                        <input
                                                            className="order-product-data-add-checkbox"
                                                            type="checkbox"
                                                            id={`additional-product-${id}`}
                                                            checked={modelId !== null && selectedAdditionals.includes(modelId)}
                                                            onChange={(e) => handleAdditionalSelect(e, modelId)}
                                                        />
                                                        <label className="order-product-data-add-title" htmlFor={`additional-product-${id}`}>
                                                            Add Additional {title}&nbsp;
                                                            <span className="order-product-data-add-price">
                                                                {price?.toFixed(0) || 0} {showCurrency} {showVAT(price)}
                                                            </span>
                                                        </label>
                                                    </div>
                                                )
                                            })}
                                        </>)}
                                        <PowermateOrderDetails mode="mobile" {...{details}} />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>		
                </div>
            </div>
        </div>
    )
}

export default PowermateOrder
