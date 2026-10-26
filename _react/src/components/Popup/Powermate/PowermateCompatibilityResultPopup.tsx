import { useRef, useMemo, type FC, type ReactNode } from 'react'
import { useAppSelector } from '../../../redux/hooks'
import { fetchProducts } from '../../../redux/selectors/products'
import { fetchContent } from '../../../redux/selectors/content'
import PopupWrap, { type PopupRefProps } from '../PopupWrap'

export type CompatibilityResultPopupType = 'success' | 'warning' | 'default'

type CompatibilityResultPopupData = {
    title: string
    texts: ReactNode[]
    buttons: { slug: string; text: string; onClick: () => void }[]
}

interface CompatibilityResultPopupProps {
    type: CompatibilityResultPopupType
    open: boolean
    onClose: () => void
    onBoostOrder: () => void
}

const defaultResultPopupData: CompatibilityResultPopupData = {
    title: '',
    texts: [],
    buttons: []
}

const PowermateCompatibilityResultPopup: FC<CompatibilityResultPopupProps> = ({ type, open, onClose, onBoostOrder }) => {
    const { products } = useAppSelector(fetchProducts)
    const { country } = useAppSelector(fetchContent)

    const currency: string = useMemo(() => country?.currency_code || 'USD', [country])

    const wrap = useRef<PopupRefProps>(null)

    const handleClose = () => {
        wrap?.current?.close(() => onClose())
    }

    const closeButton = useMemo(() => ({ slug: 'close', text: 'Close', onClick: handleClose }), [handleClose])
    const orderButton = useMemo(() => ({ slug: 'order', text: 'Order Now', onClick: onBoostOrder }), [onBoostOrder])

    const boostProduct = useMemo(() => products?.find(({ title }) => title.includes('Boost')), [products])

    const variants: Record<CompatibilityResultPopupType, CompatibilityResultPopupData> = useMemo(() => ({
        default: defaultResultPopupData,
        success: {
            type: 'success',
            title: 'Manual check',
            texts: [<>
                Thank you for the information provided, <br />
                we will check compatibility and send you <br />
                a response within 2 working days.
            </>],
            buttons: [closeButton]
        },
        warning: {
            type: 'warning',
            title: 'Automatic check',
            texts: [
                <>The Performance version is not compatible with <br />your car, but the Boost is suitable.</>,
                ...(boostProduct?.price ? [<>You can order it now at the presale price of {boostProduct.price.toFixed(0)} {currency}</>] : [])
            ],
            buttons: [closeButton, orderButton]
        }
    }), [boostProduct, currency, closeButton, orderButton])

    return (
        <PopupWrap
            ref={wrap}
            id="powermate-compatibility-result-popup"
            className={`compatibility-dialog compatibility-result-dialog`}
            backgroundType="color"
            background="#171717"
            open={open}
            onClose={handleClose}
        >
            <div className="compatibility-dialog-title">{variants[type].title}</div>
            <div className="compatibility-dialog-texts">
                {variants[type].texts.map((text, ti) => <div key={ti}>{text}</div>)}
            </div>
  	        <div className={`compatibility-dialog-buttons`}>
                {variants[type].buttons.map(({ slug, text, onClick }) => (
                    <button
                        key={slug}
                        type="button"
                        className="compatibility-dialog-button"
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
