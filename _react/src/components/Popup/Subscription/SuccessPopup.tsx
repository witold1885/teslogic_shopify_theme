import { useRef, type ReactNode, type FC } from 'react'
import PopupWrap, { type PopupRefProps } from '../PopupWrap'
import Image from '../../Common/Image'
import logo from '../../../assets/images/popup-logo-white.svg'

interface SuccessPopupProps {
    background: ReactNode
    open: boolean
    title?: ReactNode
    subtitle?: ReactNode
    onClose?: () => void
}

const SuccessPopup: FC<SuccessPopupProps> = ({
    background,
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
            backgroundType="node"
            background={background}
            open={open}
            onClose={handleCancel}
        >
            <Image className="subscription-popup-logo" src={logo} alt="SCREENMATE" />
            <div className="subscription-popup-info">
                <div className="subscription-popup-title">{title}</div>
                <div className="subscription-popup-subtitle">{subtitle}</div>
            </div>
        </PopupWrap>
    )
}

export default SuccessPopup
