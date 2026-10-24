import { useRef, type FC, type ReactNode } from 'react'
import PopupWrap, { type PopupRefProps } from '../PopupWrap'

export type CompatibilityResultPopupData = {
    type: 'success' | 'warning' | 'default'
    title: string
    texts: ReactNode[]
    buttons: { slug: string; text: string; onClick: () => void }[]
}

interface CompatibilityResultPopupProps extends CompatibilityResultPopupData {
    open: boolean
    onClose: () => void
}

const PowermateCompatibilityResultPopup: FC<CompatibilityResultPopupProps> = ({ type, title, texts, buttons, open, onClose }) => {
    const wrap = useRef<PopupRefProps>(null)

    return (
        <PopupWrap
            ref={wrap}
            className={`compatibility-dialog compatibility-${type}-dialog`}
            backgroundType="color"
            background="#171717"
            open={open}
            onClose={onClose}
        >
            <div className="compatibility-dialog-title">{title}</div>
            <div className="compatibility-dialog-texts">
                {texts.map((text, ti) => <div key={ti}>{text}</div>)}
            </div>
  	        <div className={`compatibility-${type}-dialog-buttons`}>
                {buttons.map(({ slug, text, onClick }) => (
                    <button
                        key={slug}
                        type="button"
                        className={`compatibility-${type}-dialog-button compatibility-${type}-dialog-button-${slug}`}
                        onClick={onClick}
                    >
                        {text}
                    </button>
                ))}
            </div>
        </PopupWrap>
    )
}

export default PowermateCompatibilityResultPopup
