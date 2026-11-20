import { useRef, type FC } from 'react'
import './bundle-popup.scss'
import PopupWrap, { type PopupRefProps } from '../PopupWrap'
import bundleImage from '../../../assets/images/promotion/bundle/bundle.png'

interface BundlePopupProps {
    open: boolean
    onClose: () => void
}

const BundlePopup: FC<BundlePopupProps> = ({ open, onClose }) => {
    const wrap = useRef<PopupRefProps>(null)


    return (
        <PopupWrap
            ref={wrap}
            className="bundle-popup"
            backgroundType="gradient"
            background="linear-gradient(0deg, hsl(240deg 0% 0%) 0%, hsl(240deg 0% 0%) 100%), linear-gradient(180deg, #FFF 0%, #F6F6F6 100%)"
            open={open}
            onClose={onClose}
        >
            <div className="bundle-popup-gallery">
                <img className="object-cover" src={bundleImage} />
                <div className="bundle-popup-gallery-title">Black Friday Bundle</div>
                <div className="bundle-popup-gallery-discount">25% OFF</div>
            </div>
            <div className="bundle-popup-form"></div>
        </PopupWrap>
    )
}

export default BundlePopup
