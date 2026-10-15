import React, { useMemo } from 'react'
import './screenmate-dash-devices-supporting.scss'
import { useInlineStyles } from '../../hooks/inline-styles'
import { Icon, Image } from '../Common'
import { mapSimpleConfigs, useAnime } from '../../hooks/anime'

const nounIconModules: Record<string, any> = import.meta.glob('@/assets/icons/screenmate-dash/devices/noun-*.svg', { eager: true })
const nounIcons: Record<string, any> = Object.entries(nounIconModules).reduce((acc, [key, mod]) => ({
    ...acc,
    [key.replace('/src/assets/icons/screenmate-dash/devices/noun-', '').replace('.svg', '')]: mod.default
}), {})

const imageModules: Record<string, any> = import.meta.glob('@/assets/images/screenmate-dash/devices/devices_supporting-*.png', { eager: true })
const images: Record<string, any> = Object.entries(imageModules).reduce((acc, [key, mod]) => ({
    ...acc,
    [key.replace('/src/assets/images/screenmate-dash/devices/devices_supporting-', '').replace('.png', '')]: mod.default
}), {})

type Device = 'iphone' | 'ipad'

const ScreenmateDashDevicesSupporting: React.FC = () => {
    const { isMobile } = useInlineStyles()

    const mode = useMemo(() => !isMobile ? 'desktop' : 'mobile', [isMobile])

    const nouns = useMemo(() => (['iphone', 'ipad'] as Device[]).map(device => ({
        key: device,
        icons: Object.values(Object.fromEntries(Object.entries(nounIcons).filter(([key, _]) => key.startsWith(device) && key.endsWith(mode))))
    })), [mode])
    
    const animationConfigs = useMemo(() => mapSimpleConfigs({
        ...['left', 'right'].reduce((acc, side) => ({ ...acc, [`block-${side}`]: { yFrom: '40px', duration: 666 } }), {})
    }), [])

    const { anime } = useAnime(animationConfigs)
    
    return (
        <div className="devices_supporting">
            <div {...anime('block-left')} className="devices_supporting-info">
                <div className="devices_supporting-info-texts">
                    <div className="devices_supporting-info-suptext">Screenmate Dash new feature avaliable</div>
                    <div className="devices_supporting-info-title">Multiple devices support</div>
                    <div className="devices_supporting-info-subtitle">
                        You can easily connect<br />
                        2+ cross platform devices<br />
                        simultaneously
                    </div>			
                </div>
                <div className="devices_supporting-info-nouns">
                    {nouns.map(({ key, icons }) => (
                        <div className="devices_supporting-info-noun-row" key={key}>
                            {icons.map((icon, index) => <Icon className={`noun-${key}`} icon={icon} key={`${key}-${index}`} />)}
                        </div>
                    ))}
                </div>
                
            </div>
            <div {...anime('block-right')} className="devices_supporting-image">
                <Image src={images[mode]} srcSet={`${images[`${mode}-retina`]} 2x`} />
            </div>
        </div>
    )
}

export default ScreenmateDashDevicesSupporting
