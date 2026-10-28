import type { FC, ReactNode } from 'react'
import './banner.scss'
import Button from './Button'
// import Icon from './Icon'
// import chevronIcon from '../../assets/icons/chevron-grey-down.svg'

export interface BannerButton {
    text: string
    onClick?: () => void
}

export interface BannerProps {
    image?: ReactNode
    video?: ReactNode
    logo?: { src: string; alt: string }
    title?: ReactNode
    subtitle?: ReactNode
    additional?: ReactNode
    buttons?: Record<string, BannerButton>
    onExpand?: () => void
    onOrder?: () => void
}

const Banner: FC<BannerProps> = ({
    image,
    video,
    logo,
    title,
    subtitle,
    additional,
    buttons,
    onExpand
}) => (
    <div className="banner-wrap">
        {image && <>{image}</>}
        {video && <>{video}</>}
        <div className="banner">
            {logo && (
                <div className="logo animate animate-big">
                    <img className="object-cover" {...logo} fetchPriority="high" />
                </div>
            )}
            {title && <h1 className="title animate animate-big">{title}</h1>}
            {subtitle && <div className="subtitle animate animate-small">{subtitle}</div>}
            <div className="banner-separator" />
            {additional && <div className="additional animate animate-small">{additional}</div>}
            {buttons && (
                <div className="banner-buttons">
                    {Object.entries(buttons).map(([key, { text, onClick }]) => (
                        <Button
                            key={key}
                            className={`banner-button-${key} animate animate-small`}
                            onClick={onClick}
                        >
                            {text}
                        </Button>
                    ))}
                </div>
            )}
            {onExpand && (
                <div className="expand" onClick={onExpand}>
                    {/* <Icon icon={chevronIcon} /> */}
                    <svg width="47" height="25" viewBox="0 0 47 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M3.21009 0.567537L23.3351 20.1894L43.4601 0.567534C43.8371 0.190525 44.2772 0.00202063 44.7803 0.00202059C45.2834 0.00202055 45.7235 0.190525 46.1005 0.567533C46.4775 0.944542 46.666 1.38461 46.666 1.88773C46.666 2.39086 46.4983 2.81013 46.1629 3.14555L24.7177 24.0252C24.3407 24.4022 23.8791 24.5908 23.3331 24.5908C22.787 24.5908 22.3255 24.4022 21.9485 24.0252L0.503285 3.20794C0.16787 2.83093 0.000160425 2.38013 0.00016038 1.85554C0.000160334 1.33094 0.188664 0.890879 0.565674 0.535338C0.94268 0.179796 1.38274 0.00135274 1.88587 1.10261e-05C2.38899 -0.00133068 2.82906 0.187174 3.20607 0.565524L3.21009 0.567537Z" fill="#686F70"/>
                    </svg>
                </div>
            )}
        </div>
    </div>
)

export default Banner
