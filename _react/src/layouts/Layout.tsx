import React, { useEffect, type ReactNode } from 'react'
import { preconnect } from 'react-dom'
import { getComponent } from './components'
import '@/assets/styles/common.scss'
import '@/assets/styles/cookies-banner.scss'
import '@/assets/styles/subscription-popup.scss'
import { useSubscriptionPopups } from '../hooks/subscription-popups'
import Header from '../components/Header/Header'
import LazySection from './LazySection'

const apiUrl: string | undefined = import.meta.env.VITE_API_URL

const Footer = getComponent(() => import('../components/Footer/Footer.tsx'))
const SubscriptionPopup = getComponent(() => import('../components/Popup/SubscriptionPopup.tsx'))
const SelectionPopup = getComponent(() => import('../components/Popup/SelectionPopup.tsx'))
const SuccessPopup = getComponent(() => import('../components/Popup/SuccessPopup.tsx'))

const successPopupSubtitles: Record<string, ReactNode> = {
    discount: <>Your discount has just <br className="mobile" />landed <br className="desktop" />in your inbox.</>,
    custom: <>You are now subscribed <br />to our email newsletter.</>
}

export interface LayoutProps {
    theme?: 'dark' | 'light'
    className?: string
    orderButton?: boolean
    onOrder?: () => void
    children?: ReactNode
}

const Layout: React.FC<LayoutProps> = ({ theme = 'dark', orderButton = true, onOrder = () => {}, children }) => {
    // useExternalScripts(EXTERNAL_SCRIPTS)
    if (apiUrl) preconnect(apiUrl)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (window.history && 'scrollRestoration' in window.history) {
                window.history.scrollRestoration = 'manual'
            }

            window.scrollTo(0, 0)
        }
    }, [])

    const {
        popupProcessData, handleProceed, 
        subscriptionPopupOpen, setSubscriptionPopupOpen, 
        selectionPopupOpen, setSelectionPopupOpen, 
        successPopupOpen, setSuccessPopupOpen      
    } = useSubscriptionPopups()

    return (<>
        <LazySection>
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
        </LazySection>
        <Header {...{theme, orderButton, onOrder}} />
        {children}
        <LazySection>
            <Footer onProceed={handleProceed} />
        </LazySection>
    </>)

}

export default Layout
