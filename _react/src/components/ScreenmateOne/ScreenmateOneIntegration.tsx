import { forwardRef, useImperativeHandle, useMemo, useRef, type ReactNode } from 'react'
import './screenmate-one-integration.scss'
import { Heading } from '../Common'
import Video from '../Common/Video'

import consoleGamingDesktop from '../../assets/images/screenmate-one/console-gaming-desktop.png'
import consoleGamingMobile from '../../assets/images/screenmate-one/console-gaming-mobile.png'
import {
    carPlayAndAndroidAutoDesktop as carPlayAndAndroidAutoVideoDesktop,
    carPlayAndAndroidAutoMobile as carPlayAndAndroidAutoVideoMobile,
    connectConsolesDesktop as connectConsolesVideoDesktop,
    connectConsolesMobile as connectConsolesVideoMobile
} from '../../assets/videos/screenmate-one'
import {
    carPlayAndAndroidAutoDesktop as carPlayAndAndroidAutoBackgroundDesktop,
    carPlayAndAndroidAutoMobile as carPlayAndAndroidAutoBackgroundMobile,
    connectConsolesDesktop as connectConsolesBackgroundDesktop,
    connectConsolesMobile as connectConsolesBackgroundMobile
} from '../../assets/videos/screenmate-one/screenshots'

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

interface Section {
    getBlock?: (key: string) => HTMLDivElement | null
}

interface Block {
    heading: ReactNode
    title: ReactNode
    text: ReactNode
    bodyClassName?: string
    video?: string
    background?: string
    sketch?: string
    info?: Record<string, ReactNode>[]
}

const ScreenmateOneIntegration = forwardRef<Section, {}>(({}, ref) => {
    const { isMobile } = useInlineStyles()

    const blockRefs = useRef<Record <string, HTMLDivElement | null>>({})

    const blocks: Record<string, Block> = useMemo(() => ({
        'familiar-interfaces': {
            heading: <>Familiar Interfaces,<br />Seamlessly Integrated</>,
            title: <>CarPlay & Android&nbsp;Auto</>,
            text: <>
                Quick access to the apps you rely on.<br />
                Connect once and enjoy a familiar<br />
                interface every time you drive.
            </>,
            bodyClassName: 'w-full',
            video: !isMobile ? carPlayAndAndroidAutoVideoDesktop : carPlayAndAndroidAutoVideoMobile,
            background: !isMobile ? carPlayAndAndroidAutoBackgroundDesktop : carPlayAndAndroidAutoBackgroundMobile
        },
        'bigger-entertainment': {
            heading: <>A Bigger Entertainment<br />Experience</>,
            title: <>Bring Console Gaming<br />to Your Tesla</>,
            text: <>
                More ways to play, all on the screen you already have. <br />
                Enjoy smooth Android gaming powered by Qualcomm, <br />
                or connect a compatible console through USB-C Video In.
            </>,
            bodyClassName: 'w-full flex mob:flex-column-reverse mob:gap-32',
            video: !isMobile ? connectConsolesVideoDesktop : connectConsolesVideoMobile,
            background: !isMobile ? connectConsolesBackgroundDesktop : connectConsolesBackgroundMobile,
            sketch: !isMobile ? consoleGamingDesktop : consoleGamingMobile,
            info: [
                {title: 'USB-C Video In', text: <>Connect compatible gaming consoles and external<br />video devices through the USB-C Video Input.</>},
            ]
        }
    }), [isMobile])

    useImperativeHandle(ref, () => ({
        getBlock: (key: string) => blockRefs.current[key] || null
    }))

    const animationConfigs = useMemo(() => mapBlocksConfigs(blocks, animatedObjects), [])

    const { anime } = useAnime(animationConfigs)

    return (
        <div className="screenmate-one__integration">
            {Object.entries(blocks).map(([blockKey, { heading, title, text, bodyClassName, video, background, sketch, info }]) => (
                <div className={`screenmate-one__integration-block ${blockKey}`} key={blockKey}>
                    <Heading {...anime(`${blockKey}-heading`)} title={heading} />
                    <div ref={(el) => {
                        if (el) blockRefs.current[blockKey] = el
                        else delete blockRefs.current[blockKey]
                    }} className="w-full flex-wrap flex-between gap-60 mob:gap-32">
                        <div className="w-full flex-between mob:flex-column mob:gap-12">
                            <div {...anime(`${blockKey}-title`)} className="block-title">{title}</div>
                            <div {...anime(`${blockKey}-text`)} className="block-text">{text}</div>
                        </div>
                        <div className={bodyClassName}>
                            {sketch && info && (
                                <div className="screenmate-one__integration-block-info">
                                    <div {...anime(`${blockKey}-sketch`)} className="screenmate-one__integration-block-info-sketch">
                                        <img className="h-full" src={sketch} alt="" />
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
                                <Video {...anime(`${blockKey}-video`)} className="screenmate-one__integration-block-video" src={video} background={background} />
                            )}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
})

export default ScreenmateOneIntegration
