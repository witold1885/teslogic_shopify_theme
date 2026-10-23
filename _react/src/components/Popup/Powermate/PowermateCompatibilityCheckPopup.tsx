import { useRef, type FC } from 'react'
import './powermate-compatibility-dialog.scss'
import PopupWrap, { type PopupRefProps } from '../PopupWrap'
import loader from '../../../assets/icons/blue-loader.svg'
import Icon from '../../Common/Icon'

interface PopupProps {
    open: boolean
    onClose: () => void
}

const PowermateCompatibilityCheckPopup: FC<PopupProps> = ({ open, onClose }) => {
    const wrap = useRef<PopupRefProps>(null)

    return (
        <PopupWrap
            ref={wrap}
            className="compatibility-dialog compatibility-check-dialog"
            backgroundType="color"
            background="#171717"
            open={open}
            onClose={onClose}
        >
            <div className="compatibility-dialog-title">Check Compatibility</div>
            <div className="compatibility-check-dialog-unavailable-wrap">
                <div className="compatibility-check-dialog-unavailable compatibility-check-dialog-field-error">
                    Service temporary unavailable
                </div>
            </div>
            <div className="compatibility-check-dialog-fields">
                <div className="compatibility-check-dialog-field">
                    <label htmlFor="compatibility-vin">VIN: (can be copied from your Tesla app)</label>
                    <input id="compatibility-vin" name="vin" type="text" placeholder="Enter car’s VIN number" />
                    {/* <div className="compatibility-check-dialog-field-error">Wrong input</div> */}
                </div>
                <div className="compatibility-check-dialog-field">
                    <label htmlFor="compatibility-email">E-mail:</label>
                    <input id="compatibility-email" name="email" type="email" placeholder="John.smith@example.com" />
                    {/* <div className="compatibility-check-dialog-field-error">Wrong input</div> */}
                </div>  		
            </div>
            <div className="compatibility-check-dialog-submit">
                <button type="button" className="compatibility-check-dialog-button">
                    <span className="ready">Send Request</span>
                    <span className="loading">
                        <span>Loading</span>
                        <Icon className="loader" icon={loader} />
                    </span>
                </button>
                <div className="compatibility-check-dialog-agree">
                    <div className="compatibility-check-dialog-agree-checkbox-wrap">
                        <input type="checkbox" id="check-agree" className="compatibility-check-dialog-agree-checkbox" checked />
                    </div>
                    <label htmlFor="check-agree" className="compatibility-check-dialog-agree-label">I agree to receive Information emails from Screenmate</label>
                </div>
            </div>
        </PopupWrap>
    )
}

export default PowermateCompatibilityCheckPopup
