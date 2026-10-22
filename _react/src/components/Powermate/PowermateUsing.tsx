import { useMemo, type FC, type ReactNode } from 'react'
import './powermate-using.scss'
import Icon from '../Common/Icon'
import Image from '../Common/Image'
import chevron from '../../assets/icons/chevron-right-blue.svg'

import { mapSimpleConfigs, useAnime, type AnimatedObjectOptions } from '../../hooks/anime'

const animatedObjects: Record<string, AnimatedObjectOptions> = {
    title: { yFrom: '40px', duration: 666 },
    subtitle: { yFrom: '20px', duration: 333 },
    item: { yFrom: '20px', duration: 333 },
}

const stepImageModules: Record<string, any> = import.meta.glob('@/assets/images/powermate/using/pro-using-image*.svg', { eager: true })
const stepImages: string[] = Object.values(stepImageModules).map(mod => mod.default)

interface UsingStep {
    text: ReactNode
}

const steps: UsingStep[] = [
    { text: <>Connect a small Powermate adapter<br />to your car's MCU (computer).</> },
    { text: <>Install and Run Screenmate<br />Dash app on your mobile device.</> },
    { text: <>Turn on Boost / Performance<br />feature in Shortcuts section.</> },
    { text: <>Experience unprecedented increase<br />in power and acceleration speed!</> },
]

const PowermateUsing: FC = () => {
    
    const animationConfigs = useMemo(() => mapSimpleConfigs({
        ...animatedObjects,
        ...steps.reduce((acc, _, index) => ({ ...acc, [`item-${index}`]: animatedObjects.item }), {})
    }), [])

    const { anime } = useAnime(animationConfigs)

    return (
        <div className="using__wrap">
            <div className="using">
                <div className="using__top">
                    <div {...anime('title')} className="using__title">How to use <br className="mobile" />Powermate</div>
                    <div {...anime('subtitle')} className="using__subtitle">
                        <span>Smooth start with soft installation.</span>
                        <a href="/pro-manuals" className="using__manuals-link">
                            Read Manual<Icon icon={chevron} />
                        </a>
                    </div>
                </div>
                <div className="using__content">
                    {steps.map(({ text }, index) => (
                        <div {...anime(`item-${index}`)} className={`using__row using__row-${index + 1}`} key={index}>
                            <div className="using__row-block">
                                <div className="using__row-legend-number">{index + 1}</div>
                                <Image
                                    className={`using__row-image using__row-image-${index + 1}`}
                                    src={stepImages[index]}
                                />
                            </div>
                            <div className="using__row-legend-text">{text}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default PowermateUsing
