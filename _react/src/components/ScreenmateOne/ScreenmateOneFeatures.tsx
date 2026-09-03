import { forwardRef, useMemo, type CSSProperties, type ReactNode } from 'react'
import './screenmate-one-features.scss'

import { Icon } from '../Common'
import arrowIcon from '../../assets/icons/arrow-top-right.svg'
import runAnyAndroidApps from '../../assets/images/screenmate-one/features/run-any-android-apps.png'
import controlPanel50Commands from '../../assets/images/screenmate-one/features/control-panel-50-commands.png'
import carPlayAndAndroidAuto from '../../assets/images/screenmate-one/features/car-play-and-android-auto.png'
import dualViewMode from '../../assets/images/screenmate-one/features/dual-view-mode-feature.png'
import consolesAndAnyHdmiDevices from '../../assets/images/screenmate-one/features/consoles-and-any-hdmi-devices.png'
import screenmateDashAppSupport from '../../assets/images/screenmate-one/features/screenmate-dash-app-support.png'

import { useInlineStyles } from '../../hooks/inline-styles'
import TrackSlider from '../Common/TrackSlider'

interface Feature {
    title: string | ReactNode
    image?: string
    backgroundImage?: string
    alt?: string
    imageStyle?: Record<string, any>
    anchor?: string
}

interface FeatureBlockProps extends Feature {
    style?: Record<string, any>
    position: 'grid' | 'slider'
    onClick?: () => void
}

const backgroundColor: string = '#1D1D1F'

const FeatureBlock: React.FC<FeatureBlockProps> = ({
    style = {},
    title,
    image,
    backgroundImage,
    alt,
    imageStyle = {},
    position,
    onClick
}) => {
    const blockActions = useMemo(() => position === 'grid' ? { onClick } : {}, [position])
    const iconActions = useMemo(() => position === 'slider' ? { onClick } : {}, [position])
    
    return (
        <div
            {...blockActions}
            className={`screenmate-one__features-item screenmate-one__features-${position}-item`}
            style={{
                ...(backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : { backgroundColor }),
                ...style
            }}
            aria-label={backgroundImage ? alt : ''}
        >
            <div className="screenmate-one__features-item-header">
                <div className="screenmate-one__features-item-header-title">{title}</div>
                <Icon className="screenmate-one__features-item-header-icon" icon={arrowIcon} {...iconActions} />
            </div>
            {image && (
                <div className="screenmate-one__features-item-image" style={imageStyle}>
                    <img src={image} alt={alt} loading="lazy" />
                </div>
            )}
        </div>
    )
}

const getFeatures = (
    isMobile: boolean,
    responsive: (styles?: CSSProperties) => Record<string, string>,
    absoluteImageStyle: CSSProperties
) => {
    return [
        { title: <>Run any<br />Android apps</>, image: runAnyAndroidApps, alt: 'Android apps available on Tesla with Screenmate ONE', imageStyle: responsive(
            !isMobile ? { height: '248px' } : { width: '310px', height: '218px', position: 'absolute', left: '5px', right: '5px', bottom: 0 } as CSSProperties
        ), anchor: 'Setup' },
        { title: <>Control Panel<br />50+ Commands</>, image: controlPanel50Commands, alt: 'Screenmate ONE customizable Tesla control panel', imageStyle: { ...absoluteImageStyle, right: 0 }, anchor: 'Convenience.beyond-basic-control' },
        { title: <>CarPlay &<br />Android Auto for Tesla</>, image: carPlayAndAndroidAuto, alt: 'Apple CarPlay on a Tesla display with Screenmate ONE', imageStyle: { ...absoluteImageStyle, left: 0 }, anchor: 'Integration.familiar-interfaces' },
        { title: <>Dual View<br />Mode</>, backgroundImage: dualViewMode, alt: 'Screenmate ONE Dual View mode on a Tesla display', anchor: 'Convenience.dual-view-mode' },
        { title: <>Console Gaming<br />on Your Tesla</>, backgroundImage: consolesAndAnyHdmiDevices, alt: 'Gaming console connected to a Tesla display through Screenmate ONE', anchor: 'Integration.bigger-entertainment' },
        { title: <>Screenmate™<br />Dash App support</>, backgroundImage: screenmateDashAppSupport, alt: 'Screenmate Dash driver display for Tesla', anchor: 'Dash' },
    ]
}

const ScreenmateOneFeatures = forwardRef<HTMLDivElement, { scrollTo: (anchor: string | null) => void }>(({ scrollTo }, ref) => {
    const { isMobile, responsive } = useInlineStyles()
    const absoluteImageStyle = responsive({
        width: !isMobile ? '385px' : '312px',
        height: !isMobile ? '286px' : '220px',
        position: 'absolute',
        bottom: 0
    } as CSSProperties)

    const features: Feature[] = useMemo(
        () => getFeatures(isMobile, responsive, absoluteImageStyle),
        [isMobile, responsive, absoluteImageStyle]
    )

    return (
        <div ref={ref} className="screenmate-one__features">
            {!isMobile && (
                <div className="screenmate-one__features-grid">
                    {features.map((feature: Feature, index: number) => (
                        <FeatureBlock
                            key={index}
                            {...feature}
                            position="grid"
                            onClick={() => scrollTo(feature.anchor || null)}
                        />
                    ))}
                </div>
            )}
            {isMobile && (
                <TrackSlider
                    className="screenmate-one__features-slider"
                    items={features.map((feature: Feature, index: number) => (
                        <FeatureBlock
                            key={index}
                            {...feature}
                            position="slider"
                            onClick={() => scrollTo(feature.anchor || null)}
                        />
                    ))}
                    slidesToShow={1.09375}
                />
            )}
        </div>
    )
})

export default ScreenmateOneFeatures
