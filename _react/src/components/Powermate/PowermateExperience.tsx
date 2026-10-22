import { useMemo, type FC } from 'react'
import './powermate-experience.scss'
import Image from '../Common/Image'
import Icon from '../Common/Icon'
import bothImageDesktop from '../../assets/images/powermate/experience/pro-experience-both-image-desktop.png'
import bothImageRetina from '../../assets/images/powermate/experience/pro-experience-both-image-retina.png'
import flagIcon from '../../assets/icons/powermate/experience/pro-flag.svg'

import { mapSimpleConfigs, useAnime, type AnimatedObjectOptions } from '../../hooks/anime'

const animatedObjects: Record<string, AnimatedObjectOptions> = {
    title: { yFrom: '40px', duration: 666 },
    block: { yFrom: '20px', duration: 333 },
}

const blockIconModules: Record<string, any> = import.meta.glob('@/assets/icons/powermate/experience/pro-experience-block-icon-*.svg', { eager: true })
const blockIcons: Record<string, any> = Object.entries(blockIconModules).reduce((acc, [key, mod]) => ({
    ...acc,
    [key.replace('/src/assets/icons/powermate/experience/pro-experience-block-icon-', '').replace('.svg', '')]: mod.default
}), {})

const addIconModules: Record<string, any> = import.meta.glob('@/assets/icons/powermate/experience/pro-experience-add-icon-*.svg', { eager: true })
const addIcons: Record<string, any> = Object.entries(addIconModules).reduce((acc, [key, mod]) => ({
    ...acc,
    [key.replace('/src/assets/icons/powermate/experience/pro-experience-add-icon-', '').replace('.svg', '')]: mod.default
}), {})

const oneOptions = [
    {
        title: <>Powermate Boost</>,
        caption: <>Power increase:</>,
        value: <>+50 HP</>,
    },
    {
        title: <>Powermate Performance</>,
        caption: <>Power increase:</>,
        value: <>+150 HP</>,
        plus: <>
            <Icon className="experience-block-options-one-plus-icon" icon={flagIcon} />
            <div className="experience-block-options-one-plus-text">Plus Track Mode</div>
        </>
    }
]

const addFeatures = Object.entries({
    1: <>Adaptive Matrix<br />Headlights</>,
    2: <>Amber Taillights<br />Retrofit</>
}).map(([index, text]) => ({
    icon: addIcons[index],
    text
}))

const PowermateExperience: FC = () => {
    const animationConfigs = useMemo(() => mapSimpleConfigs({
        ...animatedObjects,
        ...[
            'both',
            ...oneOptions.map((_, index) => `one-${index}`),
            'add'
        ].reduce((acc, key) => ({
            ...acc, [`block-${key}`]: animatedObjects.block
        }), {})
    }), [])

    const { anime } = useAnime(animationConfigs)
    
    return (
        <div className="experience-block-wrap">
            <div className="experience-block">
                <div {...anime('title')} className="experience-block-title">
                    Experience the thrill <br className="mobile" />of <br className="desktop" />
                    Powermate <br className="mobile" />featuring two <br className="mobile" />versions: <br className="desktop" />
                    Boost <br className="mobile" />and Performance
                </div>
                <div className="experience-block-options">
                    <div className="experience-block-options-left">
                        <div {...anime('block-both')} className="experience-block-options-item experience-block-options-both">
                            <div className="experience-block-options-both-title">
                                Both of them offer <br />
                                All Screenmate Dash <br />
                                features +
                            </div>
                            <Image className="experience-block-options-both-image" src={bothImageDesktop} srcSet={bothImageRetina} />
                            <div className="experience-block-options-both-icons">
                                {Object.entries(blockIcons).map(([key, icon]) => (
                                    <Icon key={key} icon={icon} />
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="experience-block-options-right">
                        <div className="experience-block-options-right-top">
                            {oneOptions.map((option, index) => (
                                <div {...anime(`block-one-${index}`)} className="experience-block-options-item experience-block-options-one" key={index}>
                                    {Object.entries(option).map(([param, value]) => (
                                        <div
                                            key={`${param}-${index}`}
                                            className={`experience-block-options-item experience-block-options-one-${param}`}
                                        >
                                            {value}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                        <div className="experience-block-options-right-bottom">
                            <div {...anime('block-add')} className="experience-block-options-item experience-block-options-add">
                                <div className="experience-block-options-add-text">
                                    Also, with Powermate, <br />you can activate the <br />following additional <br />functionality:
                                </div>
                                <div className="experience-block-options-add-features">
                                    {addFeatures.map(({ icon, text }, index) => (
                                        <div className="experience-block-options-add-features-item" key={index}>
                                            <Icon className="experience-block-options-add-features-item-icon" icon={icon} />
                                            <div className="experience-block-options-add-features-item-text">{text}</div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>        
                </div>
            </div>
        </div>
    )
}

export default PowermateExperience
