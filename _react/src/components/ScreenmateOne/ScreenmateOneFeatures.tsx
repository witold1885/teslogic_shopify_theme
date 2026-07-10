import { forwardRef, useState, useMemo, type CSSProperties, type ReactNode, useEffect } from 'react'
import { Icon } from '../Common'

import arrowIcon from '../../assets/icons/arrow-top-right.svg'
import runAnyAndroidApps from '../../assets/images/screenmate-one/features/run-any-android-apps.png'
import controlPanel50Commands from '../../assets/images/screenmate-one/features/control-panel-50-commands.png'
import carPlayAndAndroidAuto from '../../assets/images/screenmate-one/features/car-play-and-android-auto.png'
import dualViewMode from '../../assets/images/screenmate-one/features/dual-view-mode.png'
import consolesAndAnyHdmiDevices from '../../assets/images/screenmate-one/features/consoles-and-any-hdmi-devices.png'
import screenmateDashAppSupport from '../../assets/images/screenmate-one/features/screenmate-dash-app-support.png'

import { getAnimationConfig, getShiftConfig, useAnime, type AnimationConfig } from '../../hooks/anime'
import { useInlineStyles } from '../../hooks/inline-styles'

interface Feature {
    title: string | ReactNode
    image?: string
    backgroundImage?: string
    imageStyle?: Record<string, any>
    anchor?: string
}

interface FeatureBlockProps extends Feature {
    index: number
    style?: Record<string, any>
    onClick?: () => void
}

const duration: number = 333
const backgroundColor: string = '#1D1D1F'

const FeatureBlock: React.FC<FeatureBlockProps> = ({
    index,
    style = {},
    title,
    image,
    backgroundImage,
    imageStyle = {},
    onClick
}) => {
    const [isHovered, setIsHovered] = useState<boolean>(false)
    const [isSpawned, setIsSpawned] = useState<boolean>(false)

    const baseKey: string = useMemo(() => `feature_${index}`, [index])

    const animeKey: string = useMemo(() => {
        if (!isSpawned) return baseKey
        return isHovered ? `${baseKey}_hover` : `${baseKey}_leave`
    }, [baseKey, isSpawned, isHovered])
    
    const config: AnimationConfig = useMemo(() => {
        if (animeKey.endsWith('_hover')) {
            return getShiftConfig('0px', '-10px', duration)
        }
        if (animeKey.endsWith('_leave')) {
            return getShiftConfig('-10px', '0px', duration)
        }
        const baseConfig = getAnimationConfig('40px', duration)
        return { ...baseConfig, delay: index * duration / 4 }
    }, [animeKey, index])

    const animationConfigs = useMemo(() => ({ [animeKey]: config }), [animeKey, config])
    
    const { anime, finishedAnimations } = useAnime(animationConfigs)
    
    useEffect(() => {
        setIsSpawned(!!finishedAnimations[baseKey])
    }, [baseKey, finishedAnimations])

    const handleMouseEnter = () => {
        if (isSpawned) setIsHovered(true)
    }

    const handleMouseLeave = () => {
        if (isSpawned) setIsHovered(false)
    }

    return (
        <div
            {...anime(animeKey)}
            className="screenmate-one__features-grid-item"
            style={{
                ...(backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : { backgroundColor }),
                ...style
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onClick={onClick}
        >
            <div className="flex-between">
                <div className="font-manrope-28 font-600 mob:font-manrope-22">{title}</div>
                <Icon className="screenmate-one__features-grid-item-header-icon flex-center" icon={arrowIcon} />
            </div>
            {image && <div style={imageStyle}><img className="w-full" src={image} /></div>}
        </div>
    )
}

const ScreenmateOneFeatures = forwardRef<HTMLDivElement, { scrollTo: (anchor: string | null) => void }>(({ scrollTo }, ref) => {
    const { isMobile, responsive } = useInlineStyles()
    const absoluteImageStyle = responsive({
        width: !isMobile ? '385px' : '342px',
        height: !isMobile ? '286px' : '250px',
        position: 'absolute',
        bottom: 0
    } as CSSProperties)

    const features: Feature[] = useMemo(() => [
        { title: <>Run any<br />Android apps</>, image: runAnyAndroidApps, imageStyle: responsive({ height: !isMobile ? '248px' : '218px' } as CSSProperties), anchor: 'Setup' },
        { title: <>Control Panel<br />50+ Commands</>, image: controlPanel50Commands, imageStyle: { ...absoluteImageStyle, right: 0 }, anchor: 'Convenience.beyond-basic-control' },
        { title: <>CarPlay &<br />Android Auto</>, image: carPlayAndAndroidAuto, imageStyle: { ...absoluteImageStyle, left: 0 }, anchor: 'Integration.familiar-interfaces' },
        { title: <>Dual View<br />Mode</>, backgroundImage: dualViewMode, anchor: 'Convenience.dual-view-mode' },
        { title: <>Consoles & any<br />HDMI Devices</>, backgroundImage: consolesAndAnyHdmiDevices, anchor: 'Integration.bigger-entertainment' },
        { title: <>Screenmate™<br />Dash App support</>, backgroundImage: screenmateDashAppSupport, anchor: 'Dash' },
    ], [isMobile, responsive])

    return (
        <div ref={ref} className="screenmate-one__features">
            <div className="screenmate-one__features-grid">
                {features.map((feature: Feature, index: number) => (
                    <FeatureBlock
                        key={index}
                        index={index}
                        {...feature}
                        onClick={() => scrollTo(feature.anchor || null)}
                    />
                ))}
            </div>
        </div>
    )
})

export default ScreenmateOneFeatures
