import { useMemo, useState, type ReactNode, type FC } from 'react'
import './screenmate-dash-using.scss'
import { Icon, Image, Popup } from '../Common'
import chevron from '../../assets/icons/chevron-right-blue.svg'
import close from '../../assets/icons/close-white.svg'

import { mapSimpleConfigs, useAnime, type AnimatedObjectOptions } from '../../hooks/anime'

const animatedObjects: Record<string, AnimatedObjectOptions> = {
    title: { yFrom: '40px', duration: 666 },
    subtitle: { yFrom: '20px', duration: 333 },
    item: { yFrom: '20px', duration: 333 },
}

const stepImageModules: Record<string, any> = import.meta.glob('@/assets/images/screenmate-dash/using/using_*.svg', { eager: true })
const stepImages: string[] = Object.values(stepImageModules).map(mod => mod.default)

interface UsingStep {
    text: ReactNode
}

const steps: UsingStep[] = [
    { text: <>Connect a small Screenmate Dash <br />transmitter to your vehicle.</> },
    { text: <>Install magnetic phone holder <br />with optional charger.</> },
    { text: <>Run Screenmate Dash app on your <br />iPhone, iPad or any Android device.</> },
    { text: <>Turn your phone into a convenient <br />and functional dashboard.</> },
]

const ScreenmateDashUsing: FC = () => {
    const [videoPopupOpen, setVideoPopupOpen] = useState<boolean>(false)
    
    const animationConfigs = useMemo(() => mapSimpleConfigs({
        ...animatedObjects,
        ...steps.reduce((acc, _, index) => ({ ...acc, [`item-${index}`]: animatedObjects.item }), {})
    }), [])

    const { anime } = useAnime(animationConfigs)

    return (<>
        <div id="using"></div>
        <div className="using">
            <div {...anime('title')} className="using__title">How to use Screenmate Dash</div>
            <div {...anime('subtitle')} className="using__subtitle">
                <span>Smooth start with soft installation.</span>
                <a onClick={() => setVideoPopupOpen(true)}>
                    Watch Video<Icon icon={chevron} />
                </a>
            </div>
            <Popup open={videoPopupOpen} onClose={() => setVideoPopupOpen(false)}>
                <div className="using__video-popup-close" onClick={() => setVideoPopupOpen(false)}>
                    <Icon icon={close} />
                </div>
                <div className="using__video manuals__video">
                    <iframe
                        title="Screenmate Dash Installation Guide | Tesla Model 3 (2021+)"
                        src="https://www.youtube.com/embed/iCKNAsNVlRk"
                        height="720"
                        width="1280"
                        allow="fullscreen; accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        frameBorder="0"
                    />
                </div>
            </Popup>
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
    </>)
}

export default ScreenmateDashUsing
