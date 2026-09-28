import React, { useRef } from 'react'
import PopupWrap, { type PopupRefProps } from './PopupWrap'
import logo from '../../assets/images/popup-logo-white.svg'

interface SuccessPopupProps {
    open: boolean
    onClose?: () => void
}

const SuccessPopup: React.FC<SuccessPopupProps> = ({ open, onClose = () => {} }) => {
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
                <div className="subscription-popup-title">
                    Thank you <br />for subscribing!
                </div>
                <div className="subscription-popup-subtitle">
                    Your discount has just <br className="mobile" />landed <br className="desktop" />in your inbox.
                </div>
            </div>
        </PopupWrap>
    )
}

export default SuccessPopup
