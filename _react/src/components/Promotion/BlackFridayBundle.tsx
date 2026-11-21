import type { FC } from 'react'
import './black-friday-bundle.scss'
import Image from '../Common/Image'
import screenmateOne from '../../assets/images/promotion/bundle/screenmate-one.png'
import powermate from '../../assets/images/promotion/bundle/powermate.png'

const BlackFridayBundle: FC<{ onBundlePopupOpen?: () => void }> = ({ onBundlePopupOpen }) => (
    <div className="bf-bundle">
        <div className="bf-bundle-images">
            <Image className="bf-bundle-screenmate-one" src={screenmateOne} />
            <div className="bf-bundle-plus">
                <svg width="23" height="23" viewBox="0 0 23 23" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M21.0645 10.1619C21.6115 10.1623 22.0557 10.6063 22.0559 11.1533C22.0558 11.7005 21.6127 12.1432 21.0656 12.1436L12.1439 12.1436L12.1439 21.0653C12.1439 21.6125 11.6997 22.0563 11.1525 22.0567C10.605 22.0567 10.1611 21.6128 10.1611 21.0653L10.1611 12.1436L1.23945 12.1436C0.692031 12.1436 0.249209 11.7008 0.249165 11.1533C0.24934 10.606 0.693214 10.1619 1.24059 10.1619L10.1611 10.1608L10.1622 1.24027C10.1624 0.692942 10.6051 0.249992 11.1525 0.249992C11.6996 0.250376 12.1426 0.693179 12.1428 1.24027L12.1439 10.1608L21.0645 10.1619Z" fill="#0465FD" stroke-width="0.5" stroke-linecap="round" stroke="#0465FD"/>
                </svg>
            </div>
            <Image className="bf-bundle-powermate" src={powermate} />
        </div>
        <div className="bf-bundle-info">
            <div>
                <span>Black Friday Bundle</span>
                <span>with 25% OFF</span>
            </div>
            <div>Powermate + Screenmate ONE</div>
            <a onClick={onBundlePopupOpen}>Learn more</a>
        </div>
    </div>
)

export default BlackFridayBundle
