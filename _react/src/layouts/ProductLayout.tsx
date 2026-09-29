import React, { lazy, useState, useEffect, type ReactNode } from 'react'
import '@/assets/styles/common.scss'
import '@/assets/styles/cookies-banner.scss'
import '@/assets/styles/subscription-popup.scss'
import Cookies from 'js-cookie'
// import { EXTERNAL_SCRIPTS, useExternalScripts } from '../hooks/external-scripts'
import Header from '../components/Header/Header'
import LazySection from './LazySection'
import SubscriptionPopup from '../components/Popup/SubscriptionPopup'
import SelectionPopup from '../components/Popup/SelectionPopup'
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

const successPopupSubtitles: Record<string, ReactNode> = {
    discount: <>Your discount has just <br className="mobile" />landed <br className="desktop" />in your inbox.</>,
    custom: <>You are now subscribed <br />to our email newsletter.</>
}

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

    const [popupProcessData, setPopupProcessData] = useState<Record<string, string | boolean> | null>(null)
    const [subscriptionPopupOpen, setSubscriptionPopupOpen] = useState<boolean>(false)
    const [selectionPopupOpen, setSelectionPopupOpen] = useState<boolean>(false)
    const [successPopupOpen, setSuccessPopupOpen] = useState<boolean>(false)

    const discountSubscriptionCookies = Cookies.get('discount_subscription')

    useEffect(() => {
        if (!discountSubscriptionCookies) {
            setTimeout(() => setSubscriptionPopupOpen(true), 10000)
        }
    }, [discountSubscriptionCookies])

    const handleProceed = (data: Record<string, string | boolean> | null) => {
        setPopupProcessData(data)
        setSubscriptionPopupOpen(false)
        setSelectionPopupOpen(true)
    }

    return (<>
        <SubscriptionPopup
            open={subscriptionPopupOpen}
            onProceed={handleProceed}
            onClose={() => setSubscriptionPopupOpen(false)}
        />
        <SelectionPopup
            open={selectionPopupOpen}
            popupProcessData={popupProcessData}
            onSuccess={() => {
                setSelectionPopupOpen(false)
                setSuccessPopupOpen(true)
            }}
            onError={() => {
                setSelectionPopupOpen(false)
                popupProcessData?.mode === 'discount' && setSubscriptionPopupOpen(true)
            }}
        />
        <SuccessPopup
            open={successPopupOpen}
            subtitle={popupProcessData?.mode ? successPopupSubtitles[popupProcessData.mode as string] : ''}
            onClose={() => setSuccessPopupOpen(false)}
        />
        <Header onOrder={onOrder} />
        <div {...{className}}>
            {children}
            <LazySection>
                <Reviews />
            </LazySection>
        </div>
        <LazySection>
            <Footer onProceed={handleProceed} />
        </LazySection>
    </>)
}

export default ProductLayout
