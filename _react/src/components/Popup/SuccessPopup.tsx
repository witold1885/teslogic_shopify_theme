import React from 'react'
import PopupWrap from './PopupWrap'
import logo from '../../assets/images/popup-logo-white.svg'

interface SuccessPopupProps {
    open: boolean
    onClose?: () => void
}

const SuccessPopup: React.FC<SuccessPopupProps> = ({ open, onClose = () => {} }) => (
    <PopupWrap id="success-popup" className="success-popup" {...{open, onClose}}>
        <div className="subscription-popup-logo">
            <img src={logo} alt="SCREENMATE" />
        </div>
        <div className="subscription-popup-info">
            <div className="subscription-popup-title">
                Thank you <br />for subscribing!
            </div>
            <div className="subscription-popup-subtitle">
                Your discount has justlanded <br />in your inbox.
            </div>
        </div>
    </PopupWrap>
)

export default SuccessPopup
