import { type FC, type ReactNode } from 'react'
import './subscription-popup.scss'
import { getComponent } from '../../../layouts/components'
import type { SubscriptionPopupsProps } from '../../../hooks/subscription-popups.ts'

const SubscriptionPopup = getComponent(() => import('./SubscriptionPopup.tsx'), true)
const SelectionPopup = getComponent(() => import('./SelectionPopup.tsx'), true)
const SuccessPopup = getComponent(() => import('./SuccessPopup.tsx'), true)

const background: ReactNode = (
    <video autoPlay muted loop className="subscription-popup-video">
        <source src="https://cdn.shopify.com/videos/c/o/v/63070f02784841769f7dac1f57ceb0dc.mp4" type="video/mp4" />
    </video>
)

const successPopupSubtitles: Record<string, ReactNode> = {
    discount: <>Your discount has just <br className="mobile" />landed <br className="desktop" />in your inbox.</>,
    custom: <>You are now subscribed <br />to our email newsletter.</>
}

const SubscriptionPopups: FC<SubscriptionPopupsProps> = ({
    popupProcessData, handleProceed,
    subscriptionPopupOpen, setSubscriptionPopupOpen,
    selectionPopupOpen, setSelectionPopupOpen,
    successPopupOpen, setSuccessPopupOpen
}: SubscriptionPopupsProps) => {
    return (<>
        {SubscriptionPopup && SelectionPopup && SuccessPopup && (<>
                {subscriptionPopupOpen && (
                    <SubscriptionPopup
                        background={background}
                        open={subscriptionPopupOpen}
                        onProceed={handleProceed}
                        onClose={() => setSubscriptionPopupOpen(false)}
                    />
                )}
                {selectionPopupOpen && (
                    <SelectionPopup
                        background={background}
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
                        background={background}
                        open={successPopupOpen}
                        subtitle={popupProcessData?.mode ? successPopupSubtitles[popupProcessData.mode as string] : ''}
                        onClose={() => setSuccessPopupOpen(false)}
                    />
                )}
        </>)}
    </>)
}

export default SubscriptionPopups
