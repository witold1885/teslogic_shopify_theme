import type { ReactNode } from 'react'

export type CompatibilityResultPopupType = 'success' | 'warning' | 'default'

export type CompatibilityResultPopupData = {
    title: string
    texts: ReactNode[]
    buttons: { slug: string; text: string; onClick: () => void }[]
}

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