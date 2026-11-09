import type { FC } from 'react'
import { setSubscriptionCookie } from '../../../utils/cookies'

interface BlackFridayBannerProps {
    onConfirm?: () => void
    onClose?: () => void
}

const BlackFridayBanner: FC<BlackFridayBannerProps> = ({ onConfirm = () => {}, onClose = () => {} }) => {
    const handleCancel = () => {
        setSubscriptionCookie('bf26_vip_subscription', 0)
        onClose()
    }

    return (
        <div className="bf-banner">
            <div className="bf-banner-info">
                <div>Black Friday is coming!</div>
                <div>Want early access and our best deals? <br className="mobile" />Join our VIP list.</div>
            </div>
            <div className="bf-banner-buttons">
                <button onClick={onConfirm}>Get VIP Access</button>
                <button onClick={handleCancel}>No, thanks</button>
            </div>
        </div>
    )
}

export default BlackFridayBanner
