import { useState, useEffect, useMemo, useCallback, type FC, type ChangeEvent, type ReactNode } from 'react'
import './powermate-order.scss'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { fetchProducts } from '../../redux/selectors/products'
import { fetchOrder } from '../../redux/selectors/order'
import { fetchContent } from '../../redux/selectors/content'
import PowermateCompatibilityWarningPopup from '../Popup/Powermate/PowermateCompatibilityWarningPopup'
import PowermateCompatibilityCheckPopup from '../Popup/Powermate/PowermateCompatibilityCheckPopup'
import PowermateCompatibilityResultPopup, { type CompatibilityResultPopupData } from '../Popup/Powermate/PowermateCompatibilityResultPopup'
import Icon from '../Common/Icon'
import Image from '../Common/Image'
import shipping from '../../assets/icons/powermate/order/pro_order_free_shipping.svg'
import noTax from '../../assets/icons/powermate/order/pro_order_no_tax.svg'

import { useInlineStyles } from '../../hooks/inline-styles'
import { useDynamicSlice } from '../../hooks/dynamic-slice'
import { useLazyData } from '../../hooks/lazy-data'

interface OrderItem {
    id?: number
    image?: string
    title: string
    price: number
    oldPrice: number
    needCheck: boolean
}

interface OrderDetail {
    icon?: string
    text?: ReactNode
}

const PowermateOrderDetails: FC<{ details: OrderDetail[] }> = ({ details }) => (
    <div className="order-product-data-preorder-details">
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

const defaultResultPopupData: CompatibilityResultPopupData = {
    type: 'default',
    title: '',
    texts: [],
    buttons: []
}

const shopifyUrl: string = import.meta.env.VITE_SHOPIFY_URL || 'http://localhost:5173'

const PowermateOrder: FC = () => {
    const dispatch = useAppDispatch()

    const { isMobile } = useInlineStyles()

    const { getRate, addToCart } = useDynamicSlice('order', () => import('../../redux/slices/order'))
    const { products, additionalProducts } = useAppSelector(fetchProducts)
    const { rate, addedToCart } = useAppSelector(fetchOrder)
    const { country } = useAppSelector(fetchContent)

    const lazyParams = useMemo(() => ({
        action: getRate ? () => getRate('USD/EUR') : () => {},
        selector: '#pro-order'
    }), [getRate])
    
    useLazyData(lazyParams)

    const currency: string = useMemo(() => country?.currency_code || 'USD', [country])
    // const currency: string = 'USD'

    const coef: number = useMemo(() => currency === 'EUR' ? (rate || 1) : 1, [currency, rate])

    const orderItems: OrderItem[] = useMemo(() => (products?.map(({ models, images, title, price, oldPrice }) => ({
        id: models?.[0].id,
        image: images?.[0].main,
        title,
        price: (price || 0) * coef,
        oldPrice: (oldPrice || 0) * coef,
        needCheck: title.includes('Performance')
    })) || []).filter(({ id }) => !!id), [products, coef])
    
    const tax: number = useMemo(() => country?.vat_percent || 20, [country])

    const additionals = useMemo(() => additionalProducts?.map(({ price, ...item }) => ({
        ...item,
        price: (price || 0) * coef
    })), [additionalProducts, coef])

    const showCurrency: string = useMemo(() => coef === 1 ? 'USD' : currency, [coef, currency])

    const [selectedAdditionals, setSelectedAdditionals] = useState<Record<number, number[]>>(
        orderItems.reduce((acc, { id }) => ({ ...acc, [id!]: [] }), {}) || {}
    )

    const handleAdditionalSelect = (e: ChangeEvent<HTMLInputElement>, productId: number | undefined, additionalId: number | null) => {
        if (productId && additionalId) {
            const { checked } = e.target
            setSelectedAdditionals(prev => ({
                ...prev,
                [productId]: checked 
                           ? [ ...selectedAdditionals[productId], additionalId] 
                           : selectedAdditionals[productId].filter(id => id !== additionalId)
            }))
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

    const [warningPopupOpen, setWarningPopupOpen] = useState<boolean>(false)
    const [checkPopupOpen, setCheckPopupOpen] = useState<boolean>(false)
    const [resultPopupOpen, setResultPopupOpen] = useState<boolean>(false)
    const [selectedProductId, setSelectedProductId] = useState<number | undefined>(undefined)

    const handleOrder = useCallback((productId: number) => {
        const items = [
            { id: productId, quantity: 1 },
            ...selectedAdditionals[productId].filter(Boolean).map(id => ({ id, quantity: 1 }))
        ]
        dispatch(addToCart({ items }))
    }, [selectedAdditionals, dispatch, addToCart])

    const handleSubmit = useCallback((productId: number | undefined, needCheck: boolean) => {
        if (productId) {
            if (needCheck) {
                setWarningPopupOpen(true)
                setSelectedProductId(productId)
            } else {
                handleOrder(productId)
            }
        }
    }, [handleOrder])

    const handleCheck = useCallback(() => {
        setWarningPopupOpen(false)
        setCheckPopupOpen(true)
    }, [])

    const handleConfirm = useCallback(() => {
        if (selectedProductId) {
            handleOrder(selectedProductId)
        }
        setSelectedProductId(undefined)
        setWarningPopupOpen(false)
    }, [selectedProductId, handleOrder])

    const [resultPopupData, setResultPopupData] = useState<CompatibilityResultPopupData>(defaultResultPopupData)

    const handleBoostOrder = useCallback(() => {
        const boostProductId = orderItems.find(({ title }) => title.includes('Boost'))?.id || null
        if (boostProductId) {
            handleOrder(boostProductId)
        }
        setSelectedProductId(undefined)
        setResultPopupOpen(false)
        setResultPopupData(defaultResultPopupData)
    }, [orderItems, handleOrder])

    const closeButton = useMemo(() => ({ slug: 'close', text: 'Close', onClick: () => setResultPopupOpen(false) }), [])
    const orderButton = useMemo(() => ({ slug: 'order', text: 'Order Now', onClick: handleBoostOrder }), [handleBoostOrder])

    const compatibilityCheckingResultVariants: Record<
        CompatibilityResultPopupData['type'],
        CompatibilityResultPopupData
    > = useMemo(() => ({
        default: defaultResultPopupData,
        success: {
            type: 'success',
            title: 'Manual check',
            texts: [
                <>
                    Thank you for the information provided, <br />
                    we will check compatibility and send you <br />
                    a response within 2 working days.
                </>
            ],
            buttons: [closeButton]
        },
        warning: {
            type: 'warning',
            title: 'Automatic check',
            texts: [
                <>The Performance version is not compatible with <br />your car, but the Boost is suitable.</>,
                <>You can order it now at the presale price of $790</>
            ],
            buttons: [closeButton, orderButton]
        }
    }), [closeButton, orderButton])

    const onCompleted = (proceed: boolean) => {
        setCheckPopupOpen(false)
        const type: CompatibilityResultPopupData['type'] = proceed ? 'success' : 'warning'
        setResultPopupData(compatibilityCheckingResultVariants[type])
        setResultPopupOpen(true)
    }

    useEffect(() => {
        if (addedToCart && typeof window !== 'undefined') {
            window.open(`${shopifyUrl}/cart`, '_blank')
        }
    }, [addedToCart])

    return (<>
        <div className="order-container">
            <div className="order-wrap">
                <div id="pro-order" className="order">
                    <div className="order-top">
                        <div className="order-title">Ready to take your Model 3/Y <br />to the next level?</div>
                        <div className="order-subtitle">Order Powermate and start your journey towards <br />unmatched driving performance and satisfaction</div>
                    </div>
                    <div className="order-body">
                        <div className="order-products">
                            {orderItems.map(({ id: productId, image, title, price, oldPrice, needCheck }) => (
                                <div className="order-product" key={productId}>
                                    <div className="order-product-image">
                                        <Image src={image as string} alt={title} />
                                    </div>
                                    <div className="order-product-data">
                                        <div className="order-product-data-info">
                                            <div className="order-product-data-info-price">
                                                <div className="order-product-data-info-price-main">{price.toFixed(0)} {showCurrency}</div>
                                                {oldPrice !== 0 && (
                                                    <div className="order-product-data-info-price-old">{oldPrice.toFixed(0)} {showCurrency}</div>
                                                )}
                                            </div>
                                            <div className="order-product-data-info-price-vat">{showVAT(price)}</div>
                                            <div className="order-product-data-info-title">{title}</div>								
                                        </div>
                                        <div className="order-product-data-preorder">
                                            <button
                                                type="button"
                                                className="order-product-data-preorder-button preorder-boost"
                                                onClick={() => handleSubmit(productId, needCheck)}
                                            >
                                                Order Now
                                            </button>
                                            {!isMobile && <PowermateOrderDetails {...{details}} />}
                                        </div>
                                        {additionals && (<>                                            
                                            {additionals.map(({ id: additionalProductId, title, price, models }) => {
                                                const modelId = models ? models[0].id : null
                                                return (
                                                    <div className="order-product-data-add" key={additionalProductId}>
                                                        <input
                                                            className="order-product-data-add-checkbox"
                                                            type="checkbox"
                                                            id={`additional-product-${productId}-${additionalProductId}`}
                                                            checked={modelId !== null && selectedAdditionals[productId!].includes(modelId)}
                                                            onChange={(e) => handleAdditionalSelect(e, productId, modelId)}
                                                        />
                                                        <label
                                                            className="order-product-data-add-title"
                                                            htmlFor={`additional-product-${productId}-${additionalProductId}`}
                                                        >
                                                            Add Additional {title}&nbsp;
                                                            <span className="order-product-data-add-price">
                                                                {price?.toFixed(0) || 0} {showCurrency} {showVAT(price)}
                                                            </span>
                                                        </label>
                                                    </div>
                                                )
                                            })}
                                        </>)}
                                        {isMobile && <PowermateOrderDetails {...{details}} />}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>		
                </div>
            </div>
        </div>
        <PowermateCompatibilityWarningPopup
            open={warningPopupOpen}
            onClose={() => setWarningPopupOpen(false)}
            onCheck={handleCheck}
            onConfirm={handleConfirm}
        />
        <PowermateCompatibilityCheckPopup
            open={checkPopupOpen}
            onClose={() => setCheckPopupOpen(false)}
            onCompleted={onCompleted}
        />
        <PowermateCompatibilityResultPopup
            open={resultPopupOpen}
            onClose={() => setResultPopupOpen(false)}
            {...resultPopupData}
        />
    </>)
}

export default PowermateOrder
