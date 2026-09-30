import React, { useState, useMemo, Fragment, type ReactNode } from 'react'
import '../assets/styles/partner.scss'
import * as yup from 'yup'
import type { PartnerPayload } from '../types/partner'
import { mountForShopify } from './mount'
import InfoLayout from '../layouts/InfoLayout'
import { Button } from '../components/Common'

interface PartnerSection {
    title: string
    subtitle?: string
    list: PartnerSectionListProps
}

interface PartnerSectionListProps {
    tag: keyof HTMLElementTagNameMap
    items: ReactNode[]
}

const PartnerSectionList: React.FC<PartnerSectionListProps> = ({ tag: Tag, items }) => (
    <Tag>{items.map((item, i) => <li key={i}>{item}</li>)}</Tag>
)

const sections: PartnerSection[] = [
    {
        title: 'Why Partner with Screenmate?',
        list: {
            tag: 'ul',
            items: [
                <><b>Targeted Lead Generation:</b> We drive Tesla owners in your region directly to your shop via our "Where to Install" locator.</>,
                <><b>Premium Product:</b> Offer your clients the most advanced screen rotation and dashboard solutions for Tesla Model 3/Y and Highland.</>,
                <><b>Technical Support:</b> Gain access to exclusive step-by-step installation manuals, video tutorials, and direct engineering support.</>,
                <><b>Marketing Toolkit:</b> Receive high-quality photo and video assets to promote Screenmate on your social media channels.</>,
                <><b>Exclusive Wholesale Pricing:</b> Benefit from competitive B2B margins and priority shipping on all hardware.</>,
            ]
        }
    },
    {
        title: 'Who We Are Looking For',
        subtitle: 'To maintain our high standards of quality, we partner with studios that meet the following criteria:',
        list: {
            tag: 'ol',
            items: [
                <><b>Tesla Expertise:</b> Proven experience in EV interior disassembly and electronic installations.</>,
                <><b>Professional Facility:</b> A clean, well-lit workspace capable of handling premium vehicles.</>,
                <><b>Customer Excellence:</b> A strong reputation for quality work and positive customer reviews.</>,
                <><b>Brand Alignment:</b> Commitment to following Screenmate installation protocols to ensure hardware longevity.</>,
            ]
        }
    },
    {
        title: 'The Onboarding Process',
        list: {
            tag: 'ol',
            items: [
                <><b>Application:</b> Fill out the partner form below with your business details.</>,
                <><b>Verification:</b> Our team will review your application and portfolio (website/social media).</>,
                <><b>Training & First Order:</b> Access our technical documentation and place your initial stock order at partner rates.</>,
                <><b>Go Live:</b> Your business is added to our global interactive map, and you start receiving installation requests.</>,
            ]
        }
    }
]

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
    phone: yup.string().required('Fill in the field'),
    website: yup.string().required('Fill in the field')
}).required()

const Partner: React.FC = () => {
    const [data, setData] = useState<PartnerPayload>({
        name: '',
        location: '',
        phone: '',
        website: '',
    })
    const [errors, setErrors] = useState<Record<keyof PartnerPayload, string | null>>({
        name: null,
        location: null,
        phone: null,
        website: null,
    })

    const fields: PartnerField[] = useMemo(() => [
        { key: 'name', label: 'Business Name', type: 'text', placeholder: 'Enter your name' },
        { key: 'location', label: 'City/Country', type: 'text', placeholder: 'Enter your location' },
        { key: 'phone', label: 'Phone', type: 'tel', placeholder: '+1 (123) 456-7890' },
        { key: 'website', label: 'Website/Instagram', type: 'text', placeholder: 'www.example.com' },
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
            
        }
    }

    return (
        <InfoLayout className="partner">
            <div className="partner-wrap">
                <div className="partner-head">
                    <h1>Become an Authorized <br />Screenmate Partner</h1>
                    <p>Expand your business by joining the elite network <br />of installers transforming the Tesla driving experience.</p>
                </div>
                <div className="partner-content">
                    {sections.map(({ title, subtitle, list: { tag, items } }, index) => (
                        <Fragment key={index}>
                            <div className="partner-content-list" key={index}>
                                <h2>{title}</h2>
                                <div className="partner-content-list-body">
                                    {subtitle && <p>{subtitle}</p>}
                                    <PartnerSectionList {...{tag, items}} />
                                </div>
                            </div>
                            <div className="partner-content-delimiter" />
                        </Fragment>
                    ))}
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
                </div>
            </div>
        </InfoLayout>
    )
}

mountForShopify('react-partner-root', Partner)

export default Partner
