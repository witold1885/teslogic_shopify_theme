import { useState, useEffect, useRef, useCallback, type FC } from 'react'
import * as yup from 'yup'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { fetchSubscribe } from '../../../redux/selectors/subscribe'
import { useDynamicSlice } from '../../../hooks/dynamic-slice'
import { setSubscriptionCookie } from '../../../utils/cookies'
import PopupWrap, { type PopupRefProps } from '../PopupWrap'

interface BlackFridayPopupProps {
    open: boolean
    onConfirm?: () => void
    onClose?: () => void
}

type BlackFridayPayload = { email: string }

const blackFridaySchema = yup.object<Record<keyof BlackFridayPayload, typeof yup>>({
    email: yup.string().email('Email not valid').required('Fill in the field')
}).required()

const BlackFridayPopup: FC<BlackFridayPopupProps> = ({ open, onConfirm = () => {}, onClose = () => {} }) => {
    const wrap = useRef<PopupRefProps>(null)

    const dispatch = useAppDispatch()

    const { vipSubscribe, resetError } = useDynamicSlice('subscribe', () => import('../../../redux/slices/subscribe'))

    const [data, setData] = useState<BlackFridayPayload>({ email: '' })
    const [errors, setErrors] = useState<Record<keyof BlackFridayPayload, string | null>>({ email: null })
    
    const { vipSubscribed, error: apiError } = useAppSelector(fetchSubscribe)
    
    const handleChange = (param: keyof BlackFridayPayload, value: string) => {
        setErrors(prev => ({ ...prev, [param]: null }))
        setData(prev => ({ ...prev, [param]: value }))
    }
    
    const validateForm = useCallback(async (formData: BlackFridayPayload) => {
        try {
            await blackFridaySchema.validate(formData, { abortEarly: false })
            return true
        } catch (e: any) {
            setErrors({
                ...errors,
                ...e.inner.reduce((acc: any, error: any) => ({ ...acc, [error.params.path]: error.message }), {})
            })
            return false
        }
    }, [errors])

    const handleConfirm = useCallback(async () => {
        dispatch(resetError())
        const formValid = await validateForm(data)
        if (formValid) {
            dispatch(vipSubscribe(data))
        }
    }, [data, validateForm, dispatch, resetError, vipSubscribe])
    
    const handleCancel = () => {
        wrap?.current?.close(() => onClose())
    }

    useEffect(() => {
        if (vipSubscribed) {
            setSubscriptionCookie('bf26_vip_subscription', 1)
            wrap?.current?.close(() => onConfirm())
        }
    }, [vipSubscribed])
        
    useEffect(() => {
        if (apiError) {
            setErrors(prev => ({ ...prev, email: apiError === 'email_exists' 
                ? 'This email is already registered' 
                : 'An error occurred, try again'
            }))
        }
    }, [apiError])
    
    return (
        <PopupWrap
            ref={wrap}
            id="bf-popup"
            className="bf-popup"
            backgroundType="gradient"
            background="radial-gradient(232.7% 231.46% at -70.1% -55.51%, hsl(271deg 97.4576% 53.7255% / 0.8) 0%, rgba(22, 87, 252, 0.00) 100%), radial-gradient(205.08% 142.52% at 111.15% 52.69%, rgba(34, 74, 251, 0.30) 0%, rgba(34, 74, 251, 0.00) 100%), rgba(0, 0, 0, 0.50)"
            open={open}
            onClose={handleCancel}
        >
            <div className="bf-popup-head">
                <div>VIP EARLY ACCESS</div>
                <div>Black Friday</div>
            </div>
            <div className="bf-popup-body">
                <div className="bf-popup-info">
                    <div>Before everyone else</div>
                    <div>Get 24-hour early access and our best <br />deals of the year. Opens Nov 26.</div>
                </div>
                <div className="bf-popup-form">
                    <div className={`bf-popup-form-field ${errors.email ? 'bf-popup-form-field-error' : ''}`}>
                        <input
                            className="bf-popup-form-email"
                            name="email"
                            type="email"
                            placeholder="Your e-mail address"
                            autoComplete="email"
                            value={data.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                        />
                        {errors.email && <span className="bf-popup-form-field-error-message">{errors.email}</span>}
                    </div>
                    <button className="bf-popup-button" onClick={handleConfirm}>Get VIP Early Access</button>
                </div>
            </div>
        </PopupWrap>
    )
}

export default BlackFridayPopup
