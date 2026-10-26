import { useState, useMemo, useCallback, useImperativeHandle, type RefObject, type ReactNode, type FC, type CSSProperties } from 'react'
import Icon from '../Common/Icon'
import close from '../../assets/icons/close-white.svg'

export interface PopupRefProps {
    close: (callback?: CallableFunction) => void
}

interface PopupWrapProps {
    ref: RefObject<PopupRefProps | null>
    id?: string
    className: string
    backgroundType: 'node' | 'image' | 'color'
    background: ReactNode | string
    open: boolean
    onClose: () => void
    children: ReactNode
}

const PopupWrap: FC<PopupWrapProps> = ({ ref, id, className, backgroundType, background, open, onClose = () => {}, children }) => {
    const [hiding, setHiding] = useState<boolean>(false)

    const style: CSSProperties = useMemo(() => {
        switch (backgroundType) {
            case 'image':
                return { backgroundImage: background as string }
            case 'color':
                return { backgroundColor: background as string }
            default:
                return {}
        }
    }, [backgroundType, background])

    const getClassNames = useCallback((suffix: string) => (className.split(' ') as string[]).map(c => `${c}-${suffix}`).join(' '), [className])

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
        <div id={id} className={`popup-shadow ${open ? 'is-visible' : ''} ${hiding ? 'is-hiding' : ''}`}>
            <div className={`popup ${className}`} style={style}>
                {backgroundType === 'node' && <>{background}</>}
                <Icon className={getClassNames('close')} icon={close} onClick={onClose} />
                {children}
            </div>
        </div>
    )
}

export default PopupWrap
