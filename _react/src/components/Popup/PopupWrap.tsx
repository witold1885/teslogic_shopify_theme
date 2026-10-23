import { useState, useMemo, useCallback, useImperativeHandle, type RefObject, type ReactNode, type FC, type CSSProperties } from 'react'
import close from '../../assets/icons/close-white.svg'

export interface PopupRefProps {
    close: (callback?: CallableFunction) => void
}

interface PopupWrapProps {
    ref: RefObject<PopupRefProps | null>
    id?: string
    className: string
    backgroundType: 'video' | 'image' | 'color'
    background: string
    open: boolean
    onClose: () => void
    children: ReactNode
}

const PopupWrap: FC<PopupWrapProps> = ({ ref, id, className, backgroundType, background, open, onClose = () => {}, children }) => {
    const [hiding, setHiding] = useState<boolean>(false)

    const style: CSSProperties = useMemo(() => {
        switch (backgroundType) {
            case 'image':
                return { backgroundImage: background }
            case 'color':
                return { backgroundColor: background }
            default:
                return {}
        }
    }, [backgroundType, background])

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
            <div {...{className, style}}>
                {backgroundType === 'video' && (
                    <video autoPlay muted loop className="subscription-popup-video">
                        <source src={background} type="video/mp4" />
                    </video>
                )}
                <div className={`${className}-close`} onClick={onClose}>
                    <img src={close} alt="" />
                </div>
                {children}
            </div>
        </div>
    )
}

export default PopupWrap
