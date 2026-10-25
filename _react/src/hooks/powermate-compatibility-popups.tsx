import { useState, useRef, useMemo, useCallback } from 'react'
import { useAppSelector } from '../redux/hooks'
import { fetchProducts } from '../redux/selectors/products'
import { fetchContent } from '../redux/selectors/content'
import type { CompatibilityResultPopupData } from '../components/Popup/Powermate/PowermateCompatibilityResultPopup'

const defaultResultPopupData: CompatibilityResultPopupData = {
    type: 'default',
    title: '',
    texts: [],
    buttons: []
}

export const usePowermateCompatibilityPopups = () => {
    const { products } = useAppSelector(fetchProducts)
    const { country } = useAppSelector(fetchContent)

    const currency: string = useMemo(() => country?.currency_code || 'USD', [country])

    const confirmCallbackRef = useRef<(() => void) | undefined>(undefined)
    const boostOrderCallbackRef = useRef<(() => void) | undefined>(undefined)

    const [warningPopupOpen, setWarningPopupOpen] = useState<boolean>(false)
    const [checkPopupOpen, setCheckPopupOpen] = useState<boolean>(false)
    const [resultPopupOpen, setResultPopupOpen] = useState<boolean>(false)
    const [resultPopupData, setResultPopupData] = useState<CompatibilityResultPopupData>(defaultResultPopupData)

    const boostProduct = useMemo(() => products?.find(({ title }) => title.includes('Boost')), [products])

    const closeButton = useMemo(() => ({ slug: 'close', text: 'Close', onClick: () => setResultPopupOpen(false) }), [])
    const orderButton = useMemo(() => ({ slug: 'order', text: 'Order Now', onClick: () => {
        boostOrderCallbackRef.current?.()
        setResultPopupOpen(false)
        setResultPopupData(defaultResultPopupData)
    }}), [])

    const compatibilityCheckingResultVariants: Record<CompatibilityResultPopupData['type'], CompatibilityResultPopupData> = useMemo(() => ({
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

    const handleWarning = useCallback((confirmCallback?: () => void, boostOrderCallback?: () => void) => {
        setWarningPopupOpen(true)
        confirmCallbackRef.current = confirmCallback
        boostOrderCallbackRef.current = boostOrderCallback
    }, [])

    const handleCheck = useCallback((boostOrderCallback?: () => void) => {
        setWarningPopupOpen(false)
        setCheckPopupOpen(true)
        boostOrderCallbackRef.current = boostOrderCallback
    }, [])

    const handleConfirm = useCallback(() => {
        confirmCallbackRef.current?.()
        setWarningPopupOpen(false)
    }, [])

    const handleComplete = useCallback((proceed: boolean) => {
        setCheckPopupOpen(false)
        const type: CompatibilityResultPopupData['type'] = proceed ? 'success' : 'warning'
        setResultPopupData(compatibilityCheckingResultVariants[type])
        setResultPopupOpen(true)
    }, [compatibilityCheckingResultVariants])

    return {
        warningPopupOpen, setWarningPopupOpen,
        checkPopupOpen, setCheckPopupOpen,
        resultPopupOpen, setResultPopupOpen,
        handleWarning, handleCheck, handleConfirm, handleComplete,
        resultPopupData
    }
}
