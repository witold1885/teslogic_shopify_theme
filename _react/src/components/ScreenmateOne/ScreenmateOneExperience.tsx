import { forwardRef, useMemo, type ReactNode } from 'react'
import './screenmate-one-integration.scss'
import { Heading } from '../Common'
import Video from '../Common/Video'

import consoleGamingDesktop from '../../assets/images/screenmate-one/console-gaming-desktop.png'
import consoleGamingMobile from '../../assets/images/screenmate-one/console-gaming-mobile.png'
import {
    connectConsolesDesktop as connectConsolesVideoDesktop,
    connectConsolesMobile as connectConsolesVideoMobile
} from '../../assets/videos/screenmate-one'
import {
    connectConsolesDesktop as connectConsolesBackgroundDesktop,
    connectConsolesMobile as connectConsolesBackgroundMobile
} from '../../assets/videos/screenmate-one/web/screenshots'

import { mapBlocksConfigs, useAnime, type AnimatedObjectOptions } from '../../hooks/anime'
import { useInlineStyles } from '../../hooks/inline-styles'

const animatedObjects: Record<string, AnimatedObjectOptions> = {
    heading: { yFrom: '40px', duration: 666 },
    title: { yFrom: '40px', duration: 666 },
    text: { yFrom: '20px', duration: 333 },
    video: { yFrom: '40px', duration: 666 },
    sketch: { yFrom: '40px', duration: 666 },
    info: { yFrom: '20px', duration: 333 },
}

interface Block {
    heading: ReactNode
    title: ReactNode
    text: ReactNode
    alt?: string
    video?: string
    background?: string
    sketch?: string
    info?: Record<string, ReactNode>[]
}

const getBlocks = (isMobile: boolean) => {
    return {
        'bigger-entertainment': {
            heading: <>A Bigger Entertainment<br />Experience</>,
            title: <>Bring Console Gaming<br />to Your Tesla</>,
            text: <>
                More ways to play, all on the screen you already have. <br />
                Enjoy smooth Android gaming powered by Qualcomm, <br />
                or connect a compatible console through USB-C Video In.
            </>,
            alt: 'Gaming console connected through Screenmate ONE USB-C Video In',
            video: !isMobile ? connectConsolesVideoDesktop : connectConsolesVideoMobile,
            background: !isMobile ? connectConsolesBackgroundDesktop : connectConsolesBackgroundMobile,
            sketch: !isMobile ? consoleGamingDesktop : consoleGamingMobile,
            info: [
                {title: 'USB-C Video In', text: <>Connect compatible gaming consoles and external<br />video devices through the USB-C Video Input.</>},
            ]
        }
    }
}

const ScreenmateOneExperience = forwardRef<HTMLDivElement, {}>(({}, ref) => {
    const { isMobile } = useInlineStyles()

    const blocks: Record<string, Block> = useMemo(() => getBlocks(isMobile), [isMobile])

    const animationConfigs = useMemo(() => mapBlocksConfigs(blocks, animatedObjects), [])

    const { anime } = useAnime(animationConfigs)

    return (
        <div className="screenmate-one__integration" ref={ref}>
            {Object.entries(blocks).map(([blockKey, { heading, title, text, alt, video, background, sketch, info }]) => (
                <div className={`screenmate-one__integration-block ${blockKey}`} key={blockKey}>
                    <Heading {...anime(`${blockKey}-heading`)} title={heading} />
                    <div className="screenmate-one__integration-block-body">
                        <div>
                            <h3 {...anime(`${blockKey}-title`)} className="block-title">{title}</h3>
                            <div {...anime(`${blockKey}-text`)} className="block-text">{text}</div>
                        </div>
                        <div>
                            {sketch && info && (
                                <div className="screenmate-one__integration-block-info">
                                    <div {...anime(`${blockKey}-sketch`)} className="screenmate-one__integration-block-info-sketch">
                                        <img src={sketch} alt={alt} />
                                    </div>
                                    <div className="screenmate-one__integration-block-info-items">
                                        {info.map(({ title, text }, index) => (
                                            <div
                                                key={index}
                                                {...anime(`${blockKey}-info-${index}`)}
                                                className="screenmate-one__integration-block-info-item"
                                            >
                                                <div>{title}</div>
                                                <div>{text}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            {video && (
                                <Video {...anime(`${blockKey}-video`)} className="screenmate-one__integration-block-video" src={video} alt={alt} background={background} />
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
})

export default ScreenmateOneExperience
