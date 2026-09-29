import React, { useRef, type ReactNode } from 'react'
import PopupWrap, { type PopupRefProps } from './PopupWrap'
import logo from '../../assets/images/popup-logo-white.svg'

interface SuccessPopupProps {
    open: boolean
    title?: ReactNode
    subtitle?: ReactNode
    onClose?: () => void
}

const SuccessPopup: React.FC<SuccessPopupProps> = ({
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
        <PopupWrap ref={wrap} id="success-popup" className="success-popup" open={open} onClose={handleCancel}>
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
