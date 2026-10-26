import { useState, useEffect, useCallback } from 'react'
import Cookies from 'js-cookie'
import { useAppDispatch } from '../redux/hooks'
import { useDynamicSlice } from './dynamic-slice'

export const useSubscriptionPopups = () => {
    const dispatch = useAppDispatch()

    const { resetError } = useDynamicSlice('subscribe', () => import('../redux/slices/subscribe'))

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

    const handleProceed = useCallback((data: Record<string, string | boolean> | null) => {
        setPopupProcessData(data)
        setSubscriptionPopupOpen(false)
        setSelectionPopupOpen(true)
        dispatch(resetError())
    }, [dispatch, resetError])

    return {
        popupProcessData, handleProceed, 
        subscriptionPopupOpen, setSubscriptionPopupOpen, 
        selectionPopupOpen, setSelectionPopupOpen, 
        successPopupOpen, setSuccessPopupOpen        
    }
}
