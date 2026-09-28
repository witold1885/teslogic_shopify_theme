import React, { useState, useEffect } from 'react'
import '@/assets/styles/subscription-popup.scss'
import Cookies from 'js-cookie'
import SubscriptionPopup from '../components/Popup/SubscriptionPopup'
import SelectionPopup from '../components/Popup/SelectionPopup'
import SuccessPopup from '../components/Popup/SuccessPopup'

const Popups: React.FC = () => {
    const [popupProcessData, setPopupProcessData] = useState<Record<string, string> | null>(null)
    const [subscriptionPopupOpen, setSubscriptionPopupOpen] = useState<boolean>(false)
    const [selectionPopupOpen, setSelectionPopupOpen] = useState<boolean>(false)
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
            onProceed={(data: Record<string, string> | null) => {
                setPopupProcessData(data)
                setSubscriptionPopupOpen(false)
                setSelectionPopupOpen(true)
            }}
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
                setSubscriptionPopupOpen(true)
            }}
        />
        <SuccessPopup
            open={successPopupOpen}
            onClose={() => setSuccessPopupOpen(false)}
        />
    </>)
}

export default Popups
