import { forwardRef, useImperativeHandle, useMemo, useRef, type ReactNode } from 'react'
import { Heading, Video } from '../Common'

import connectDevices from '../../assets/images/screenmate-one/connect-devices.png'
import {
    carPlayAndAndroidAuto as carPlayAndAndroidAutoVideo,
    connectConsoles as connectConsolesVideo
} from '../../assets/videos/screenmate-one'
import {
    carPlayAndAndroidAuto as carPlayAndAndroidAutoBackground,
    connectConsoles as connectConsolesBackground
} from '../../assets/videos/screenmate-one/backgrounds'

import { mapBlocksConfigs, useAnime, type AnimatedObjectOptions } from '../../hooks/anime'

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
    const blockRefs = useRef<Record <string, HTMLDivElement | null>>({})

    const blocks: Record<string, Block> = {
        'familiar-interfaces': {
            heading: <>Familiar Interfaces,<br />Seamlessly Integrated</>,
            title: <>CarPlay & Android&nbsp;Auto</>,
            text: <>
                Quick access to the apps you rely on.<br />
                Connect once and enjoy a familiar<br />
                interface every time you drive.
            </>,
            bodyClassName: 'w-full',
            video: carPlayAndAndroidAutoVideo,
            background: carPlayAndAndroidAutoBackground
        },
        'bigger-entertainment': {
            heading: <>A Bigger Entertainment<br />Experience</>,
            title: <>Connect Consoles<br />and HDMI Devices</>,
            text: <>
                More ways to play, all on the screen you already have. Run<br />
                Android games on the powerful Qualcomm chipset or<br />
                connect your favorite gaming console via HDMI or USB.
            </>,
            bodyClassName: 'w-full flex mob:flex-column-reverse mob:gap-32',
            video: connectConsolesVideo,
            background: connectConsolesBackground,
            sketch: connectDevices,
            info: [
                {title: 'HDMI In', text: <>Connect external media<br />players or consoles to<br />display high-definition<br />video on the screen.</>},
                {title: 'Video In', text: <>Additional video input port.<br />Connects your source device<br />using the compatible video<br />interface cable.</>}
            ]
        }
    }

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
                                    <div className="flex gap-60 mob:w-full mob:flex-center mob:gap-20">
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
