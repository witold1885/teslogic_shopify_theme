import { Fragment, useState, useEffect, useRef, useMemo, useCallback, type FC, type ReactNode } from 'react'
import './bundle-popup.scss'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { useDynamicSlice } from '../../../hooks/dynamic-slice'
import { fetchProducts } from '../../../redux/selectors/products'
import { fetchOrder } from '../../../redux/selectors/order'
import { fetchContent } from '../../../redux/selectors/content'
import type { Model, Product } from '../../../types/product'
import PopupWrap, { type PopupRefProps } from '../PopupWrap'
import Icon from '../../Common/Icon'
import Dropdown, { type DropdownOption } from '../../Common/Dropdown'
import bundleImage from '../../../assets/images/promotion/bundle/bundle.png'

interface BundlePopupProps {
    discount?: number
    open: boolean
    onClose: () => void
}

const getRadioIcon = (selected: boolean): ReactNode => selected ? (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="8.25" stroke-width="1.5" stroke="#0465FD"/>
        <circle cx="10" cy="10" r="4" fill="#0465FD"/>
    </svg>
) : (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="10" cy="10" r="8.25" stroke-width="1.5" stroke="white" stroke-opacity="0.5"/>
    </svg>
)

const compatibilityWarningIcon = (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M7.30511 4.04306C8.51253 1.98566 11.4875 1.98563 12.6949 4.04306L17.5656 12.3438C18.7878 14.4266 17.2859 17.0496 14.8709 17.0496H5.12914C2.7141 17.0496 1.21217 14.4267 2.43445 12.3438L7.30511 4.04306ZM11.5398 4.72087C10.8499 3.54527 9.15019 3.54529 8.46023 4.72087L3.58913 13.0216L3.52854 13.134C2.96395 14.2663 3.73909 15.6201 5.00142 15.7062L5.12914 15.7106H14.8709L14.999 15.7062C16.2611 15.6198 17.0363 14.2662 16.4719 13.134L16.4109 13.0216L11.5398 4.72087Z" fill-rule="evenodd" clip-rule="evenodd" fill="#0465FD"/>
        <ellipse cx="10.0058" cy="13.1391" rx="0.79872" ry="0.79872" fill="#0465FD"/>
        <rect x="9.20703" y="6.28149" width="1.48784" height="4.95948" rx="0.743922" fill="#0465FD"/>
    </svg>
)

interface BundlePricing {
    currentPrice: number
    oldPrice: number
    economy: number
}

interface PowermateVersion {
    power: string
    compatibility: {
        text: string
        icon?: ReactNode
        button: string
    }
}

type Bundle = Product & BundlePricing & PowermateVersion

const commonTitle: string = 'Screenmate ONE + Powermate'

const powermateVersions: Record<string, PowermateVersion> = {
    'one-powermate-boost': {
        power: '+50 HP',
        compatibility: {
            text: 'Eligible Model 3/Y vehicles',
            button: 'Compatibility details'
        }
    },
    'one-powermate-performance': {
        power: '+150 HP',
        compatibility: {
            text: 'Requires AWD and a 980 motor',
            icon: compatibilityWarningIcon,
            button: 'Check Compatibility'
        }
    }
}

const shopifyUrl: string = import.meta.env.VITE_SHOPIFY_URL || 'http://localhost:5173'

const BundlePopup: FC<BundlePopupProps> = ({ discount = 0, open, onClose }) => {
    const dispatch = useAppDispatch()

    const wrap = useRef<PopupRefProps>(null)

    const { addToCart } = useDynamicSlice('order', () => import('../../../redux/slices/order'))
    const { bundleProducts } = useAppSelector(fetchProducts)
    const { rate, addedToCart } = useAppSelector(fetchOrder)
    const { country } = useAppSelector(fetchContent)

    const currency: string = useMemo(() => country?.currency_code || 'USD', [country])
    // const currency: string = 'USD'

    const coef: number = useMemo(() => currency === 'EUR' ? (rate || 1) : 1, [currency, rate])

    const bundles: Bundle[] = useMemo(() => bundleProducts?.map(({ title, price, ...product }) => {
        const recalcPrice = (price || 0) * coef
        const economy = recalcPrice * discount / 100
        const currentPrice = recalcPrice - economy
        const oldPrice = economy ? recalcPrice : 0
        return {
            ...product,
            title: title.replace(commonTitle, '').trim(),
            currentPrice,
            oldPrice,
            economy,
            ...powermateVersions[product.slug]
        }
    }) || [], [bundleProducts, coef, discount])

    const [selectedBundle, setSelectedBundle] = useState<Bundle | null>(bundles[0] || null)

    const options: DropdownOption[] = (selectedBundle?.models || []).flatMap(({ id, title }) =>
        title.split('|').map((model) => ({ label: model.trim(), value: id }))
    )

    const [selectedModel, setSelectedModel] = useState<Model | null>(null)
    const [error, setError] = useState<boolean>(false)

    const handleModelSelect = useCallback((modelId: number) => {
        setError(false)
        const model = selectedBundle?.models?.find(({ id }) => id === modelId) || null
        setSelectedModel(model)
    }, [selectedBundle])
    
    const handleSubmit = useCallback(() => {
        if (selectedModel) {
            const items = [{ id: selectedModel.id, quantity: 1 }]
            dispatch(addToCart({ items }))
        } else {
            setError(true)
        }
    }, [selectedModel, dispatch, addToCart])    

    useEffect(() => {
        if (addedToCart && typeof window !== 'undefined') {
            window.open(`${shopifyUrl}/cart`, '_blank')
        }
    }, [addedToCart])

    return (
        <PopupWrap
            ref={wrap}
            className="bundle-popup"
            backgroundType="color"
            background="#191919"
            open={open}
            onClose={onClose}
        >
            <div className="bundle-popup-gallery">
                <img className="object-cover" src={bundleImage} />
                <div className="bundle-popup-gallery-title">Black Friday <br />Bundle<div /></div>
                <div className="bundle-popup-gallery-discount">25% OFF</div>
            </div>
            <div className="bundle-popup-form">
                <div className="bundle-popup-form-top">
                    <div className="bundle-popup-form-title">{commonTitle}</div>
                    <div className="bundle-popup-form-subtitle">
                        Add more power and acceleration to your Tesla. <br />
                        Save 25% when you buy both.
                    </div>
                </div>
                <div className="bundle-popup-form-body">
                    <div className="bundle-popup-form-powermate">
                        <div className="bundle-popup-form-powermate-title">Choose your Powermate version</div>
                        <div className="bundle-popup-form-powermate-versions">
                            {bundles?.map(bundle => {
                                const { id, slug, title, power, compatibility, currentPrice } = bundle
                                return (
                                    <Fragment key={`powermate-${slug}`}>
                                        <label className="bundle-popup-form-powermate-version" htmlFor={`powermate-${slug}`}>                                        
                                            <div className="bundle-popup-form-powermate-version-body">
                                                <div className="bundle-popup-form-powermate-version-top">
                                                    <div className="bundle-popup-form-powermate-version-title">
                                                        <span>{title}</span>
                                                        <Icon svg={getRadioIcon(selectedBundle?.id === id)} />
                                                    </div>
                                                    <div className="bundle-popup-form-powermate-version-power">{power}</div>
                                                </div>
                                                <div className="bundle-popup-form-powermate-version-compatibility">
                                                    <div>{compatibility.text}</div>
                                                    <a>
                                                        {compatibility.icon && <Icon svg={compatibility.icon} />}
                                                        {compatibility.button}
                                                    </a>
                                                </div>
                                            </div>
                                            <div className="bundle-popup-form-powermate-version-total">
                                                <span>Bundle total</span><span>{currentPrice?.toFixed(0) || 0} {currency}</span>
                                            </div>
                                        </label>
                                        <input
                                            id={`powermate-${slug}`}
                                            type="radio"
                                            name="powermate_version"
                                            value={slug}
                                            onChange={() => setSelectedBundle(bundle)}
                                            style={{ display: 'none' }}
                                        />
                                    </Fragment>
                                )
                            })}
                        </div>
                    </div>
                    <div className="bundle-popup-form-screenmate-one">
                        <div className="bundle-popup-form-screenmate-one-title">Choose your Screenmate ONE version</div>
                        <Dropdown
                            placeholder="Select your Tesla model and year"
                            {...{options, error}}
                            onSelect={(modelId) => handleModelSelect(modelId as number)}
                        />
                    </div>
                </div>
                <div className="bundle-popup-form-bottom">
                    <div className="bundle-popup-form-submit">
                        <div className="bundle-popup-form-total">
                            <div>Bundle total</div>
                            <div className="bundle-popup-form-total-price">
                                {selectedBundle?.oldPrice && (
                                    <span className="bundle-popup-form-total-price-old">{selectedBundle?.oldPrice?.toFixed(0) || 0} {currency}</span>
                                )}
                                <span className="bundle-popup-form-total-price-new">{selectedBundle?.currentPrice?.toFixed(0) || 0} {currency}</span>
                            </div>
                            <div className="bundle-popup-form-total-title">{commonTitle} {selectedBundle?.title}</div>
                            <div className="bundle-popup-form-total-economy">
                                {selectedBundle?.economy ? `Save ${selectedBundle?.economy?.toFixed(0) || 0} ${currency}` : ''}
                            </div>
                        </div>
                        <button onClick={handleSubmit}>Order Bundle</button>
                    </div>
                    <div className="bundle-popup-form-note">
                        <span>Learn more about</span>
                        <a href="/pro">Powermate</a>
                        <span>or</span>
                        <a href="/">Screenmate ONE</a>
                    </div>
                </div>
            </div>
        </PopupWrap>
    )
}

export default BundlePopup
