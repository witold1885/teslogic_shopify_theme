import React, { useState, useMemo } from 'react'
import * as yup from 'yup'
import type { PartnerPayload } from '../../types/partner'
import { Button } from '../Common'

interface PartnerField {
    key: keyof PartnerPayload
    label: string
    type: 'text' | 'tel' | 'email'
    placeholder: string
    value: string
    error: string | null
}

const partnerSchema = yup.object<Record<keyof PartnerPayload, typeof yup>>({
    name: yup.string().required('Fill in the field'),
    location: yup.string().required('Fill in the field'),
    primary_contact: yup.string().required('Fill in the field'),
    secondary_contact: yup.string()
}).required()

const PartnerForm: React.FC = () => {
    const [data, setData] = useState<PartnerPayload>({
        name: '',
        location: '',
        primary_contact: '',
        secondary_contact: '',
    })

    const [errors, setErrors] = useState<Record<keyof PartnerPayload, string | null>>({
        name: null,
        location: null,
        primary_contact: null,
        secondary_contact: null,
    })

    const fields: PartnerField[] = useMemo(() => [
        { key: 'name', label: 'Business Name', type: 'text', placeholder: 'Enter your name' },
        { key: 'location', label: 'City/Country', type: 'text', placeholder: 'Enter your City/Country' },
        { key: 'primary_contact', label: 'Website / Instagram / E-mail', type: 'text', placeholder: 'Enter your primary contact method' },
        { key: 'secondary_contact', label: 'Website / Instagram / E-mail', type: 'text', placeholder: 'Enter your secondary contact method' },
    ].map(({ key, type, ...field }) => ({
        ...field,
        key: key as keyof PartnerPayload,
        type: type as ('text' | 'tel' | 'email'),
        value: data[key as keyof PartnerPayload],
        error: errors[key as keyof PartnerPayload]
    })), [data, errors])

    const handleChange = (param: keyof PartnerPayload, value: string) => {
        setErrors(prev => ({ ...prev, [param]: null }))
        setData(prev => ({ ...prev, [param]: value }))
    }
    
    const validateForm = async (formData: PartnerPayload) => {
        try {
            await partnerSchema.validate(formData, { abortEarly: false })
            return true
        } catch (e: any) {
            setErrors({
                ...errors,
                ...e.inner.reduce((acc: any, error: any) => ({ ...acc, [error.params.path]: error.message }), {})
            })
            return false
        }
    }

    const handleSubmit = async () => {
        const formValid = await validateForm(data)
        if (formValid) {
            console.log({ data })
        }
    }

    return (
        <div className="partner-content-form">
            <div className="partner-content-form-caption">
                <h2>Ready to elevate <br />your shop?</h2>
                <p>
                    Submit your application today, <br />
                    and our partnership manager <br />
                    will contact you within 2 business days.
                </p>
            </div>
            <div className="partner-content-form-fields">
                {fields.map(({ key, label, type, placeholder, value, error }) => (
                    <div key={key} className="partner-content-form-field">
                        <label>{label}</label>
                        <input
                            className={`input ${error ? 'error' : ''}`}
                            {...{type, placeholder, value}}
                            onChange={(e) => handleChange(key, e.target.value)}
                        />
                    </div>
                ))}
                <Button onClick={handleSubmit}>APPLY NOW</Button>
            </div>
        </div>
    )
}

export default PartnerForm
