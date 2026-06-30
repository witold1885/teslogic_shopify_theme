import React, { useMemo, type ReactNode } from 'react'
import { Heading, Image, Video } from '../Common'

import carPlayAndAndroidAutoImage from '../../assets/images/screenmate-one/car-play-and-android-auto.png'
import { carPlayAndAndroidAuto as carPlayAndAndroidAutoVideo } from '../../assets/videos/screenmate-one'
import connectConsoles from '../../assets/images/screenmate-one/connect-consoles.png'
import connectDevices from '../../assets/images/screenmate-one/connect-devices.png'

import { mapBlocksConfigs, useAnime, type AnimatedObjectOptions } from '../../hooks/anime'

const animatedObjects: Record<string, AnimatedObjectOptions> = {
    heading: { yFrom: '40px', duration: 666 },
    title: { yFrom: '40px', duration: 666 },
    text: { yFrom: '20px', duration: 333 },
    image: { yFrom: '40px', duration: 666 },
    sketch: { yFrom: '40px', duration: 666 },
    info: { yFrom: '20px', duration: 333 },
}

interface Block {
    heading: ReactNode
    title: ReactNode
    text: ReactNode
    image: string
    video?: string
    sketch?: string
    info?: Record<string, ReactNode>[]
}

const ScreenmateOneIntegration: React.FC = () => {
    const blocks: Record<string, Block> = {
        'familiar-interfaces': {
            heading: <>Familiar Interfaces,<br />Seamlessly Integrated</>,
            title: <>CarPlay & Android Auto</>,
            text: <>
                Quick access to the apps you rely on.<br />
                Connect once and enjoy a familiar<br />
                interface every time you drive.
            </>,
            image: carPlayAndAndroidAutoImage,
            video: carPlayAndAndroidAutoVideo
        },
        'bigger-entertainment': {
            heading: <>A Bigger Entertainment<br />Experience</>,
            title: <>Connect Consoles<br />and HDMI Devices</>,
            text: <>
                More ways to play, all on the screen you already have. Run<br />
                Android games on the powerful Qualcomm chipset or<br />
                connect your favorite gaming console via HDMI or USB.
            </>,
            image: connectConsoles,
            sketch: connectDevices,
            info: [
                {title: 'HDMI In', text: <>Connect external media<br />players or consoles to<br />display high-definition<br />video on the screen.</>},
                {title: 'Video In', text: <>Additional video input port.<br />Connects your source device<br />using the compatible video<br />interface cable.</>}
            ]
        }
    }

    const animationConfigs = useMemo(() => mapBlocksConfigs(blocks, animatedObjects), [])

    const { anime } = useAnime(animationConfigs)

    return (
        <div className="screenmate-one__integration">
            {Object.entries(blocks).map(([blockKey, { heading, title, text, image, video, sketch, info }]) => (
                <div className="screenmate-one__integration-block" key={blockKey}>
                    <Heading {...anime(`${blockKey}-heading`)} title={heading} />
                    <div className="w-full flex-wrap flex-between gap-60 mob:gap-32">
                        <div className="w-full flex-between mob:flex-column mob:gap-12">
                            <div {...anime(`${blockKey}-title`)} className="block-title">{title}</div>
                            <div {...anime(`${blockKey}-text`)} className="block-text">{text}</div>
                        </div>
                        <div className="w-full flex mob:flex-column-reverse mob:gap-32">
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
                            {video ? (
                                <Video {...anime(`${blockKey}-image`)} className="screenmate-one__integration-block-video" src={video} background={image} />
                            ) : (image && (
                                <Image {...anime(`${blockKey}-image`)} className="screenmate-one__integration-block-image" src={image} />
                            ))}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ScreenmateOneIntegration
