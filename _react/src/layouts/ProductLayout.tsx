import React, { lazy, useEffect, useState, type ReactNode } from 'react'
import '@/assets/styles/common.scss'
import '@/assets/styles/cookies-banner.scss'
import '@/assets/styles/subscription-popup.scss'
import Cookies from 'js-cookie'
// import { EXTERNAL_SCRIPTS, useExternalScripts } from '../hooks/external-scripts'
import Header from '../components/Header/Header'
import LazySection from './LazySection'
import SubscriptionPopup from '../components/Popup/SubscriptionPopup'
import SuccessPopup from '../components/Popup/SuccessPopup'

const ssrComponents = import.meta.env.SSR
  ? import.meta.glob<any>('../components/**/*.tsx', { eager: true })
  : {}

const clientComponents = !import.meta.env.SSR
  ? import.meta.glob<any>('../components/**/*.tsx')
  : {}

function getComponent(relativePath: string) {
  if (import.meta.env.SSR) {
    const mod = ssrComponents[relativePath]
    return mod?.default || mod
  }

  return lazy(clientComponents[relativePath] as () => Promise<any>)
}

const Reviews = getComponent('../components/Reviews/Reviews.tsx')
const Footer = getComponent('../components/Footer/Footer.tsx')

interface ProductLayoutProps {
    className?: string
    onOrder?: () => void
    children?: ReactNode
}

const ProductLayout: React.FC<ProductLayoutProps> = ({ className, onOrder, children }) => {  
    // useExternalScripts(EXTERNAL_SCRIPTS)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (window.history && 'scrollRestoration' in window.history) {
                window.history.scrollRestoration = 'manual'
            }

            window.scrollTo(0, 0)
        }
    }, [])

    const [subscriptionPopupOpen, setSubscriptionPopupOpen] = useState<boolean>(false)
    const [successPopupOpen, setSuccessPopupOpen] = useState<boolean>(false)

    const discountSubscriptionCookies = Cookies.get('discount_subscription')

    useEffect(() => {
        if (!discountSubscriptionCookies) {
            setTimeout(() => setSubscriptionPopupOpen(true), 10000)
        }
    }, [discountSubscriptionCookies])

    return (<>
        <SubscriptionPopup
            open={subscriptionPopupOpen}
            onSuccess={() => {
                setSubscriptionPopupOpen(false)
                setSuccessPopupOpen(true)
            }}
            onClose={() => setSubscriptionPopupOpen(false)}
        />
        <SuccessPopup open={successPopupOpen} onClose={() => setSuccessPopupOpen(false)} />
        <Header onOrder={onOrder} />
        <div {...{className}}>
            {children}
            <LazySection>
                <Reviews />
            </LazySection>
        </div>
        <LazySection>
            <Footer />
        </LazySection>
    </>)
}

export default ProductLayout
