import { forwardRef, useMemo } from 'react'
import './screenmate-one-dash.scss'
import Image from '../Common/Image'
import Icon from '../Common/Icon'
import dashImage from '../../assets/images/screenmate-one/dash-image.png'
import ArrowTopRightBlueIcon from '../../assets/icons/ArrowTopRightBlueIcon'

import { mapSimpleConfigs, useAnime, type AnimatedObjectOptions } from '../../hooks/anime'

const animatedObjects: Record<string, AnimatedObjectOptions> = {
    body: { yFrom: '40px', duration: 666 },
    badge: { yFrom: '20px', duration: 333 },
    title: { yFrom: '20px', duration: 333 },
    texts: { yFrom: '20px', duration: 333 },
    link: { yFrom: '20px', duration: 333 },
    image: { yFrom: '40px', duration: 666 },
}

const ScreenmateOneDash = forwardRef<HTMLDivElement, {}>(({}, ref) => {

    const animationConfigs = useMemo(() => mapSimpleConfigs(animatedObjects), [])
        
    const { anime } = useAnime(animationConfigs)

    return (
        <div ref={ref} className="screenmate-one__dash">
            <div {...anime('body')} className="screenmate-one__dash-body">
                <div className="screenmate-one__dash-body-info">
                    <div className="screenmate-one__dash-body-info-texts">
                        <div className="screenmate-one__dash-body-info-texts-heading">
                            <div {...anime('badge')} className="screenmate-one__dash-body-info-texts-heading-badge">
                                <span>A Must-Have App for Tesla 3/Y Drivers</span>
                            </div>
                            <div {...anime('title')} className="screenmate-one__dash-body-info-texts-heading-title">A complete driver display setup</div>
                        </div>
                        <div {...anime('texts')} className="screenmate-one__dash-body-info-texts-description">
                            Screenmate ONE comes with native support for <br />
                            Screenmate Dash. Turn your phone into a clean <br />
                            instrument cluster in your line of sight, with five <br />
                            customizable screens and quick switching using <br />
                            the steering wheel selector.
                        </div>
                    </div>
                    <a {...anime('link')} className="screenmate-one__dash-body-info-link" href="/dash" target="_blank">
                        <span>Learn more about Screenmate Dash</span>
                        <Icon svg={<ArrowTopRightBlueIcon />} />
                    </a>
                </div>
                <Image {...anime('image')} className="screenmate-one__dash-body-image" src={dashImage} />
            </div>
        </div>
    )
})

export default ScreenmateOneDash
