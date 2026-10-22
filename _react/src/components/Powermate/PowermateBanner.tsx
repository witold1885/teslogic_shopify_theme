import { useMemo, type FC } from 'react'
import './powermate-banner.scss'
import Button from '../Common/Button'
import Image from '../Common/Image'
import logo from '../../assets/images/powermate-logo.svg'

import { mapSimpleConfigs, useAnime, type AnimatedObjectOptions, type AnimationConfig } from '../../hooks/anime'
import { useInlineStyles } from '../../hooks/inline-styles'

const animatedObjects: Record<string, AnimatedObjectOptions> = {
    logo: { yFrom: '40px', duration: 666 },
    title: { yFrom: '40px', duration: 666 },
    subtitle: { yFrom: '20px', duration: 333 },
    addtext: { yFrom: '20px', duration: 333 },
    button: { yFrom: '20px', duration: 333 },
}

interface BannerButton {
    text: string
    onClick?: () => void
}

interface PowermateBannerProps {
    bannerDesktop: string
    bannerMobile: string
    onOrder: () => void
}

const PowermateBanner: FC<PowermateBannerProps> = ({ bannerDesktop, bannerMobile, onOrder }) => {
    const { isMobile } = useInlineStyles()
    
    const buttons: Record<string, BannerButton> = useMemo(() => ({
        buy: { text: 'Buy now', onClick: onOrder }
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
                <Image {...anime('logo')} className="logo" src={logo} alt="Powermate" />
                <h1 {...anime('title')} className="title">        
                    Unlock the full <br className="mobile" />potential <br className="desktop" />
                    of your <br className="mobile" />Model 3/Y
                </h1>
                <div {...anime('subtitle')} className="subtitle">
                    The ultimate performance <br className="mobile" />upgrade <br className="desktop" />
                    for real acceleration
                </div>
                <div className="banner-separator" />
                <div {...anime('addtext')} className="addtext">
                    <div className="addtext-sup">up to</div>
                    <div className="addtext-main">+150 HP</div>
                </div>
                <div className="banner-buttons">
                    {Object.entries(buttons).map(([key, { text, onClick }]) => (
                        <Button {...anime(`button-${key}`)} key={key} className={`banner-button-${key}`} onClick={onClick}>{text}</Button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default PowermateBanner
