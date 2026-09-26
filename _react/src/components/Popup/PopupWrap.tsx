import React, { useEffect, useState, type ReactNode } from 'react'
import close from '../../assets/icons/close-white.svg'

interface PopupWrapProps {
    id: string
    className: string
    open: boolean
    closing?: boolean
    onClose: () => void
    children: ReactNode
}

const PopupWrap: React.FC<PopupWrapProps> = ({ id, className, open, closing, onClose = () => {}, children }) => {
    const [hiding, setHiding] = useState<boolean>(false)

    useEffect(() => {
        if (closing) {
            handleClose()
        }
    }, [closing])

    const handleClose = () => {
        setHiding(true)
        setTimeout(() => {
            onClose()
            setHiding(false)
        }, 500)
    }

    return (
        <div id={id} className={`subscription-popup-shadow ${open ? 'is-visible' : ''} ${hiding ? 'is-hiding' : ''}`}>
            <div className={className}>
                <video autoPlay muted loop className="subscription-popup-video">
                    <source src="https://cdn.shopify.com/videos/c/o/v/63070f02784841769f7dac1f57ceb0dc.mp4" type="video/mp4" />
                </video>
                <div className={`${className}-close`} onClick={handleClose}>
                    <img src={close} alt="" />
                </div>
                {children}
            </div>
        </div>
    )
}

export default PopupWrap
