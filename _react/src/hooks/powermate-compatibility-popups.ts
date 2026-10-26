import { useState, useRef, useCallback } from 'react'
import type { CompatibilityResultPopupType } from '../components/Popup/Powermate/PowermateCompatibilityResultPopup'

export type PowermateCompatibilityPopupsProps = {
    warningPopupOpen: boolean
    setWarningPopupOpen: (state: boolean) => void
    checkPopupOpen: boolean
    setCheckPopupOpen: (state: boolean) => void
    resultPopupOpen: boolean
    setResultPopupOpen: (state: boolean) => void
    handleWarning: (confirmCallback?: () => void, boostOrderCallback?: () => void) => void
    handleCheck: (boostOrderCallback?: () => void) => void
    handleConfirm: () => void
    handleComplete: (proceed: boolean) => void
    handleBoostOrder: () => void
    resultPopupType: CompatibilityResultPopupType
}

export const usePowermateCompatibilityPopups = () => {
    const confirmCallbackRef = useRef<(() => void) | undefined>(undefined)
    const boostOrderCallbackRef = useRef<(() => void) | undefined>(undefined)

    const [warningPopupOpen, setWarningPopupOpen] = useState<boolean>(false)
    const [checkPopupOpen, setCheckPopupOpen] = useState<boolean>(false)
    const [resultPopupOpen, setResultPopupOpen] = useState<boolean>(false)
    const [resultPopupType, setResultPopupType] = useState<CompatibilityResultPopupType>('default')

    const handleWarning = useCallback((confirmCallback?: () => void, boostOrderCallback?: () => void) => {
        setWarningPopupOpen(true)
        confirmCallbackRef.current = confirmCallback
        boostOrderCallbackRef.current = boostOrderCallback
    }, [])

    const handleCheck = useCallback((boostOrderCallback?: () => void) => {
        setWarningPopupOpen(false)
        setCheckPopupOpen(true)
        if (!boostOrderCallbackRef.current) {
            boostOrderCallbackRef.current = boostOrderCallback
        }
    }, [])

    const handleConfirm = useCallback(() => {
        confirmCallbackRef.current?.()
        setWarningPopupOpen(false)
    }, [])

    const handleComplete = useCallback((proceed: boolean) => {
        setCheckPopupOpen(false)
        const type: CompatibilityResultPopupType = proceed ? 'success' : 'warning'
        setResultPopupType(type)
        setResultPopupOpen(true)
    }, [])

    const handleBoostOrder = useCallback(() => {
        boostOrderCallbackRef.current?.()
        setResultPopupOpen(false)
        setResultPopupType('default')
    }, [])

    return {
        warningPopupOpen, setWarningPopupOpen,
        checkPopupOpen, setCheckPopupOpen,
        resultPopupOpen, setResultPopupOpen,
        handleWarning, handleCheck, handleConfirm, handleComplete, handleBoostOrder,
        resultPopupType
    }
}
