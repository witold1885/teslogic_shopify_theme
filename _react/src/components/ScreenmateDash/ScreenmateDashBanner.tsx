import React from 'react'
import './screenmate-dash-banner.scss'
import { Icon } from '../Common'
import bannerDesktop from '../../assets/images/screenmate-dash/banner_desktop.png'
import chevronIcon from '../../assets/icons/chevron-grey-down.svg'

const ScreenmateDashBanner: React.FC = () => {
    return (
        <div
            className="banner-desktop-wrap"
            style={{ backgroundImage: `url(${bannerDesktop})` }}
        >
            <div className="banner-desktop">
                <div className="title">Screenmate Dash</div>
                <div className="subtitle">
                    Powerful Dashboard for Model 3/Y <br />
                    with access to advanced Tesla features
                </div>
                <div className="banner-buttons">
                    <a href="#shop-now" className="banner-button-buy">Buy now</a>
                    <a href="#using" className="banner-button-learn">Learn more</a>
                </div>
                <a className="expand" href="#using">
                    <Icon icon={chevronIcon} />
                </a>
            </div>
        </div>
    )
}

export default ScreenmateDashBanner
