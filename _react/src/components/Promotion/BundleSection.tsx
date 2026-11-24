import { Fragment, useState, useEffect, useMemo, useCallback, type FC, type ReactNode } from 'react'
import './bundle-section.scss'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { useDynamicSlice } from '../../hooks/dynamic-slice'
import { fetchProducts } from '../../redux/selectors/products'
import { fetchOrder } from '../../redux/selectors/order'
import { fetchContent } from '../../redux/selectors/content'
import type { Model, Product } from '../../types/product'
import Icon from '../Common/Icon'
import Dropdown, { type DropdownOption } from '../Common/Dropdown'
import bundleImage from '../../assets/images/promotion/bundle/bundle.png'
import bundleBfsImage from '../../assets/images/promotion/bundle/bundle-bfs.png'
import bundleBfsVipImage from '../../assets/images/promotion/bundle/bundle-bfs-vip.png'
import PowermateCompatibility from '../Powermate/PowermateCompatibility'
import chevron from '../../assets/icons/chevron-white-left.svg'

import { mapSimpleConfigs, useAnime, type AnimatedObjectOptions } from '../../hooks/anime'

const animatedObjects: Record<string, AnimatedObjectOptions> = {
    title: { yFrom: '40px', duration: 666 },
    subtitle: { yFrom: '20px', duration: 333 },
    versionsTitle: { yFrom: '20px', duration: 333 },
    versionsList: { yFrom: '20px', duration: 333 },
    modelsTitle: { yFrom: '20px', duration: 333 },
    modelsList: { yFrom: '20px', duration: 333 },
    total: { yFrom: '20px', duration: 333 },
    button: { yFrom: '40px', duration: 666 },
    note: { yFrom: '20px', duration: 333 },
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

interface BundleSectionProps {
    slug?: string
    discount?: number
    onCompatibilityCheck: (boostOrderCallback?: () => void, isBundle?: boolean) => void
    onCompatibilityWarning: (confirmCallback?: () => void, boostOrderCallback?: () => void, isBundle?: boolean) => void
    linkTo?: { href: string; text: string }
}

interface BundlePricing {
    currentPrice: number
    oldPrice: number
    economy: number
}

interface PowermateVersion {
    needCheck: boolean
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
        needCheck: false,
        power: '+50 HP',
        compatibility: {
            text: 'Eligible Model 3/Y vehicles',
            button: 'Compatibility details'
        }
    },
    'one-powermate-performance': {
        needCheck: true,
        power: '+150 HP',
        compatibility: {
            text: 'Requires AWD and a 980 motor',
            icon: compatibilityWarningIcon,
            button: 'Check Compatibility'
        }
    }
}

const shopifyUrl: string = import.meta.env.VITE_SHOPIFY_URL || 'http://localhost:5173'

const BundleSection: FC<BundleSectionProps> = ({ slug, discount = 0, onCompatibilityCheck, onCompatibilityWarning, linkTo }) => {
    const dispatch = useAppDispatch()

    const { addToCart } = useDynamicSlice('order', () => import('../../redux/slices/order'))
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

    const boostBundle = useMemo(() => bundles.find(({ slug }) => slug === 'one-powermate-boost'), [bundles])
    
    const [selectedBundleId, setSelectedBundleId] = useState<number | null>(
        bundles.find(product => product.slug === slug)?.id || bundles[0]?.id || null
    )

    const selectedBundle: Bundle | null = useMemo(() => bundles?.find(
        ({ id }) => id === selectedBundleId
    ) || null, [bundles, selectedBundleId])

    const options: DropdownOption[] = useMemo(() => selectedBundle?.models?.flatMap(({ id, title }) =>
        title.split('|').map((model) => ({ label: model.trim(), value: id }))
    ) || [], [selectedBundle])

    const [selectedModel, setSelectedModel] = useState<Model | null>(null)
    const [selectedOption, setSelectedOption] = useState<DropdownOption | null>(null)
    const [error, setError] = useState<boolean>(false)

    useEffect(() => {
        const { value: modelId, label: modelLabel } = selectedOption ? (
            options.find(({ label }) => label === selectedOption.label) || {}
        ) : {}
        if (modelId) {
            handleModelSelect(modelId as number, modelLabel)
        }
    }, [options])

    const handleModelSelect = useCallback((modelId: number, modelLabel?: string) => {
        setError(false)
        setSelectedModel(selectedBundle?.models?.find(({ id }) => id === modelId) || null)
        setSelectedOption(options.find(({ label }) => label === modelLabel) || null)
    }, [selectedBundle, options])

    const handleOrder = useCallback((productId: number) => {
        const items = [{ id: productId, quantity: 1 }]
        dispatch(addToCart({ items }))
    }, [dispatch, addToCart])
    
    const compatibilityCallback = useCallback((productId: number | undefined) => {
        if (productId) {
            handleOrder(productId)
        }
    }, [handleOrder])

    const boostOrderCallback = useCallback(() => {
        setSelectedBundleId(boostBundle?.id || null)
        compatibilityCallback(boostBundle?.models?.find(({ title }) => title === selectedModel?.title)?.id)
    }, [compatibilityCallback, boostBundle, selectedModel])

    const handleCompatibilityCheck = useCallback(() => {
        if (selectedModel) {
            onCompatibilityCheck(() => boostOrderCallback(), true)
        } else {
            setError(true)
        }
    }, [onCompatibilityCheck, boostOrderCallback, selectedModel])

    const handleSubmit = useCallback(() => {
        if (selectedModel) {
            if (selectedBundle?.needCheck) {
                onCompatibilityWarning(
                    () => compatibilityCallback(selectedModel.id),
                    () => boostOrderCallback(),
                    true
                )
            } else {
                handleOrder(selectedModel.id)
            }
        } else {
            setError(true)
        }
    }, [onCompatibilityWarning, compatibilityCallback, boostOrderCallback, selectedModel, handleOrder])    

    useEffect(() => {
        if (addedToCart && typeof window !== 'undefined') {
            window.open(`${shopifyUrl}/cart`, '_blank')
        }
    }, [addedToCart])

    const [compatibilityMode, setCompatibilityMode] = useState<boolean>(false)

    const animationConfigs = useMemo(() => mapSimpleConfigs(animatedObjects), [])
        
    const { anime } = useAnime(animationConfigs)

    return (
        <div className="bundle-section">
            <div hidden={!compatibilityMode}>
            {/* {!compatibilityMode ? (<> */}
                <div className="bundle-section-gallery">
                    <img
                        className="object-cover"
                        src={discount === 30 ? bundleBfsVipImage : (discount === 25 ? bundleBfsImage : bundleImage)}
                    />
                </div>
                <div className="bundle-section-form">
                    <div className="bundle-section-form-top">
                        <div {...anime('title')} className="bundle-section-form-title">{commonTitle}</div>
                        <div {...anime('subtitle')} className="bundle-section-form-subtitle">
                            Add more power and acceleration to your Tesla. <br />
                            Save {discount}% when you buy both.
                        </div>
                    </div>
                    <div className="bundle-section-form-body">
                        <div className="bundle-section-form-powermate">
                            <div {...anime('versionsTitle')} className="bundle-section-form-powermate-title">Choose your Powermate version</div>
                            <div {...anime('versionsList')} className="bundle-section-form-powermate-versions">
                                {bundles?.map(bundle => {
                                    const { id, slug, title, power, compatibility, currentPrice } = bundle
                                    return (
                                        <Fragment key={`powermate-${slug}`}>
                                            <label className="bundle-section-form-powermate-version" htmlFor={`powermate-${slug}`}>                                        
                                                <div className="bundle-section-form-powermate-version-body">
                                                    <div className="bundle-section-form-powermate-version-top">
                                                        <div className="bundle-section-form-powermate-version-title">
                                                            <span>{title}</span>
                                                            <Icon svg={getRadioIcon(selectedBundle?.id === id)} />
                                                        </div>
                                                        <div className="bundle-section-form-powermate-version-power">{power}</div>
                                                    </div>
                                                    <div className="bundle-section-form-powermate-version-compatibility">
                                                        <div>{compatibility.text}</div>
                                                        <a onClick={(e) => {
                                                            e.preventDefault()
                                                            setCompatibilityMode(true)
                                                        }}>
                                                            {compatibility.icon && <Icon svg={compatibility.icon} />}
                                                            {compatibility.button}
                                                        </a>
                                                    </div>
                                                </div>
                                                <div className="bundle-section-form-powermate-version-total">
                                                    <span>Bundle total</span><span>{currentPrice?.toFixed(0) || 0} {currency}</span>
                                                </div>
                                            </label>
                                            <input
                                                id={`powermate-${slug}`}
                                                type="radio"
                                                name="powermate_version"
                                                value={id}
                                                onChange={() => setSelectedBundleId(id)}
                                                style={{ display: 'none' }}
                                            />
                                        </Fragment>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="bundle-section-form-screenmate-one">
                            <div {...anime('modelsTitle')} className="bundle-section-form-screenmate-one-title">Choose your Screenmate ONE version</div>
                            <Dropdown
                                {...anime('modelsList')}
                                placeholder="Select your Tesla model and year"
                                {...{options, error}}
                                onSelect={(modelId, modelLabel) => handleModelSelect(modelId as number, modelLabel)}
                            />
                        </div>
                    </div>
                    <div className="bundle-section-form-bottom">
                        <div className="bundle-section-form-submit">
                            <div {...anime('total')} className="bundle-section-form-total">
                                <div>Bundle total</div>
                                <div className="bundle-section-form-total-price">
                                    {selectedBundle?.oldPrice && (
                                        <span className="bundle-section-form-total-price-old">{selectedBundle?.oldPrice?.toFixed(0) || 0} {currency}</span>
                                    )}
                                    <span className="bundle-section-form-total-price-new">{selectedBundle?.currentPrice?.toFixed(0) || 0} {currency}</span>
                                </div>
                                <div className="bundle-section-form-total-title">{commonTitle} {selectedBundle?.title}</div>
                                <div className="bundle-section-form-total-economy">
                                    {selectedBundle?.economy ? `Save ${selectedBundle?.economy?.toFixed(0) || 0} ${currency}` : ''}
                                </div>
                            </div>
                            <button {...anime('button')} onClick={handleSubmit}>Order Bundle</button>
                        </div>
                        {linkTo && (
                            <div {...anime('note')} className="bundle-section-form-note">
                                <span>Learn more about</span>
                                <a href={linkTo.href}>{linkTo.text}</a>
                            </div>
                        )}
                    </div>
                </div>
            {/* </>) : (<> */}
            </div>
            <div hidden={!compatibilityMode}>
                <div className="bundle-section-back" onClick={() => setCompatibilityMode(false)}>
                    <Icon icon={chevron} />
                    <span>Back to Bundle</span>
                </div>
                <PowermateCompatibility onCompatibilityCheck={handleCompatibilityCheck} />
            </div>
            {/* </>)} */}
        </div>
    )
}

export default BundleSection
