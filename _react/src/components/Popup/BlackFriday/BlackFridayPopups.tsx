import type { FC } from 'react'
import './black-friday-popup.scss'
import type { BlackFridayPopupsProps } from './types.ts'
import { getComponent } from '../../../layouts/components'
import BlackFridaySuccess from './BlackFridaySuccess.tsx'

const BlackFridayBanner = getComponent(() => import('./BlackFridayBanner.tsx'), true)
const BlackFridayPopup = getComponent(() => import('./BlackFridayPopup.tsx'), true)

const BlackFridayPopups: FC<BlackFridayPopupsProps> = ({
    blackFridayBannerOpen, setBlackFridayBannerOpen, 
    blackFridayPopupOpen, setBlackFridayPopupOpen, 
    blackFridaySuccessOpen, setBlackFridaySuccessOpen
}) => {

    return (<>
        {BlackFridayBanner && BlackFridayPopup && (<>
            {blackFridayBannerOpen && (
                <BlackFridayBanner
                    onConfirm={() => {
                        setBlackFridayBannerOpen(false)
                        setBlackFridayPopupOpen(true)
                    }}
                    onClose={() => setBlackFridayBannerOpen(false)}
                />
            )}
            {blackFridayPopupOpen && (
                <BlackFridayPopup
                    open={blackFridayPopupOpen}
                    onConfirm={() => {
                        setBlackFridayPopupOpen(false)
                        if (typeof window !== undefined) {
                            window.location.href = `${window.location.href.split('?')[0]}?success=blackfriday`
                        } else {
                            setBlackFridaySuccessOpen(true)
                        }
                    }}
                    onClose={() => {
                        setBlackFridayPopupOpen(false)
                        setBlackFridayBannerOpen(true)
                    }}
                />
            )}
            {blackFridaySuccessOpen && (
                <BlackFridaySuccess
                    open={blackFridaySuccessOpen}
                    onClose={() => setBlackFridaySuccessOpen(false)}
                />
            )}
        </>)}
    </>)
}

export default BlackFridayPopups
