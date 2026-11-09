import type { FC } from 'react'

interface BlackFridayBannerProps {
    onConfirm?: () => void
    onClose?: () => void
}

const BlackFridayBanner: FC<BlackFridayBannerProps> = ({ onConfirm = () => {}, onClose = () => {} }) => {
    return (
        <div className="bf-banner">
            <div className="bf-banner-info">
                <div>Black Friday is coming!</div>
                <div>Want early access and our best deals? <br className="mobile" />Join our VIP list.</div>
            </div>
            <div className="bf-banner-buttons">
                <button onClick={onConfirm}>Get VIP Access</button>
                <button onClick={onClose}>No, thanks</button>
            </div>
        </div>
    )
}

export default BlackFridayBanner
