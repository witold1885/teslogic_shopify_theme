import React, { useState, useEffect, useRef } from 'react'
import * as yup from 'yup'
import { useAppSelector } from '../../redux/hooks'
import { setSubscriptionCookie } from '../../utils/cookies'
import PopupWrap, { type PopupRefProps } from './PopupWrap'
import PopupCheckbox from './PopupCheckbox'
import logo from '../../assets/images/popup-logo-white.svg'

interface SubscriptionPopupProps {
    open: boolean
    onProceed?: (data: Record<string, string | boolean> | null) => void
    onClose?: () => void
}

type SubscriptionPayload = { email: string; agree: boolean }

const subscribeSchema = yup.object<Record<keyof SubscriptionPayload, typeof yup>>({
    email: yup.string().email('Email not valid').required('Fill in the field'),
    agree: yup.boolean().oneOf([true])
}).required()

const SubscriptionPopup: React.FC<SubscriptionPopupProps> = ({ open, onProceed = () => {}, onClose = () => {} }) => {
    const wrap = useRef<PopupRefProps>(null)

    const [data, setData] = useState<SubscriptionPayload>({ email: '', agree: false })
    const [errors, setErrors] = useState<Record<keyof SubscriptionPayload, string | null>>({ email: null, agree: null })

    const { discountSubscribeError: apiError } = useAppSelector(state => state.subscribe)

    const handleChange = (param: keyof SubscriptionPayload, value: string | boolean) => {
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

    const handleProceed = async () => {
        const formValid = await validateForm(data)
        if (formValid) {
            wrap?.current?.close(() => onProceed({ ...data, mode: 'discount' }))
        }
    }

    const handleCancel = () => {
        setSubscriptionCookie('discount_subscription', 0)
        wrap?.current?.close(() => onClose())
    }

    return (
        <PopupWrap ref={wrap} id="subscription-popup" className="subscription-popup" open={open} onClose={handleCancel}>
            <div className="subscription-popup-head">
                <div className="subscription-popup-logo">
                    <img src={logo} alt="SCREENMATE" />
                </div>
                <div className="subscription-popup-info">
                    <div className="subscription-popup-title">
                        Your first 5% discount <br className="mobile" />is on Us!
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
                            name="email"
                            type="email"
                            placeholder="John.smith@example.com"
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                        />
                        {errors.email && <span className="subscription-popup-field-error-message">{errors.email}</span>}
                    </div>
                    <PopupCheckbox
                        id="subscription-popup-agree"
                        checked={data.agree}
                        onChange={(e) => handleChange('agree', e.target.checked)}
                        error={errors.agree}
                    />
                </div>
                <div className="subscription-popup-buttons">
                    <button className="subscription-popup-submit" onClick={handleProceed}>
                        I want 5% off
                    </button>
                    <button className="subscription-popup-cancel" onClick={handleCancel}>
                        I'll pay in full
                    </button>
                </div>
            </div>
        </PopupWrap>
    )
}

export default SubscriptionPopup
