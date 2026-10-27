import type { RefObject } from 'react'

export type SubscriptionPopupProcessData = Record<string, string | boolean> | null

export interface SubscriptionPopupsRefProps {
    handleProceed: (data: SubscriptionPopupProcessData) => void
}

export type SubscriptionPopupsProps = {
    ref: RefObject<SubscriptionPopupsRefProps>
}
