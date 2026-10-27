import { useMemo, type FC } from 'react'
import './screenmate-one-banner.scss'
import Banner, { type BannerButton, type BannerProps } from '../Common/Banner'
import Icon from '../Common/Icon'
import Video from '../Common/Video'
import logo from '../../assets/images/screenmate-one/screenmate-one-logo.svg'
import kickstarterImage from '../../assets/images/screenmate-one/kickstarter.svg'
import heartIcon from '../../assets/icons/heart-fill.svg'

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
    const videoProps = { alt: 'Screenmate ONE multimedia system on a Tesla display', fetchpriority: 'high' }

    const buttons: Record<string, BannerButton> = useMemo(() => ({
        buy: { text: 'Order now', onClick: onOrder }
    }), [onOrder])

    const bannerProps: BannerProps = useMemo(() => ({
        video: <>
            <Video className="banner-video banner-video-desktop" src={bannerDesktopVideo} background={bannerDesktopBackground} {...videoProps} />
            <Video className="banner-video banner-video-mobile" src={bannerMobileVideo} background={bannerMobileBackground} {...videoProps} />
        </>,
        logo: { src: logo, alt: 'Screenmate One' },
        title: <>The ultimate Tesla multimedia upgrade</>,
        additional: <>
            <img src={kickstarterImage} alt="Kickstarter" fetchPriority="high" />
            <div> 
                <Icon icon={heartIcon} />
                <span>Project we love</span>
            </div>
        </>,
        buttons,
        onExpand
    }), [videoProps, buttons, onExpand])

    return <Banner {...bannerProps} />
}

export default ScreenmateOneBanner
