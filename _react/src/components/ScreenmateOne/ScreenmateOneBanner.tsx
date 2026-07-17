import React, { useMemo } from 'react'
import { preload } from 'react-dom'
import './screenmate-one-banner.scss'
import { Button, Icon } from '../Common'
import Video from '../Common/Video'

import { bannerDesktop as bannerDesktopVideo, bannerMobile as bannerMobileVideo } from '../../assets/videos/screenmate-one'
import { bannerDesktop as bannerDesktopBackground, bannerMobile as bannerMobileBackground } from '../../assets/videos/screenmate-one/backgrounds'
import logoImage from '../../assets/images/screenmate-one/screenmate-one-logo.svg'
import kickstarterImage from '../../assets/images/screenmate-one/kickstarter.svg'
import heartIcon from '../../assets/icons/heart-fill.svg'
import chevronIcon from '../../assets/icons/chevron-grey-down.svg'

import { mapSimpleConfigs, useAnime, type AnimatedObjectOptions } from '../../hooks/anime'
import { useInlineStyles } from '../../hooks/inline-styles'

const animatedObjects: Record<string, AnimatedObjectOptions> = {
    logo: { yFrom: '20px' },
    title: { yFrom: '40px' },
    button: { yFrom: '20px' },
    kickstarter: { yFrom: '20px' },
}

const ScreenmateOneBanner: React.FC<{ onExpand?: () => void, onOrder?: () => void }> = ({ onExpand, onOrder }) => {
    const { isMobile } = useInlineStyles()

    preload(bannerDesktopVideo, { 
        as: 'video', 
        fetchPriority: 'high' 
    })

    preload(bannerMobileVideo, { 
        as: 'video', 
        fetchPriority: 'high' 
    })

    const videoParams: { src: string; background: string } = useMemo(() => {
        return !isMobile 
            ? { src: bannerDesktopVideo, background: bannerDesktopBackground} 
            : { src: bannerMobileVideo, background: bannerMobileBackground }
    }, [isMobile])

    const animationConfigs = useMemo(() => mapSimpleConfigs(animatedObjects), [])

    const { anime } = useAnime(animationConfigs)

    return (
        <div className="screenmate-one__banner relative">
            <Video className="screenmate-one__banner-video" {...videoParams} />
            <div className="container h-full relative">
                <div className="screenmate-one__banner-inner">
                    <img {...anime('logo')} src={logoImage} alt="Screenmate One" fetchPriority="high" />
                    <h1 {...anime('title')}>The ultimate Tesla multimedia upgrade</h1>
                    <div className="flex gap-24">
                        <Button {...anime('button')} onClick={onOrder}>
                            <span>order now</span>
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
