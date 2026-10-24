import { useState, useRef, useMemo, useCallback, type FC, type ChangeEvent } from 'react'
import './powermate-compatibility-dialog.scss'
import * as yup from 'yup'
import PopupWrap, { type PopupRefProps } from '../PopupWrap'
import loader from '../../../assets/icons/blue-loader.svg'
import Icon from '../../Common/Icon'
import { useAppDispatch } from '../../../redux/hooks'
import { useDynamicSlice } from '../../../hooks/dynamic-slice'

interface PopupProps {
    open: boolean
    onClose: () => void
}

type CompatibilityPayload = { vin: string; email: string; }

const VIN_LENGTH: number = 17

const compatibilitySchema = yup.object<Record<keyof CompatibilityPayload, typeof yup>>({
    vin: yup.string().required().min(VIN_LENGTH).max(VIN_LENGTH),
    email: yup.string().email().required(),
}).required()

const PowermateCompatibilityCheckPopup: FC<PopupProps> = ({ open, onClose }) => {
    const dispatch = useAppDispatch()

    const { checkCompatibility } = useDynamicSlice('compatibility', () => import('../../../redux/slices/compatibility'))

    const wrap = useRef<PopupRefProps>(null)

    const [data, setData] = useState<CompatibilityPayload>({ vin: '', email: '' })
    const [errors, setErrors] = useState<Record<keyof CompatibilityPayload, string | null>>({ vin: null, email: null })

    const fields = useMemo(() => ({
        vin: { label: 'VIN: (can be copied from your Tesla app)', type: 'text', placeholder: 'Enter car’s VIN number', value: data.vin, error: errors.vin},
        email: { label: 'E-mail:', type: 'text', placeholder: 'John.smith@example.com', value: data.email, error: errors.email},
    }), [data, errors])

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>, name: keyof CompatibilityPayload) => {
        setData(prev => ({ ...prev, [name]: e.target.value }))
        setErrors(prev => ({ ...prev, [name]: null }))
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
                <div className="compatibility-check-dialog-unavailable compatibility-check-dialog-field-error">
                    Service temporary unavailable
                </div>
            </div>
            <div className="compatibility-check-dialog-fields">
                {Object.entries(fields).map(([name, { label, type, placeholder, value, error }]) => (
                    <div className="compatibility-check-dialog-field" key={name}>
                        <label htmlFor={`compatibility-${name}`}>{label}</label>
                        <input
                            id={`compatibility-${name}`}
                            {...{name, type, placeholder, value}}
                            onChange={(e) => handleInputChange(e, name as keyof CompatibilityPayload)}
                        />
                        {error && <div className="compatibility-check-dialog-field-error">Wrong input</div>}
                    </div>
                ))}
            </div>
            <div className="compatibility-check-dialog-submit">
                <button type="button" className="compatibility-check-dialog-button" onClick={handleSubmit}>
                    <span className="ready">Send Request</span>
                    <span className="loading">
                        <span>Loading</span>
                        <Icon className="loader" icon={loader} />
                    </span>
                </button>
                <div className="compatibility-check-dialog-agree">
                    <div className="compatibility-check-dialog-agree-checkbox-wrap">
                        <input type="checkbox" id="check-agree" className="compatibility-check-dialog-agree-checkbox" checked />
                    </div>
                    <label htmlFor="check-agree" className="compatibility-check-dialog-agree-label">I agree to receive Information emails from Screenmate</label>
                </div>
            </div>
        </PopupWrap>
    )
}

export default PowermateCompatibilityCheckPopup
