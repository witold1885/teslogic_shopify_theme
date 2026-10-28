import { useCallback, useImperativeHandle, type FC, type ReactNode } from 'react'
import './subscription-popup.scss'
import type { SubscriptionPopupsProps } from './types.ts'
import { getComponent } from '../../../layouts/components'
import { useAppDispatch } from '../../../redux/hooks.ts'
import { useDynamicSlice } from '../../../hooks/dynamic-slice.ts'

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
    ref, popupProcessData,
    subscriptionPopupOpen, setSubscriptionPopupOpen,
    selectionPopupOpen, setSelectionPopupOpen,
    successPopupOpen, setSuccessPopupOpen
}) => {
    const dispatch = useAppDispatch()

    const { resetError } = useDynamicSlice('subscribe', () => import('../../../redux/slices/subscribe'))
    
    const handleProceed = useCallback(() => {
        dispatch(resetError())
    }, [dispatch, resetError])

    useImperativeHandle(ref, () => ({ handleProceed }), [handleProceed])

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
