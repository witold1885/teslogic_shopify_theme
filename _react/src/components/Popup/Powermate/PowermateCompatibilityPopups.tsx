import type { FC } from 'react'
import type { PowermateCompatibilityPopupsProps } from './types.ts'
import './powermate-compatibility-dialog.scss'
import { getComponent } from '../../../layouts/components'

const PowermateCompatibilityWarningPopup = getComponent(() => import('./PowermateCompatibilityWarningPopup.tsx'), true)
const PowermateCompatibilityCheckPopup = getComponent(() => import('./PowermateCompatibilityCheckPopup.tsx'), true)
const PowermateCompatibilityResultPopup = getComponent(() => import('./PowermateCompatibilityResultPopup.tsx'), true)

const PowermateCompatibilityPopups: FC<PowermateCompatibilityPopupsProps> = ({
    warningPopupOpen, setWarningPopupOpen,
    checkPopupOpen, setCheckPopupOpen,
    resultPopupOpen, setResultPopupOpen,
    handleCheck, handleConfirm, handleComplete, handleBoostOrder,
    resultPopupType
}) => {
    return (<>
        {PowermateCompatibilityWarningPopup && PowermateCompatibilityCheckPopup && PowermateCompatibilityResultPopup && (<>
            {warningPopupOpen && (
                <PowermateCompatibilityWarningPopup
                    open={warningPopupOpen}
                    onClose={() => setWarningPopupOpen(false)}
                    onCheck={handleCheck}
                    onConfirm={handleConfirm}
                />
            )}
            {checkPopupOpen && (
                <PowermateCompatibilityCheckPopup
                    open={checkPopupOpen}
                    onClose={() => setCheckPopupOpen(false)}
                    onCompleted={handleComplete}
                />
            )}
            {resultPopupOpen && (
                <PowermateCompatibilityResultPopup
                    type={resultPopupType}
                    open={resultPopupOpen}
                    onClose={() => setResultPopupOpen(false)}
                    onBoostOrder={handleBoostOrder}
                />
            )}
        </>)}
    </>)

}

export default PowermateCompatibilityPopups
