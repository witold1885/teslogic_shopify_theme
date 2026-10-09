import React, { useState, type ReactNode } from 'react'
import './screenmate-dash-using.scss'
import chevron from '../../assets/icons/chevron-right-blue.svg'
import close from '../../assets/icons/close-white.svg'
import { Icon, Popup } from '../Common'

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

const ScreenmateDashUsing: React.FC = () => {
    const [videoPopupOpen, setVideoPopupOpen] = useState<boolean>(false)
    return (<>
        <div id="using"></div>
        <div className="using">
            <div className="using__title">How to use Screenmate Dash</div>
            <div className="using__subtitle">
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
                    <div className={`using__row using__row-${index + 1}`}>
                        <div className="using__row-block">
                            <div className="using__row-legend-number">{index + 1}</div>
                            <div className={`using__row-image using__row-image-desktop using__row-image-${index + 1}`}>
                                <img className="w-full" src={stepImages[index]} alt="" />
                            </div>
                            {/* <div className="using__row-image using__row-image-mobile using__row-image-mobile-1"><img src="{{ 'using_1.svg' | asset_url }}" /></div> */}
                        </div>
                        <div className="using__row-legend-text">{text}</div>
                    </div>
                ))}
            </div>
        </div>
    </>)
}

export default ScreenmateDashUsing
