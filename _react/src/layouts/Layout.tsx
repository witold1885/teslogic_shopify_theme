import { useState, useEffect, useCallback, type ReactNode , type FC } from 'react'
import { preconnect } from 'react-dom'
import Cookies from 'js-cookie'
import '@/assets/styles/common.scss'
import '@/assets/styles/cookies-banner.scss'
import { getComponent } from './components'
import LazySection from './LazySection'
import Header from '../components/Header/Header'
import type { SubscriptionPopupProcessData } from '../components/Popup/Subscription/types.ts'
import { useDynamicSlice } from '../hooks/dynamic-slice.ts'
import { useAppDispatch } from '../redux/hooks.ts'

const Footer = getComponent(() => import('../components/Footer/Footer.tsx'))
const SubscriptionPopups = getComponent(() => import('../components/Popup/Subscription/SubscriptionPopups.tsx'), true)

const apiUrl: string | undefined = import.meta.env.VITE_API_URL

// const fontModules: Record<string, any> = import.meta.glob('@/assets/fonts/Manrope/Manrope-{Regular,Medium,SemiBold,Bold}.woff2', { eager: true })
// const fonts: string[] = Object.values(fontModules).map(mod => mod.default)

export interface LayoutProps {
    theme?: 'dark' | 'light'
    className?: string
    orderButton?: boolean
    onOrder?: () => void
    children?: ReactNode
}

const Layout: FC<LayoutProps> = ({ theme = 'dark', orderButton = true, onOrder = () => {}, children }) => {
    // useExternalScripts(EXTERNAL_SCRIPTS)
    if (apiUrl) preconnect(apiUrl)

    // if (typeof window !== 'undefined') {
    //     fonts.forEach(font => preload(font, { as: 'font' }))
    // }

    const dispatch = useAppDispatch()

    const { resetError } = useDynamicSlice('subscribe', () => import('../redux/slices/subscribe'))
    

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (window.history && 'scrollRestoration' in window.history) {
                window.history.scrollRestoration = 'manual'
            }

            window.scrollTo(0, 0)
        }
    }, [])

    const [popupProcessData, setPopupProcessData] = useState<SubscriptionPopupProcessData>(null)
    const [subscriptionPopupOpen, setSubscriptionPopupOpen] = useState<boolean>(false)
    const [selectionPopupOpen, setSelectionPopupOpen] = useState<boolean>(false)
    const [successPopupOpen, setSuccessPopupOpen] = useState<boolean>(false)

    const discountSubscriptionCookies = Cookies.get('discount_subscription')

    useEffect(() => {
        if (!discountSubscriptionCookies) {
            setTimeout(() => setSubscriptionPopupOpen(true), 10000)
        }
    }, [discountSubscriptionCookies])

    const handleProceed = useCallback((data: SubscriptionPopupProcessData) => {
        setPopupProcessData(data)
        setSubscriptionPopupOpen(false)
        setSelectionPopupOpen(true)
        dispatch(resetError())
    }, [dispatch, resetError])

    return (<>
        {SubscriptionPopups && (subscriptionPopupOpen || selectionPopupOpen || successPopupOpen) && (
            <LazySection minHeight="0px" forceRender={true}>
                <SubscriptionPopups {...{
                    popupProcessData, handleProceed, 
                    subscriptionPopupOpen, setSubscriptionPopupOpen, 
                    selectionPopupOpen, setSelectionPopupOpen, 
                    successPopupOpen, setSuccessPopupOpen        
                }}/>
            </LazySection>
        )}
        <Header {...{apiUrl, theme, orderButton, onOrder}} />
        {children}
        <LazySection>
            <Footer onProceed={handleProceed} />
        </LazySection>
    </>)

}

export default Layout
