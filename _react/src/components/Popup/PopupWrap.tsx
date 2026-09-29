import React, { useState, useCallback, useImperativeHandle, type RefObject, type ReactNode } from 'react'
import close from '../../assets/icons/close-white.svg'

export interface PopupRefProps {
    close: (callback?: CallableFunction) => void
}

interface PopupWrapProps {
    ref: RefObject<PopupRefProps | null>
    id: string
    className: string
    open: boolean
    onClose: () => void
    children: ReactNode
}

const PopupWrap: React.FC<PopupWrapProps> = ({ ref, id, className, open, onClose = () => {}, children }) => {
    const [hiding, setHiding] = useState<boolean>(false)

    const handleClose = useCallback((callback?: CallableFunction) => {
        setHiding(true)
        setTimeout(() => {
            setHiding(false)
            callback ? callback() : onClose()
        }, 500)
    }, [id, onClose])

    useImperativeHandle(ref, () => ({
        close: (callback?: CallableFunction) => handleClose(callback)
    }), [handleClose])

    return (
        <div id={id} className={`subscription-popup-shadow ${open ? 'is-visible' : ''} ${hiding ? 'is-hiding' : ''}`}>
            <div className={className}>
                <video autoPlay muted loop className="subscription-popup-video">
                    <source src="https://cdn.shopify.com/videos/c/o/v/63070f02784841769f7dac1f57ceb0dc.mp4" type="video/mp4" />
                </video>
                <div className={`${className}-close`} onClick={onClose}>
                    <img src={close} alt="" />
                </div>
                {children}
            </div>
        </div>
    )
}

export default PopupWrap
