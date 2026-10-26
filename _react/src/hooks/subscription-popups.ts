import { useState, useEffect, useCallback } from 'react'
import Cookies from 'js-cookie'
import { useAppDispatch } from '../redux/hooks'
import { useDynamicSlice } from './dynamic-slice'

type SubscriptionPopupProcessData = Record<string, string | boolean> | null

export type SubscriptionPopupsProps = {
    popupProcessData: SubscriptionPopupProcessData
    handleProceed: (data: SubscriptionPopupProcessData) => void
    subscriptionPopupOpen: boolean
    setSubscriptionPopupOpen: (state: boolean) => void
    selectionPopupOpen: boolean
    setSelectionPopupOpen: (state: boolean) => void
    successPopupOpen: boolean
    setSuccessPopupOpen: (state: boolean) => void
}

export const useSubscriptionPopups = () => {
    const dispatch = useAppDispatch()

    const { resetError } = useDynamicSlice('subscribe', () => import('../redux/slices/subscribe'))

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

    return {
        popupProcessData, handleProceed, 
        subscriptionPopupOpen, setSubscriptionPopupOpen, 
        selectionPopupOpen, setSelectionPopupOpen, 
        successPopupOpen, setSuccessPopupOpen        
    }
}
