import { useMemo, type FC } from 'react'
import './powermate-banner.scss'
import Banner, { type BannerButton, type BannerProps } from '../Common/Banner'
import logo from '../../assets/images/powermate-logo.svg'

interface PowermateBannerProps {
    bannerDesktopBackground: string
    bannerMobileBackground: string
    onOrder: () => void
}

const PowermateBanner: FC<PowermateBannerProps> = ({ bannerDesktopBackground, bannerMobileBackground, onOrder }) => {
    const imageProps = { alt: '', fetchpriority: 'high' }

    const buttons: Record<string, BannerButton> = useMemo(() => ({
        buy: { text: 'Buy now', onClick: onOrder }
    }), [onOrder])

    const bannerProps: BannerProps = useMemo(() => ({
        // image: <>
        //     <img className="banner-image banner-image-desktop object-cover" src={bannerDesktopBackground} {...imageProps} />
        //     <img className="banner-image banner-image-mobile object-cover" src={bannerMobileBackground} {...imageProps} />
        // </>,
        logo: { src: logo, alt: 'Powermate' },
        title: <>
            Unlock the full <br className="mobile" />potential <br className="desktop" />
            of your <br className="mobile" />Model 3/Y
        </>,
        subtitle: <>
            The ultimate performance <br className="mobile" />upgrade <br className="desktop" />
            for real acceleration
        </>,
        additional: <>
            <div className="additional-sup">up to</div>
            <div className="additional-main">+150 HP</div>
        </>,
        buttons
    }), [bannerDesktopBackground, bannerMobileBackground, imageProps, buttons])

    return <Banner {...bannerProps} />
}

export default PowermateBanner
