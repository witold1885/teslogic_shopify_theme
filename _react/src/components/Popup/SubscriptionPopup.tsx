import React, { useState, useEffect, useRef } from 'react'
import * as yup from 'yup'
import Cookies from 'js-cookie'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { discountSubscribe } from '../../redux/slices/subscribe'
import PopupWrap from './PopupWrap'
import logo from '../../assets/images/popup-logo-white.svg'
import ChevronDownIcon from '../../assets/icons/ChevronDownIcon'
import { useOutsideClick } from '../../hooks/outside-click'

const models: string[] = [
    'Model 3 ‘17-20',
    'Model 3 ‘21-23',
    'Model 3 Highland',
    'Model Y ‘21-24',
    'Model Y Juniper',
    'Model S ‘21+',
    'Model X ‘21+'
]

interface SubscriptionPopupProps {
    open: boolean
    onSuccess?: () => void
    onClose?: () => void
}

type SubscriptionPayload = { email: string; model: string }

const subscribeSchema = yup.object<Record<keyof SubscriptionPayload, typeof yup>>({
    email: yup.string().email('Email not valid').required('Fill in the field'),
    model: yup.string().required('Fill in the field'),
}).required()

const setSubscriptionCookie = (value: number): void => {
    Cookies.set('discount_subscription', value.toString(), { expires: 365, path: '/' })
}

const SubscriptionPopup: React.FC<SubscriptionPopupProps> = ({ open, onSuccess = () => {}, onClose = () => {} }) => {
    const dispatch = useAppDispatch()

    const popupDropdownRefs = useRef<(HTMLDivElement | null)[]>([])

    const setPopupDropdownRef = (index: number) => (el: HTMLDivElement | null) => {
        popupDropdownRefs.current[index] = el
    }

    const [modelsDropdownOpen, setModelsDropdownOpen] = useState<boolean>(false)
    const [data, setData] = useState<SubscriptionPayload>({ email: '', model: '' })
    const [errors, setErrors] = useState<Record<keyof SubscriptionPayload, string | null>>({ email: null, model: null })
    const [closing, setClosing] = useState<boolean>(false)

    const { subscribed, error: apiError } = useAppSelector(state => state.subscribe)
    
    useOutsideClick(popupDropdownRefs, () => {
        if (modelsDropdownOpen) setModelsDropdownOpen(false)
    })

    const handleModelSelect = (e: React.MouseEvent<HTMLDivElement>, model: string | null | undefined = null) => {
        e.stopPropagation()
        handleChange('model', model || '')
        setModelsDropdownOpen(false)
    }

    const handleChange = (param: keyof SubscriptionPayload, value: string) => {
        setErrors(prev => ({ ...prev, [param]: null }))
        setData(prev => ({ ...prev, [param]: value }))
    }
    
    const validateForm = async (formData: SubscriptionPayload) => {
        try {
            await subscribeSchema.validate(formData, { abortEarly: false })
            return true
        } catch (e: any) {
            setErrors({
                ...errors,
                ...e.inner.reduce((acc: any, error: any) => ({ ...acc, [error.params.path]: error.message }), {})
            })
            return false
        }
    }
    
    useEffect(() => {
        if (apiError) {
            setErrors(prev => ({ ...prev, email: apiError === 'email_exists' 
                ? 'This email is already registered' 
                : 'An error occurred, try again'
            }))
        }
    }, [apiError])

    useEffect(() => {
        if (subscribed) {
            setSubscriptionCookie(1)
            onSuccess()
        }
    }, [subscribed])

    const handleSubscribe = async () => {
        const formValid = await validateForm(data)
        if (formValid) {
            const { email, model } = data
            dispatch(discountSubscribe({ name: email, email, tesla_models: model ? [model] : [] }))
        }
    }

    const handleCancel = () => {
        setSubscriptionCookie(0)
        onClose()
    }

    return (
        <PopupWrap id="subscription-popup" className="subscription-popup" {...{open, closing}} onClose={handleCancel}>
            <div className="subscription-popup-head">
                <div className="subscription-popup-logo">
                    <img src={logo} alt="SCREENMATE" />
                </div>
                <div className="subscription-popup-info">
                    <div className="subscription-popup-title">
                        Your first 5% discount <br />is on us!
                    </div>
                    <div className="subscription-popup-subtitle">
                        Join Screenmate Community <br className="mobile" />and get <br className="desktop" />
                        best deals <br className="mobile" />and exclusive updates.
                    </div>
                </div>
            </div>
            <div className="subscription-popup-form">
                <div className="subscription-popup-fields">
                    <div className={`subscription-popup-field ${errors.email ? 'subscription-popup-field-error' : ''}`}>
                        <label>E-mail:</label>
                        <input
                            className="subscription-popup-email"
                            type="email"
                            placeholder="John.smith@example.com"
                            value={data.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                        />
                        {errors.email && <span className="subscription-popup-field-error-message">{errors.email}</span>}
                    </div>
                    <div className={`subscription-popup-field ${errors.model ? 'subscription-popup-field-error' : ''}`}>
                        <label>Tesla model:</label>
                        <div
                            className="subscription-popup-field-select"
                            onClick={(e) => {
                                e.stopPropagation()
                                setModelsDropdownOpen(true)
                            }}
                        >
                            <span className="subscription-popup-field-select-value">
                                {data.model || 'Select your Tesla model and year'}
                            </span>
                            <div className="subscription-popup-field-select-arrow">
                                <ChevronDownIcon />
                            </div>
                            {modelsDropdownOpen && (
                                <div ref={setPopupDropdownRef(0)} className="subscription-popup-field-select-dropdown">
                                    <div
                                        className="subscription-popup-field-select-dropdown-item"
                                        onClick={handleModelSelect}
                                    >
                                        <span>Select your Tesla model and year</span>
                                        <div className="subscription-popup-field-select-arrow">
                                            <ChevronDownIcon color='#B9B9B9' />
                                        </div>
                                    </div>
                                    {models.map((model, index) => (
                                        <div
                                            key={index}
                                            className="subscription-popup-field-select-dropdown-item"
                                            onClick={(e) => handleModelSelect(e, model)}
                                        >
                                            <span>{model}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        {errors.model && <span className="subscription-popup-field-error-message">{errors.model}</span>}
                    </div>
                </div>
                <div className="subscription-popup-buttons">
                    <button className="subscription-popup-submit" onClick={handleSubscribe}>
                        I want 5% off
                    </button>
                    <button className="subscription-popup-cancel" onClick={() => setClosing(true)}>
                        I'll pay in full
                    </button>
                </div>
            </div>
        </PopupWrap>
    )
}

export default SubscriptionPopup
