import React, { useEffect, type ReactNode } from 'react'
import { preconnect, preload } from 'react-dom'
import { getComponent } from './components'
import '@/assets/styles/common.scss'
import '@/assets/styles/cookies-banner.scss'
import '@/assets/styles/subscription-popup.scss'
import { useSubscriptionPopups } from '../hooks/subscription-popups'
import Header from '../components/Header/Header'
import LazySection from './LazySection'

const apiUrl: string | undefined = import.meta.env.VITE_API_URL

const Footer = getComponent(() => import('../components/Footer/Footer.tsx'))
const SubscriptionPopup = getComponent(() => import('../components/Popup/SubscriptionPopup.tsx'), true)
const SelectionPopup = getComponent(() => import('../components/Popup/SelectionPopup.tsx'), true)
const SuccessPopup = getComponent(() => import('../components/Popup/SuccessPopup.tsx'), true)

const fontModules: Record<string, any> = import.meta.glob('@/assets/fonts/Manrope/Manrope-{Regular,Medium,SemiBold,Bold}.woff2', { eager: true })
const fonts: string[] = Object.values(fontModules).map(mod => mod.default)

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

    if (typeof window !== 'undefined') {
        fonts.forEach(font => preload(font, { as: 'font' }))
    }

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
        <Header {...{theme, orderButton, onOrder}} />
        {children}
        <LazySection>
            <Footer onProceed={handleProceed} />
        </LazySection>
        {SubscriptionPopup && SelectionPopup && SuccessPopup && (
            <LazySection minHeight="0px">
                {subscriptionPopupOpen && (
                    <SubscriptionPopup
                        open={subscriptionPopupOpen}
                        onProceed={handleProceed}
                        onClose={() => setSubscriptionPopupOpen(false)}
                    />
                )}
                {selectionPopupOpen && (
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
                )}
                {successPopupOpen && (
                    <SuccessPopup
                        open={successPopupOpen}
                        subtitle={popupProcessData?.mode ? successPopupSubtitles[popupProcessData.mode as string] : ''}
                        onClose={() => setSuccessPopupOpen(false)}
                    />
                )}
            </LazySection>
        )}
    </>)

}

export default Layout
