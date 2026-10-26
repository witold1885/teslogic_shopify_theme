import { useMemo, type FC, type ReactNode } from 'react'
import './powermate-compatibility.scss'
import Icon from '../Common/Icon'
import successIcon from '../../assets/icons/powermate/compatibility/pro-combatibility-success-icon.svg'
import warning from '../../assets/icons/powermate/compatibility/pro-combatibility-warning.svg'

import { mapSimpleConfigs, useAnime, type AnimatedObjectOptions } from '../../hooks/anime'

const animatedObjects: Record<string, AnimatedObjectOptions> = {
    title: { yFrom: '40px', duration: 666 },
    block: { yFrom: '20px', duration: 333 },
}

interface CompatibilityBlock {
    title: ReactNode
    options: string[]
}

const compatibilityBlocks: Record<string, CompatibilityBlock> = {
    boost: {
        title: <>Boost<br />compatible with:</>,
        options: [
            'Model 3/Y Long Range Dual Motor',
            'Model 3/Y Standard Range: Only cars with 980 motor and not LFP battery'
        ]
    },
    performance: {
        title: <>
            Performance only <br className="mobile" />compatible <br className="desktop" />
            with AWD <br className="mobile" />cars with 980 motors:
        </>,
        options: [
            'Model 3 Long Range Dual Motor (2017-2019.4)',
            'Some Model Y 7-seaters',
            'Some Model Y Long Range Dual Motor made in Austin',
            'Some Model Y Long Range Dual Motor made in Berlin'
        ]
    }
}

const PowermateCompatibility: FC<{ onCompatibilityCheck: () => void }> = ({ onCompatibilityCheck }) => {
    const animationConfigs = useMemo(() => mapSimpleConfigs({
        ...animatedObjects,
        ...Object.keys(compatibilityBlocks).reduce((acc, key) => ({
            ...acc, [`block-${key}`]: animatedObjects.block
        }), {})
    }), [])

    const { anime } = useAnime(animationConfigs)

    return (
        <div className="compatibility-wrap">
            <div className="compatibility" id="compatibility">
                <div {...anime('title')} className="compatibility-title">Powermate <br className="mobile" />Compatibility</div>
                <div className="compatibility-blocks">
                    {Object.entries(compatibilityBlocks).map(([key, { title, options }]) => (
                        <div {...anime(`block-${key}`)} className={`compatibility-block compatibility-block-${key}`} key={key}>
                            <div className="compatibility-block-title">{title}</div>
                            <div className="compatibility-block-list">
                                {options.map((option, index) => (
                                    <div className="compatibility-block-list-item" key={`${key}-${index}`}>
                                        <Icon className="compatibility-block-list-item-icon" icon={successIcon} />
                                        <div className="compatibility-block-list-item-info">
                                            <div>{option}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                    <div {...anime('block')} className="compatibility-block compatibility-block-check">
                        <div className="compatibility-block-check-info">
                            <Icon className="compatibility-block-check-info-icon" icon={warning} />
                            <div className="compatibility-block-check-info-text">
                                If you're not sure which motor is in <br className="mobile" />your Tesla, use the <br className="desktop" />
                                "Check <br className="mobile" />Compatibility" option and we'll let you <br className="mobile" />know if <br className="desktop" />
                                Performance version can <br className="mobile" />be installed in your vehicle.						
                            </div>
                        </div>
                        <button type="button" className="compatibility-check-button" onClick={onCompatibilityCheck}>
                            <span className="compatibility-check-button-text-desktop">Check Performance Compatibility</span>
                            <span className="compatibility-check-button-text-mobile">Check Compatibility</span>
                        </button>
                    </div>
                </div>                
            </div>
        </div>
    )
}

export default PowermateCompatibility
