import { useState, useEffect, useRef, type ReactNode, type FC } from 'react'
import type { SubscriptionPopupProcessData, SubscriptionPopupsRefProps } from '../components/Popup/Subscription/types.ts'
import Cookies from 'js-cookie'
import '@/assets/styles/common.scss'
import '@/assets/styles/cookies-banner.scss'
import { getComponent } from './components'
import LazySection from './LazySection'
import Header from '../components/Header/Header'

const Footer = getComponent(() => import('../components/Footer/Footer.tsx'))
const SubscriptionPopups = getComponent(() => import('../components/Popup/Subscription/SubscriptionPopups.tsx'), true)
const BlackFridayPopups = getComponent(() => import('../components/Popup/BlackFriday/BlackFridayPopups.tsx'), true)

export interface LayoutProps {
    theme?: 'dark' | 'light'
    className?: string
    orderButton?: boolean
    onOrder?: () => void
    children?: ReactNode
}

const Layout: FC<LayoutProps> = ({ theme = 'dark', orderButton = true, onOrder = () => {}, children }) => {
    // useExternalScripts(EXTERNAL_SCRIPTS)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (window.history && 'scrollRestoration' in window.history) {
                window.history.scrollRestoration = 'manual'
            }

            window.scrollTo(0, 0)
        }
    }, [])

    const [showCookiesBanner, setShowCookiesBanner] = useState<boolean>(false)

    const [popupProcessData, setPopupProcessData] = useState<SubscriptionPopupProcessData>(null)
    const [subscriptionPopupDiscount, setSubscriptionPopupDiscount] = useState<boolean>(true)
    const [subscriptionPopupOpen, setSubscriptionPopupOpen] = useState<boolean>(false)
    const [selectionPopupOpen, setSelectionPopupOpen] = useState<boolean>(false)
    const [successPopupOpen, setSuccessPopupOpen] = useState<boolean>(false)

    const [blackFridayBannerOpen, setBlackFridayBannerOpen] = useState<boolean>(false)
    const [blackFridayPopupOpen, setBlackFridayPopupOpen] = useState<boolean>(false)
    const [blackFridaySuccessOpen, setBlackFridaySuccessOpen] = useState<boolean>(false)

    useEffect(() => {
        let intersectionObserver: IntersectionObserver | null = null

        const observeBanner = () => {
            const cookiesBanner = document.querySelector('#shopify-pc__banner')

            if (!cookiesBanner) {
                setShowCookiesBanner(false)
                return
            }

            intersectionObserver?.disconnect()

            intersectionObserver = new IntersectionObserver(([entry]) => {
                setShowCookiesBanner(entry.isIntersecting)
            })

            intersectionObserver.observe(cookiesBanner)
        }

        observeBanner()

        const mutationObserver = new MutationObserver(() => {
            observeBanner()
        })

        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true,
        })

        return () => {
            intersectionObserver?.disconnect()
            mutationObserver.disconnect()
        }
    }, [])

    // const discountSubscriptionCookies: string | undefined = Cookies.get('discount_subscription')
    const blackFridaySubscriptionCookies: string | undefined = Cookies.get('bf26_vip_subscription')
    const customSubscriptionCookies: string | undefined = Cookies.get('custom_subscription')

    useEffect(() => {
        const urlSearchParams: URLSearchParams | null = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
        const source: string | null = urlSearchParams?.get('utm_source') || null
        const subscribe: string | null = urlSearchParams?.get('subscribe') || null

        const fromBloggers: boolean = source === 'leaddyno' || source === 'fb' || source === 'ig'

        if (subscribe === 'blackfriday') {
            setBlackFridayPopupOpen(true)
        }

        if (
            showCookiesBanner || 
            /*discountSubscriptionCookies || */
            blackFridaySubscriptionCookies || 
            fromBloggers || 
            subscribe !== null
        ) {
            // setSubscriptionPopupOpen(false)
            setBlackFridayBannerOpen(false)
            return
        }

        const timeout = setTimeout(() => {
            // setSubscriptionPopupOpen(true)
            setBlackFridayBannerOpen(true)
        }, 10000)

        return () => {
            clearTimeout(timeout)
        }
    }, [showCookiesBanner, /*discountSubscriptionCookies, */blackFridaySubscriptionCookies, customSubscriptionCookies])

    useEffect(() => {
        const urlSearchParams: URLSearchParams | null = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null
        const source: string | null = urlSearchParams?.get('utm_source') || null

        const fromBloggers: boolean = source === 'leaddyno' || source === 'fb' || source === 'ig'

        if (
            subscriptionPopupOpen || selectionPopupOpen || successPopupOpen || 
            blackFridayBannerOpen || blackFridayPopupOpen || blackFridaySuccessOpen || 
            !fromBloggers
        ) {
            return
        }

        const timeout = setTimeout(() => {
            setSubscriptionPopupDiscount(false)
            setSubscriptionPopupOpen(true)
        }, 30000)

        return () => {
            clearTimeout(timeout)
        }
    }, [
        subscriptionPopupOpen, selectionPopupOpen, successPopupOpen, 
        blackFridayBannerOpen, blackFridayPopupOpen, blackFridaySuccessOpen, 
    ])

    const popupsRef = useRef<SubscriptionPopupsRefProps>(null)

    const handleProceed = (data: SubscriptionPopupProcessData) => {
        setPopupProcessData(data)
        setSubscriptionPopupOpen(false)
        setSelectionPopupOpen(true)
        popupsRef?.current?.handleProceed(data)
    }

    return (<>
        {SubscriptionPopups && (subscriptionPopupOpen || selectionPopupOpen || successPopupOpen) && (
            <LazySection minHeight="0px" forceRender={true}>
                <SubscriptionPopups ref={popupsRef} {...{
                    popupProcessData, subscriptionPopupDiscount, 
                    subscriptionPopupOpen, setSubscriptionPopupOpen, 
                    selectionPopupOpen, setSelectionPopupOpen, 
                    successPopupOpen, setSuccessPopupOpen
                }} />
            </LazySection>
        )}
        {BlackFridayPopups && (
            <LazySection minHeight="0px" forceRender={true}>
                <BlackFridayPopups {...{
                    blackFridayBannerOpen, setBlackFridayBannerOpen, 
                    blackFridayPopupOpen, setBlackFridayPopupOpen, 
                    blackFridaySuccessOpen, setBlackFridaySuccessOpen
                }} />
            </LazySection>
        )}
        <Header {...{theme, orderButton, onOrder}} />
        {children}
        <LazySection>
            <Footer onProceed={handleProceed} />
        </LazySection>
    </>)

}

export default Layout
