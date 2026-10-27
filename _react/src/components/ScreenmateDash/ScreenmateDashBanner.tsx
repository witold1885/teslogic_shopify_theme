import { useMemo, type FC } from 'react'
import './screenmate-dash-banner.scss'
import Banner, { type BannerButton, type BannerProps } from '../Common/Banner'

const ScreenmateDashBanner: FC<BannerProps> = ({ onExpand, onOrder }) => {
    const buttons: Record<string, BannerButton> = useMemo(() => ({
        buy: { text: 'Buy now', onClick: onOrder },
        learn: { text: 'Learn more', onClick: onExpand },
    }), [onOrder, onExpand])

    const bannerProps: BannerProps = useMemo(() => ({
        title: <>Screenmate Dash</>,
        subtitle: <>Powerful Dashboard for Model 3/Y <br />with access to advanced Tesla features</>,
        buttons,
        onExpand
    }), [buttons, onExpand])

    return <Banner {...bannerProps} />
}

export default ScreenmateDashBanner
