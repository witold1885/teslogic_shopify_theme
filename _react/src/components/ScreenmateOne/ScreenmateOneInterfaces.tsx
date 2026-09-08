import { forwardRef, useMemo, type ReactNode } from 'react'
import './screenmate-one-integration.scss'
import { Heading } from '../Common'
import Video from '../Common/Video'

import {
    carPlayAndAndroidAutoDesktop as carPlayAndAndroidAutoVideoDesktop,
    carPlayAndAndroidAutoMobile as carPlayAndAndroidAutoVideoMobile
} from '../../assets/videos/screenmate-one'
import {
    carPlayAndAndroidAutoDesktop as carPlayAndAndroidAutoBackgroundDesktop,
    carPlayAndAndroidAutoMobile as carPlayAndAndroidAutoBackgroundMobile
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
        'familiar-interfaces': {
            heading: <>Familiar Interfaces,<br />Seamlessly Integrated</>,
            title: <>CarPlay & Android&nbsp;Auto for Tesla</>,
            text: <>
                Quick access to the apps you rely on.<br />
                Connect once and enjoy a familiar<br />
                interface every time you drive.
            </>,
            alt: 'Apple CarPlay and Android Auto on a Tesla display',
            video: !isMobile ? carPlayAndAndroidAutoVideoDesktop : carPlayAndAndroidAutoVideoMobile,
            background: !isMobile ? carPlayAndAndroidAutoBackgroundDesktop : carPlayAndAndroidAutoBackgroundMobile
        }
    }
}

const ScreenmateOneInterfaces = forwardRef<HTMLDivElement, {}>(({}, ref) => {
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

export default ScreenmateOneInterfaces
