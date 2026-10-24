import { useState, useEffect, useRef, useMemo, useCallback, type FC } from 'react'
import './powermate-compatibility-dialog.scss'
import * as yup from 'yup'
import { useAppDispatch, useAppSelector } from '../../../redux/hooks'
import { fetchCompatibility } from '../../../redux/selectors/compatibility'
import { useDynamicSlice } from '../../../hooks/dynamic-slice'
import PopupWrap, { type PopupRefProps } from '../PopupWrap'
import Icon from '../../Common/Icon'
import loader from '../../../assets/icons/blue-loader.svg'

interface PopupProps {
    open: boolean
    onClose: () => void
    onCompleted: (proceed: boolean) => void
}

type CompatibilityPayload = { vin: string; email: string; agree: boolean }

const VIN_LENGTH: number = 17

const compatibilitySchema = yup.object<Record<keyof CompatibilityPayload, typeof yup>>({
    vin: yup.string().length(VIN_LENGTH, 'VIN not valid').required('Fill in the field'),
    email: yup.string().email('Email not valid').required('Fill in the field'),
    agree: yup.boolean().oneOf([true])
}).required()

const PowermateCompatibilityCheckPopup: FC<PopupProps> = ({ open, onClose, onCompleted }) => {
    const dispatch = useAppDispatch()

    const { checkCompatibility, clearCompatibility } = useDynamicSlice('compatibility', () => import('../../../redux/slices/compatibility'))
    const { loading, checkingCompleted, proceed, error, checkingError } = useAppSelector(fetchCompatibility)

    const wrap = useRef<PopupRefProps>(null)

    const [data, setData] = useState<CompatibilityPayload>({ vin: '', email: '', agree: false })
    const [errors, setErrors] = useState<Record<keyof CompatibilityPayload, string | null>>({ vin: null, email: null, agree: null })

    const fields = useMemo(() => ({
        vin: { label: 'VIN: (can be copied from your Tesla app)', type: 'text', placeholder: 'Enter car’s VIN number', value: data.vin, error: errors.vin},
        email: { label: 'E-mail:', type: 'text', placeholder: 'John.smith@example.com', value: data.email, error: errors.email},
    }), [data, errors])

    const handleChange = (param: keyof CompatibilityPayload, value: string | boolean) => {
        setErrors(prev => ({ ...prev, [param]: null }))
        setData(prev => ({ ...prev, [param]: value }))
    }
    
    const validateForm = useCallback(async (formData: CompatibilityPayload) => {
        try {
            await compatibilitySchema.validate(formData, { abortEarly: false })
            return true
        } catch (e: any) {
            setErrors({
                ...errors,
                ...e.inner.reduce((acc: any, error: any) => ({ ...acc, [error.params.path]: error.message }), {})
            })
            return false
        }
    }, [errors])

    const handleSubmit = useCallback(async () => {
        const formValid = await validateForm(data)
        if (formValid) {
            dispatch(checkCompatibility(data))
        }
    }, [data, validateForm, dispatch, checkCompatibility])

    useEffect(() => {
        if (checkingCompleted) {
            if (checkingError) {
                if (checkingError === 'wrong-vin') {
                    setErrors(prev => ({ ...prev, vin: 'VIN is wrong' }))
                }
            } else {
                if (proceed !== undefined && proceed !== null) onCompleted(proceed)
            }
            dispatch(clearCompatibility())
        }
    }, [checkingCompleted, proceed, checkingError, onCompleted, clearCompatibility])

    return (
        <PopupWrap
            ref={wrap}
            className="compatibility-dialog compatibility-check-dialog"
            backgroundType="color"
            background="#171717"
            open={open}
            onClose={onClose}
        >
            <div className="compatibility-dialog-title">Check Compatibility</div>
            <div className="compatibility-check-dialog-unavailable-wrap">
                {error && (
                    <div className="compatibility-check-dialog-unavailable compatibility-check-dialog-field-error">
                        Service temporary unavailable
                    </div>
                )}
            </div>
            <div className="compatibility-check-dialog-fields">
                {Object.entries(fields).map(([name, { label, type, placeholder, value, error }]) => (
                    <div className="compatibility-check-dialog-field" key={name}>
                        <label htmlFor={`compatibility-${name}`}>{label}</label>
                        <input
                            id={`compatibility-${name}`}
                            {...{name, type, placeholder, value}}
                            onChange={(e) => handleChange(name as keyof CompatibilityPayload, e.target.value)}
                        />
                        {error && <div className="compatibility-check-dialog-field-error">{error}</div>}
                    </div>
                ))}
            </div>
            <div className="compatibility-check-dialog-submit">
                <button type="button" className="compatibility-check-dialog-button" onClick={handleSubmit}>
                    {!loading ? (
                        <span className="ready">Send Request</span>
                    ) : (
                        <span className="loading">
                            <span>Loading</span>
                            <Icon className="loader" icon={loader} />
                        </span>
                    )}
                </button>
                <div className={`compatibility-check-dialog-agree ${errors.agree ? 'compatibility-check-dialog-agree-error' : ''}`}>
                    <div className="compatibility-check-dialog-agree-checkbox-wrap">
                        <input
                            type="checkbox"
                            id="check-agree"
                            className="compatibility-check-dialog-agree-checkbox"
                            checked={data.agree}
                            onChange={(e) => handleChange('agree', e.target.checked)}
                        />
                    </div>
                    <label
                        htmlFor="check-agree"
                        className="compatibility-check-dialog-agree-label"
                    >
                        I agree to receive Information emails from Screenmate
                    </label>
                </div>
            </div>
        </PopupWrap>
    )
}

export default PowermateCompatibilityCheckPopup
