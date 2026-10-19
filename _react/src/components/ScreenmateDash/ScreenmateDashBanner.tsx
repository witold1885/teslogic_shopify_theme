import React, { useMemo } from 'react'
import './screenmate-dash-banner.scss'
import { Icon } from '../Common'
import chevronIcon from '../../assets/icons/chevron-grey-down.svg'

import { mapSimpleConfigs, useAnime, type AnimatedObjectOptions, type AnimationConfig } from '../../hooks/anime'
import { useInlineStyles } from '../../hooks/inline-styles'

const animatedObjects: Record<string, AnimatedObjectOptions> = {
    title: { yFrom: '40px', duration: 666 },
    subtitle: { yFrom: '20px', duration: 333 },
    button: { yFrom: '20px', duration: 333 },
}

interface BannerButton {
    text: string
    href?: string
    onClick?: () => void
}

interface ScreenmateDashBannerProps {
    bannerDesktop: string
    bannerMobile: string
    onOrder: () => void
}

const ScreenmateDashBanner: React.FC<ScreenmateDashBannerProps> = ({ bannerDesktop, bannerMobile, onOrder }) => {
    const { isMobile } = useInlineStyles()

    const buttons: Record<string, BannerButton> = useMemo(() => ({
        buy: { text: 'Buy now', onClick: onOrder },
        learn: { text: 'Learn more', href: '#using' },
    }), [onOrder])

    const animationConfigs = useMemo(() => ({
        ...mapSimpleConfigs({
            ...animatedObjects,
            ...Object.keys(buttons).reduce((acc, key) => ({ ...acc, [`button-${key}`]: animatedObjects.button }), {})
        }), rootMargin: '0px'
    } as AnimationConfig), [])

    const { anime } = useAnime(animationConfigs)

    return (
        <div
            className="banner-wrap"
            style={{ minHeight: '100vh', backgroundImage: `url(${!isMobile ? bannerDesktop : bannerMobile})` }}
        >
            <div className="banner">
                <h1 {...anime('title')} className="title">Screenmate Dash</h1>
                <div {...anime('subtitle')} className="subtitle">
                    Powerful Dashboard for Model 3/Y <br />
                    with access to advanced Tesla features
                </div>
                <div className="banner-separator" />
                <div className="banner-buttons">
                    {Object.entries(buttons).map(([key, { text, href, onClick }]) => (
                        <a {...anime(`button-${key}`)} key={key} className={`banner-button-${key}`} {...{href, onClick}}>{text}</a>
                    ))}
                </div>
                <a className="expand" href="#using" aria-label="Expand">
                    <Icon icon={chevronIcon} />
                </a>
            </div>
        </div>
    )
}

export default ScreenmateDashBanner
