import { useState, useEffect } from 'react'
import Cookies from 'js-cookie'

export const useSubscriptionPopups = () => {
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

    return {
        popupProcessData, handleProceed, 
        subscriptionPopupOpen, setSubscriptionPopupOpen, 
        selectionPopupOpen, setSelectionPopupOpen, 
        successPopupOpen, setSuccessPopupOpen        
    }
}
