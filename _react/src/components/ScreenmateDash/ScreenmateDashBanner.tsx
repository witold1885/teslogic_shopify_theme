import { useMemo, type FC } from 'react'
import './screenmate-dash-banner.scss'
import Banner, { type BannerButton, type BannerProps } from '../Common/Banner'

interface ScreenmateDashBannerProps {
    bannerDesktopBackground: string
    bannerMobileBackground: string
    onExpand: () => void
    onOrder: () => void
}

const ScreenmateDashBanner: FC<ScreenmateDashBannerProps> = ({ bannerDesktopBackground, bannerMobileBackground, onExpand, onOrder }) => {
    const imageProps = { alt: '', fetchpriority: 'high' }

    const buttons: Record<string, BannerButton> = useMemo(() => ({
        buy: { text: 'Buy now', onClick: onOrder },
        learn: { text: 'Learn more', onClick: onExpand },
    }), [onOrder, onExpand])

    const bannerProps: BannerProps = useMemo(() => ({
        // image: <>
        //     <img className="banner-image banner-image-desktop object-cover" src={bannerDesktopBackground} {...imageProps} />
        //     <img className="banner-image banner-image-mobile object-cover" src={bannerMobileBackground} {...imageProps} />
        // </>,
        title: <>Screenmate Dash</>,
        subtitle: <>Powerful Dashboard for Model 3/Y <br />with access to advanced Tesla features</>,
        buttons,
        onExpand
    }), [bannerDesktopBackground, bannerMobileBackground, imageProps, buttons, onExpand])

    return <Banner {...bannerProps} />
}

export default ScreenmateDashBanner
