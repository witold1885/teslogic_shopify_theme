import { useRef, type FC } from 'react'
import PopupWrap, { type PopupRefProps } from '../PopupWrap'
import Icon from '../../Common/Icon'
import ok from '../../../assets/icons/popup-ok.svg'

interface BlackFridaySuccessProps {
    open: boolean
    onClose?: () => void
}

const BlackFridaySuccess: FC<BlackFridaySuccessProps> = ({ open, onClose = () => {} }) => {
    const wrap = useRef<PopupRefProps>(null)
    
    const handleCancel = () => {
        wrap?.current?.close(() => onClose())
    }
    return (
        <PopupWrap
            ref={wrap}
            id="bf-success"
            className="bf-success"
            backgroundType="gradient"
            background="radial-gradient(151.44% 162.55% at -41.6% 136.82%, rgba(30, 215, 96, 0.60) 0%, rgba(30, 215, 96, 0.00) 100%), radial-gradient(205.08% 142.52% at 111.15% 52.69%, rgba(34, 74, 251, 0.20) 0%, rgba(34, 74, 251, 0.00) 100%), radial-gradient(1460.37% 375.48% at 11.43% 241.41%, rgba(34, 74, 251, 0.15) 0%, rgba(34, 74, 251, 0.00) 100%), rgba(0, 0, 0, 0.50)"
            open={open}
            onClose={handleCancel}
        >
            <Icon icon={ok} />
            <div className="bf-success-info">
                <div>You're on the list!</div>
                <div>We'll send you a reminder a few hours  before the <br />sale starts. See you on Black Friday!</div>
            </div>
            <button className="bf-success-button" onClick={handleCancel}>Ok, thanks</button>
        </PopupWrap>
    )
}

export default BlackFridaySuccess
