import React from 'react'
import './screenmate-dash-banner.scss'
import { useInlineStyles } from '../../hooks/inline-styles'
import { Icon } from '../Common'
import bannerDesktop from '../../assets/images/screenmate-dash/banner_desktop.png'
import bannerMobile from '../../assets/images/screenmate-dash/banner_mobile.png'
import chevronIcon from '../../assets/icons/chevron-grey-down.svg'

const ScreenmateDashBanner: React.FC = () => {
    const { isMobile } = useInlineStyles()

    return (
        <div
            className="banner-wrap"
            style={{ backgroundImage: `url(${!isMobile ? bannerDesktop : bannerMobile})` }}
        >
            <div className="banner">
                <div className="title">Screenmate Dash</div>
                <div className="subtitle">
                    Powerful Dashboard for Model 3/Y <br />
                    with access to advanced Tesla features
                </div>
                <div className="banner-separator" />
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
