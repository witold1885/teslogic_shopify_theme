import React, { useMemo } from 'react'
import { Button, Icon, Video } from '../Common'

import { bannerDesktop as bannerDesktopVideo, bannerMobile as bannerMobileVideo } from '../../assets/videos/screenmate-one'
import { bannerDesktop as bannerDesktopBackground, bannerMobile as bannerMobileBackground } from '../../assets/videos/screenmate-one/backgrounds'
import logoImage from '../../assets/images/screenmate-one/screenmate-one-logo.svg'
import playButton from '../../assets/icons/play-button.svg'
import kickstarterImage from '../../assets/images/screenmate-one/kickstarter.svg'
import heartIcon from '../../assets/icons/heart-fill.svg'
import chevronIcon from '../../assets/icons/chevron-grey-down.svg'

import { mapSimpleConfigs, useAnime, type AnimatedObjectOptions } from '../../hooks/anime'
import { useInlineStyles } from '../../hooks/inline-styles'

const animatedObjects: Record<string, AnimatedObjectOptions> = {
    logo: { yFrom: '20px' },
    title: { yFrom: '40px' },
    button_1: { yFrom: '20px' },
    button_2: { yFrom: '20px' },
    kickstarter: { yFrom: '20px' },
}

const ScreenmateOneBanner: React.FC<{ onExpand?: () => void, onOrder?: () => void }> = ({ onExpand, onOrder }) => {
    const { isMobile } = useInlineStyles()

    const animationConfigs = useMemo(() => mapSimpleConfigs(animatedObjects), [])

    const { anime } = useAnime(animationConfigs)

    return (
        <div className="screenmate-one__banner relative">
            {!isMobile ? (
                <Video className="absolute inset" src={bannerDesktopVideo} background={bannerDesktopBackground} />
            ) : (
                <Video className="absolute inset" src={bannerMobileVideo} background={bannerMobileBackground} />
            )}
            <div className="container h-full relative">
                <div className="screenmate-one__banner-inner">
                    <img {...anime('logo')} src={logoImage} alt="Screenmate One" fetchPriority="high" />
                    <h1 {...anime('title')}>The ultimate Tesla multimedia upgrade</h1>
                    <div className="flex gap-24">
                        <Button {...anime('button_1')} onClick={onOrder}>
                            <span>order now</span>
                        </Button>
                        <Button {...anime('button_2')}>
                            <Icon className="flex-center" icon={playButton} />
                            <span>Play video</span>
                        </Button>
                    </div>
                </div>
                <div {...anime('kickstarter')} className="screenmate-one__banner-kickstarter">
                    <img src={kickstarterImage} alt="Kickstarter" fetchPriority="high" />
                    <div className="screenmate-one__banner-kickstarter-badge"> 
                        <Icon className="flex-center" icon={heartIcon} />
                        <span>Project we love</span>
                    </div>
                </div>
                <div className="screenmate-one__banner-expand" onClick={onExpand}>
                    <Icon className="flex-center" icon={chevronIcon} />
                </div>
            </div>
        </div>
    )
}

export default ScreenmateOneBanner
