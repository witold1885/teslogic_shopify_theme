import { useRef, type FC } from 'react'
import PopupWrap, { type PopupRefProps } from '../PopupWrap'
import Icon from '../../Common/Icon'
import warning from '../../../assets/icons/powermate/info/pro_info_warning.svg'

interface PopupProps {
    open: boolean
    onClose: () => void
    onCheck: () => void
    onConfirm: () => void
}

const PowermateCompatibilityWarningPopup: FC<PopupProps> = ({ open, onClose, onCheck, onConfirm }) => {
    const wrap = useRef<PopupRefProps>(null)

    return (
        <PopupWrap
            ref={wrap}
            className="order-dialog"
            backgroundType="color"
            background="#171717"
            open={open}
            onClose={onClose}
        >
            <div className="order-dialog-title">
                <Icon className="order-dialog-title-icon" icon={warning} />
                <div className="order-dialog-title-text">Check Compatibility</div>
            </div>
            <div className="order-dialog-texts">
                <div>The Performance version is compatible <br />with a limited range of vehicles</div>
                <div>To check the compatibility of your Tesla, <br />please provide the VIN number of your vehicle.</div>
            </div>
            <div className="order-dialog-buttons">
                <button type="button" className="order-dialog-button order-dialog-button-check" onClick={onCheck}>Check</button>
                <button type="button" className="order-dialog-button order-dialog-button-preorder" onClick={onConfirm}>Order Now</button>
            </div>
        </PopupWrap>
    )
}

export default PowermateCompatibilityWarningPopup
