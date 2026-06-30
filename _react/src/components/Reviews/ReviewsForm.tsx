import React, { Fragment, useMemo, useState } from 'react'
import * as yup from 'yup'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { sendReview } from '../../redux/slices/reviews'
import type { ReviewPayload } from '../../types/review'
import Button from '../Common/Button'
import Popup from '../Common/Popup'
import Icon from '../Common/Icon'
import closeIcon from '@/assets/icons/close-white.svg'

import { mapSimpleConfigs, useAnime, type AnimatedObjectOptions } from '../../hooks/anime'

const reviewSchema = yup.object<Record<keyof ReviewPayload, typeof yup>>({
    shop_url: yup.string().required(),
    product_id: yup.number().required(),
    rating: yup.number().min(1, 'Please, choose the rate').max(5).required(),
    name: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email address').required('Email is required'),
    body: yup.string().required('Review is required'),
}).required()

const animatedObjects: Record<string, AnimatedObjectOptions> = {
    question: { yFrom: '40px', duration: 666 },
    button: { yFrom: '40px', duration: 666 },
}

type FormFieldTag = 'input' | 'textarea'

interface FormFieldParams {
    name: keyof ReviewPayload
    label: string
    type: string
    placeholder: string
    value: string
    component: FormFieldTag
    size?: string
}

type FormFieldEvent = React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>

interface FormFieldProps {
    as: FormFieldTag
    id: string
    name: string
    type: string
    placeholder: string
    value: string
    onChange: (e: FormFieldEvent) => void
}

const FormField: React.FC<FormFieldProps> = ({ as: Tag = 'input', ...params }) => <Tag {...params} />

const ReviewsForm: React.FC = () => {
    const dispatch = useAppDispatch();

    const { product } = useAppSelector(state => state.products)

    const [popupOpen, setPopupOpen] = useState<boolean>(false)
    const [data, setData] = useState<ReviewPayload>({
        rating: 0,
        name: '',
        email: '',
        body: ''
    })
    const [errors, setErrors] = useState<Record<keyof ReviewPayload, string | null>>({
        shop_url: null,
        id: null,
        rating: null,
        name: null,
        email: null,
        body: null
    })

    const params: FormFieldParams[] = [
        { name: 'name', label: 'Name', type: 'text', placeholder: 'Enter your name', value: data.name, component: 'input' },
        { name: 'email', label: 'Email', type: 'email', placeholder: 'john.smith@example.com', value: data.email, component: 'input' },
        { name: 'body', label: 'Review', type: 'text', placeholder: 'Write your comments here', value: data.body, component: 'textarea', size: 'full' },
    ]

    const handleInputChange = (e: FormFieldEvent) => {
        const { name, value } = e.target
        setData(prev => ({ ...prev, [name]: value }))
        setErrors(prev => ({ ...prev, [name]: null }))
    }

    const validateForm = async (formData: ReviewPayload) => {
        try {
            await reviewSchema.validate(formData, { abortEarly: false })
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
        const formData = { ...data, shop_url: window.location.host, id: product?.productId }
        const formValid = await validateForm(formData)
        if (formValid === true) {
            dispatch(sendReview(formData))
            setPopupOpen(false)
        }
    }

    const animationConfigs = useMemo(() => mapSimpleConfigs(animatedObjects), [])
        
    const { anime } = useAnime(animationConfigs)

    return (<>
        <div className="flex-between mob:flex-column-center mob:gap-20">
            <div {...anime('question')} className="font-manrope-52 mob:font-manrope-32 font-500 mob:text-center">Already own {product?.name}?</div>
            <Button {...anime('button')} className="flex-center" onClick={() => setPopupOpen(true)}>Write a review</Button>
        </div>
        <Popup open={popupOpen} onClose={() => setPopupOpen(false)}>
            <div className="reviews-form-wrap relative">
                <Icon className="reviews-form-close absolute cursor-pointer" icon={closeIcon} onClick={() => setPopupOpen(false)}/>
                <form className="reviews-form flex-column gap-24">
                    <div className="flex gap-24">
                        <div className="font-manrope-32 flex-1">Write a review</div>
                        <div className="reviews-form-rating flex-1 flex-start-center gap-8 relative">
                            <div className="font-manrope-16">Rate:</div>
                            <div className="flex gap-4" style={{ direction: 'rtl' }}>
                                {Array.from({ length: 5 }, (_, i) => 5 - i).map(index => (
                                    <Fragment key={index}>
                                        <input
                                            type="radio"
                                            style={{ display: 'none' }}
                                            id={`star-${index}`}
                                            name="rating"
                                            value={index}
                                            aria-label={`${index} of 5 stars`}
                                            onChange={handleInputChange}
                                        />
                                        <label htmlFor={`star-${index}`} />
                                    </Fragment>
                                ))}
                            </div>
                            {errors.rating && <div className="reviews-form-field-error">{errors.rating}</div>}
                        </div>
                    </div>
                    <div className="reviews-form-body">
                        {params.map(({ name, label, type, placeholder, value, size, component }, index) => (
                            <div className={`reviews-form-field ${size || ''} flex-column gap-8 relative`} key={index}>
                                <label htmlFor={name} className="font-manrope-16">{label}</label>
                                <FormField as={component} id={name} {...{name, type, placeholder, value}} onChange={handleInputChange} />
                                {errors[name] && <div className="reviews-form-field-error">{errors[name]}</div>}
                            </div>
                        ))}
                    </div>
                    <div className="flex-end-center">
                        <Button onClick={handleSubmit}>Send feedback</Button>
                    </div>
                </form>
            </div>
        </Popup>
        
    </>)
}

export default ReviewsForm
