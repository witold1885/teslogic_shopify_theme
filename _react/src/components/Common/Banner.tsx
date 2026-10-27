import type { FC, ReactNode } from 'react'
import './banner.scss'
import Button from './Button'
import Icon from './Icon'
import Image from './Image'
import chevronIcon from '../../assets/icons/chevron-grey-down.svg'

export interface BannerButton {
    text: string
    onClick?: () => void
}

export interface BannerProps {
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
    video,
    logo,
    title,
    subtitle,
    additional,
    buttons,
    onExpand
}) => (
    <div className="banner-wrap">
        {video && <>{video}</>}
        <div className="banner">
            {logo && <Image className="logo banner-animate banner-animate-big" {...logo} />}
            {title && <h1 className="title banner-animate banner-animate-big">{title}</h1>}
            {subtitle && <div className="subtitle banner-animate banner-animate-small">{subtitle}</div>}
            <div className="banner-separator" />
            {additional && <div className="additional banner-animate banner-animate-small">{additional}</div>}
            {buttons && (
                <div className="banner-buttons">
                    {Object.entries(buttons).map(([key, { text, onClick }]) => (
                        <Button
                            key={key}
                            className={`banner-button-${key} banner-animate banner-animate-small`}
                            onClick={onClick}
                        >
                            {text}
                        </Button>
                    ))}
                </div>
            )}
            {onExpand && (
                <div className="expand" onClick={onExpand}>
                    <Icon icon={chevronIcon} />
                </div>
            )}
        </div>
    </div>
)

export default Banner
