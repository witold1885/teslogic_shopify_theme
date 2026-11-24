import { useState, useRef } from 'react'
import type { CompatibilityResultPopupType } from '../components/Popup/Powermate/types'

export const usePowermateCompatibilityPopups = () => {
    const confirmCallbackRef = useRef<(() => void) | undefined>(undefined)
    const boostOrderCallbackRef = useRef<(() => void) | undefined>(undefined)
    const isBundleRef = useRef<boolean>(false)
    
    const [isBundle, setIsBundle] = useState<boolean>(false)
    const [warningPopupOpen, setWarningPopupOpen] = useState<boolean>(false)
    const [checkPopupOpen, setCheckPopupOpen] = useState<boolean>(false)
    const [resultPopupOpen, setResultPopupOpen] = useState<boolean>(false)
    const [resultPopupType, setResultPopupType] = useState<CompatibilityResultPopupType>('default')
    
    const handleWarning = (confirmCallback?: () => void, boostOrderCallback?: () => void, isBundle: boolean = false) => {
        console.log('handleWarning', { isBundle: isBundle })
        setIsBundle(isBundle)
        isBundleRef.current = isBundle
        setWarningPopupOpen(true)
        confirmCallbackRef.current = confirmCallback
        boostOrderCallbackRef.current = boostOrderCallback
    }

    const handleCheck = (boostOrderCallback?: () => void, isBundle: boolean = false) => {
        console.log('handleCheck', { isBundle })
        setIsBundle(isBundle)
        isBundleRef.current = isBundle
        setWarningPopupOpen(false)
        setCheckPopupOpen(true)
        if (!boostOrderCallbackRef.current) {
            boostOrderCallbackRef.current = boostOrderCallback
        }
    }
    
    const handleConfirm = () => {
        confirmCallbackRef.current?.()
        setWarningPopupOpen(false)
    }

    const handleComplete = (proceed: boolean) => {
        console.log('handleComplete', { isBundle, isBundleRef: isBundleRef.current || false })
        setCheckPopupOpen(false)
        setIsBundle(isBundleRef.current || false)
        const type: CompatibilityResultPopupType = proceed ? 'success' : 'warning'
        setResultPopupType(type)
        setResultPopupOpen(true)
    }

    const handleBoostOrder = () => {
        boostOrderCallbackRef.current?.()
        setResultPopupOpen(false)
        setResultPopupType('default')
    }
    
    return {
        warningPopupOpen, setWarningPopupOpen,
        checkPopupOpen, setCheckPopupOpen,
        resultPopupOpen, setResultPopupOpen,
        resultPopupType, isBundle,
        handleWarning, handleCheck, handleConfirm, handleComplete, handleBoostOrder
    }
}
