import type { RefObject } from 'react'

export type SubscriptionPopupProcessData = Record<string, string | boolean> | null

export interface SubscriptionPopupsRefProps {
    handleProceed: (data: SubscriptionPopupProcessData) => void
}

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
