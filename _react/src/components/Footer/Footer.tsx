import React, { useState, useEffect, useMemo } from 'react'
import * as yup from 'yup'
import './footer.scss'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { customSubscribe } from '../../redux/slices/subscribe'
import type { MenuItem } from '../../types/shopify'
import { Button, Icon, Image } from '../Common'
import logoDesktop from '../../assets/images/logo-footer-desktop.svg'
import logoMobile from '../../assets/images/logo-footer-mobile.svg'
import appStoreDesktop from '../../assets/images/app-store-desktop.svg'
import appStoreMobile from '../../assets/images/app-store-mobile.svg'
import googlePlayDesktop from '../../assets/images/google-play-desktop.svg'
import googlePlayMobile from '../../assets/images/google-play-mobile.svg'
import type { SubscribePayload } from '../../types/subscribe'

import { getAnimationConfig, mapSimpleConfigs, useAnime, type AnimatedObjectOptions, type AnimationConfig } from '../../hooks/anime'
import { useInlineStyles } from '../../hooks/inline-styles'

const animatedObjects: Record<string, AnimatedObjectOptions> = {
    form: { yFrom: '40px', duration: 666 },
    logo: { yFrom: '20px', duration: 333 },
    stores: { yFrom: '20px', duration: 333 },
    text: { yFrom: '20px', duration: 333 },
    payments: { yFrom: '20px', duration: 333 },
    copyright: { yFrom: '20px', duration: 333 },
}

const subscribeSchema = yup.object<Record<keyof SubscribePayload, typeof yup>>({
    email: yup.string().email('Email not valid').required('Fill in the field')
}).required()

const paymentIconModules: Record<string, any> = import.meta.glob('@/assets/icons/payment-icons/*.svg', { eager: true })
const paymentIcons: string[] = Object.values(paymentIconModules).map(mod => mod.default)

const FooterMenuGroup: React.FC<{ group?: MenuItem[] }> = ({ group }) => {
    const animationConfigs = useMemo(() => group?.reduce<Record<string, AnimationConfig>>((acc, _, index) => ({
        ...acc, [`group_${index}`]: getAnimationConfig('20px', 333)
    }), {}), [])
    
    const { anime } = useAnime(animationConfigs)

    return (<>
        {group?.map(({ title, children }, index) => (
            <div
                {...anime(`group_${index}`)}
                className={`${title ? `footer-${(title as string).replace(' ', '-').toLowerCase()}` : ''} flex-column gap-16`}
                key={index}
            >
                <div className="font-manrope-24 mob:font-manrope-18 font-500">{title}</div>
                <div className="flex-column gap-10">
                    {children?.map((child, i) => (
                        <div key={i}>
                            <a href={child.url} target="_blank">{child.title}</a>
                        </div>
                    ))}
                </div>
            </div>
        ))}
    </>)
}

const forCustomersBlockTitle: string = 'For customers'
const contactUsItemTitle: string = 'Contact us'

const getMenu = (main_menu: MenuItem[] | undefined, forCustomersBlock: MenuItem | null, contactUsItem: MenuItem | null) => {
    return main_menu ? {
        top: main_menu.filter(({ title }) => title !== forCustomersBlockTitle && title !== 'Buy Now'),
        bottom: [
            { title: 'Contacts', url: '#', children: [
                contactUsItem,
                { title: 'info@screenmate.co', url: 'mailto:info@screenmate.co' }
            ]},
            forCustomersBlock,
            { title: 'Social', url: '#', children: [
                { title: 'Instagram', url: 'https://www.instagram.com/screenmate.co' },
                { title: 'Facebook', url: 'https://www.facebook.com/screenmate.co' },
                { title: 'YouTube', url: 'https://www.youtube.com/@screenmatefortesla' },
                { title: 'Discord', url: 'https://discord.gg/D8K8n94gkn' }
            ]},
            { title: 'Legal', url: '#', children: [
                { title: 'Privacy Policy', url: '/privacy' },
                { title: 'Terms of Use', url: '/terms' }
            ]}
        ].filter(Boolean)
    } : {}
}

const getStores = (isMobile: boolean) => {
    return [
        {
            url: 'https://apps.apple.com/am/app/teslogic-dash/id1623563438',
            image: !isMobile ? appStoreDesktop : appStoreMobile,
            alt: 'AppStore'
        },
        {
            url: 'https://play.google.com/store/apps/details?id=co.teslogic.teslogic_dash',
            image: !isMobile ? googlePlayDesktop : googlePlayMobile,
            alt: 'GooglePlay'
        }
    ]
}

const Footer: React.FC = () => {
    const { isMobile } = useInlineStyles()

    const dispatch = useAppDispatch()

    const [data, setData] = useState<Record<keyof SubscribePayload, string>>({
        email: ''
    })

    const [errors, setErrors] = useState<Record<keyof SubscribePayload, string | null>>({
        email: null
    })

    const { error: apiError } = useAppSelector(state => state.subscribe)
    const { main_menu } = useAppSelector(state => state.content)

    const forCustomersBlock: MenuItem | null = useMemo(() => {
        if (main_menu) {
            const { title, url, children } = main_menu.find(({ title }) => title === forCustomersBlockTitle) || {}
            return { title, url, children: children?.filter(({ title }) => title !== contactUsItemTitle) }
        }
        return null
    }, [main_menu])

    const contactUsItem: MenuItem | null = useMemo(() => {
        return main_menu?.find(({ title }) => title === forCustomersBlockTitle)?.children?.find(({ title }) => title === contactUsItemTitle) || null
    }, [main_menu])

    const menu = useMemo(() => getMenu(main_menu, forCustomersBlock, contactUsItem), [main_menu, forCustomersBlock, contactUsItem])        

    const stores = useMemo(() => getStores(isMobile), [isMobile])
    
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setData(prev => ({ ...prev, [name]: value }))
        setErrors(prev => ({ ...prev, [name]: null }))
    }

    const validateForm = async (formData: SubscribePayload) => {
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
            setErrors({
                email: apiError === 'email_exists' 
                    ? 'This email is already registered' 
                    : 'An error occurred, try again'
            })
        }
    }, [apiError])

    const handleSubscribe = async () => {
        const formValid = await validateForm(data)
        if (formValid === true) {
            dispatch(customSubscribe(data))
        }
    }

    const animationConfigs = useMemo(() => mapSimpleConfigs(animatedObjects), [])
    
    const { anime } = useAnime(animationConfigs)

    return (
        <footer className="footer">
            <div className="container">
                <div {...anime('form')} className="footer-form">
                    <div>
                        <div className="footer-form-title">Sign Up for Our Newsletter</div>
                        <div className="footer-form-subtitle">Stay informed about sales, updates and new products launches.</div>
                    </div>
                    <div>
                        <div className="footer-form-field">
                            <input name="email" type="email" placeholder="Enter your email adress" value={data.email} onChange={handleInputChange} />
                            {errors.email && <span className="footer-form-field-error">{errors.email}</span>}
                        </div>
                        <Button onClick={handleSubscribe}><span>Subscribe</span></Button>
                    </div>
                </div>
                <div className="footer-delimiter"></div>
                <div className="footer-grid">
                    <Image {...anime('logo')} className="footer-logo" src={!isMobile ? logoDesktop : logoMobile} alt="Screenmate" />
                    <FooterMenuGroup group={menu?.top as MenuItem[]} />
                    <div {...anime('stores')} className="footer-stores">
                        {stores.map(({ url, image, alt }, index) => (
                            <a href={url} target="_blank" key={index}>
                                <Image className="h-full" src={image} alt={alt} />
                            </a>
                        ))}
                    </div>
                    <FooterMenuGroup group={menu?.bottom as MenuItem[]} />
                </div>
                <div className="footer-delimiter"></div>
                <div className="footer-bottom">
                    <div {...anime('text')}>
                        <div>
                            Tesla, Model 3, Model Y, Model S, Model X are trademarks or registered trademarks of their respective <br />
                            holders. Any references to these trademarks do not imply any affiliation or endorsement.
                        </div>
                        <div>SCREENMATE™ is a registered trademark.</div>
                    </div>
                    <div>
                        <div {...anime('payments')} className="footer-bottom-payments">
                            {Object.values(paymentIcons).map((icon, index) => (
                                <Icon className="flex-center" icon={icon as unknown as string} key={index} />
                            ))}
                        </div>
                        <div {...anime('copyright')} className="text-white">© {new Date().getFullYear()} Screenmate</div>
                    </div>
                </div>
            </div>
        </footer>
    )
}

export default Footer
