import { useRef, type ReactNode, type FC } from 'react'
import PopupWrap, { type PopupRefProps } from './PopupWrap'
import logo from '../../assets/images/popup-logo-white.svg'

interface SuccessPopupProps {
    open: boolean
    title?: ReactNode
    subtitle?: ReactNode
    onClose?: () => void
}

const SuccessPopup: FC<SuccessPopupProps> = ({
    open,
    title = <>Thank you <br />for subscribing!</>,
    subtitle = '',
    onClose = () => {}
}) => {
    const wrap = useRef<PopupRefProps>(null)

    const handleCancel = () => {
        wrap?.current?.close(() => onClose())
    }

    return (
        <PopupWrap
            ref={wrap}
            id="success-popup"
            className="success-popup"
            backgroundType='video'
            background="https://cdn.shopify.com/videos/c/o/v/63070f02784841769f7dac1f57ceb0dc.mp4"
            open={open}
            onClose={handleCancel}
        >
            <div className="subscription-popup-logo">
                <img src={logo} alt="SCREENMATE" />
            </div>
            <div className="subscription-popup-info">
                <div className="subscription-popup-title">{title}</div>
                <div className="subscription-popup-subtitle">{subtitle}</div>
            </div>
        </PopupWrap>
    )
}

export default SuccessPopup
