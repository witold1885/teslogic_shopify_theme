import { useMemo, type FC } from 'react'
import './screenmate-one-banner.scss'
import Button from '../Common/Button'
import Icon from '../Common/Icon'
import Video from '../Common/Video'

import logoImage from '../../assets/images/screenmate-one/screenmate-one-logo.svg'
import kickstarterImage from '../../assets/images/screenmate-one/kickstarter.svg'
import heartIcon from '../../assets/icons/heart-fill.svg'
import chevronIcon from '../../assets/icons/chevron-grey-down.svg'

import { mapSimpleConfigs, useAnime, type AnimatedObjectOptions, type AnimationConfig } from '../../hooks/anime'
import { useInlineStyles } from '../../hooks/inline-styles'

const animatedObjects: Record<string, AnimatedObjectOptions> = {
    logo: { yFrom: '20px' },
    title: { yFrom: '40px' },
    button: { yFrom: '20px' },
    kickstarter: { yFrom: '20px' },
}

const alt: string = 'Screenmate ONE multimedia system on a Tesla display'

interface ScreenmateOneBannerProps {
    bannerDesktopVideo: string
    bannerMobileVideo: string
    bannerDesktopBackground: string
    bannerMobileBackground: string
    onExpand: () => void
    onOrder: () => void
}

const ScreenmateOneBanner: FC<ScreenmateOneBannerProps> = ({
    bannerDesktopVideo,
    bannerMobileVideo,
    bannerDesktopBackground,
    bannerMobileBackground,
    onExpand,
    onOrder
}) => {
    const { isMobile } = useInlineStyles()

    const videoParams: { src: string; background: string } = useMemo(() => {
        return !isMobile 
            ? { src: bannerDesktopVideo, alt, background: bannerDesktopBackground} 
            : { src: bannerMobileVideo, alt, background: bannerMobileBackground }
    }, [isMobile])

    const animationConfigs = useMemo(() => ({ ...mapSimpleConfigs(animatedObjects), rootMargin: '0px' } as AnimationConfig), [])

    const { anime } = useAnime(animationConfigs)

    return (
        <div className="screenmate-one__banner">
            <Video className="screenmate-one__banner-video" {...videoParams} fetchpriority="high" />
            <div className="container">
                <div className="screenmate-one__banner-inner">
                    <img {...anime('logo')} src={logoImage} alt="Screenmate One" fetchPriority="high" />
                    <h1 {...anime('title')}>The ultimate Tesla multimedia upgrade</h1>
                    <div className="screenmate-one__banner-inner-buttons">
                        <Button onClick={onOrder}>
                            <span>order now</span>
                        </Button>
                    </div>
                </div>
                <div {...anime('kickstarter')} className="screenmate-one__banner-kickstarter">
                    <img src={kickstarterImage} alt="Kickstarter" fetchPriority="high" />
                    <div className="screenmate-one__banner-kickstarter-badge"> 
                        <Icon icon={heartIcon} />
                        <span>Project we love</span>
                    </div>
                </div>
                <div className="screenmate-one__banner-expand" onClick={onExpand}>
                    <Icon icon={chevronIcon} />
                </div>
            </div>
        </div>
    )
}

export default ScreenmateOneBanner
