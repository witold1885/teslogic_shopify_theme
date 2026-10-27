import { useMemo, type FC } from 'react'
import './powermate-banner.scss'
import Banner, { type BannerButton, type BannerProps } from '../Common/Banner'
import logo from '../../assets/images/powermate-logo.svg'

const PowermateBanner: FC<BannerProps> = ({ onOrder }) => {
    const buttons: Record<string, BannerButton> = useMemo(() => ({
        buy: { text: 'Buy now', onClick: onOrder }
    }), [onOrder])

    const bannerProps: BannerProps = useMemo(() => ({
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
    }), [buttons])

    return <Banner {...bannerProps} />
}

export default PowermateBanner
