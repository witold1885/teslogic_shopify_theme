import { forwardRef, useMemo, type CSSProperties, type ReactNode } from 'react'
import { Icon } from '../Common'

import arrowIcon from '../../assets/icons/arrow-top-right.svg'
import runAnyAndroidApps from '../../assets/images/screenmate-one/features/run-any-android-apps.png'
import controlPanel50Commands from '../../assets/images/screenmate-one/features/control-panel-50-commands.png'
import carPlayAndAndroidAuto from '../../assets/images/screenmate-one/features/car-play-and-android-auto.png'
import dualViewMode from '../../assets/images/screenmate-one/features/dual-view-mode.png'
import consolesAndAnyHdmiDevices from '../../assets/images/screenmate-one/features/consoles-and-any-hdmi-devices.png'
import screenmateDashAppSupport from '../../assets/images/screenmate-one/features/screenmate-dash-app-support.png'

import { getAnimationConfig, useAnime, type AnimationConfig } from '../../hooks/anime'
import { useInlineStyles } from '../../hooks/inline-styles'

interface Feature {
    style?: Record<string, any>
    title: string | ReactNode
    image?: string
    backgroundImage?: string
    imageStyle?: Record<string, any>
}

const backgroundColor: string = '#1D1D1F'

const FeatureBlock = forwardRef<HTMLDivElement, Feature>(({ style = {}, title, image, backgroundImage, imageStyle = {} }, ref) => (
    <div
        ref={ref}
        className="screenmate-one__features-grid-item"
        style={{
            ...(backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : { backgroundColor }),
            ...style
        }}
    >
        <div className="flex-between">
            <div className="font-manrope-28 font-600 mob:font-manrope-22">{title}</div>
            <Icon className="screenmate-one__features-grid-item-header-icon flex-center" icon={arrowIcon} />
        </div>
        {image && <div style={imageStyle}><img className="w-full" src={image} /></div>}
    </div>
))

const ScreenmateOneFeatures = forwardRef<HTMLDivElement, {}>(({}, ref) => {
    const { isMobile, responsive } = useInlineStyles()
    const absoluteImageStyle = responsive({ width: !isMobile ? '385px' : '342px', height: !isMobile ? '286px' : '250px', position: 'absolute', bottom: 0 } as CSSProperties)

    const features: Feature[] = [
        { title: <>Run any<br />Android apps</>, image: runAnyAndroidApps, imageStyle: responsive({ height: !isMobile ? '248px' : '218px' } as CSSProperties) },
        { title: <>Control Panel<br />50+ Commands</>, image: controlPanel50Commands, imageStyle: { ...absoluteImageStyle, right: 0 } },
        { title: <>CarPlay &<br />Android Auto</>, image: carPlayAndAndroidAuto, imageStyle: { ...absoluteImageStyle, left: 0 } },
        { title: <>Dual View<br />Mode</>, backgroundImage: dualViewMode },
        { title: <>Consoles & any<br />HDMI Devices</>, backgroundImage: consolesAndAnyHdmiDevices },
        { title: <>Screenmate™<br />Dash App support</>, backgroundImage: screenmateDashAppSupport },
    ]

    const animationConfigs = useMemo(() => features.reduce<Record<string, AnimationConfig>>((acc, _, index) => ({
        ...acc, [`feature_${index}`]: getAnimationConfig('40px', 333)
    }), {}), [])
    
    const { anime } = useAnime(animationConfigs)

    return (
        <div ref={ref} className="screenmate-one__features">
            <div className="screenmate-one__features-grid">
                {features.map((feature: Feature, index: number) => (
                    <FeatureBlock {...anime(`feature_${index}`)} {...feature} key={index} />
                ))}
            </div>
        </div>
    )
})

export default ScreenmateOneFeatures
