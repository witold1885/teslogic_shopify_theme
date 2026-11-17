import { useMemo, type FC } from 'react'
import './screenmate-dash-bloggers.scss'
import { useAppSelector } from '../../redux/hooks'
import { fetchContent } from '../../redux/selectors/content'
import Icon from '../Common/Icon'
import Image from '../Common/Image'
import TrackSlider from '../Common/TrackSlider'
import ytPlayIcon from '../../assets/icons/yt-play.svg'

import { mapSimpleConfigs, useAnime, type AnimatedObjectOptions } from '../../hooks/anime'
import { useInlineStyles } from '../../hooks/inline-styles'

const animatedObjects: Record<string, AnimatedObjectOptions> = {
    title: { yFrom: '40px', duration: 666 },
    subtitle: { yFrom: '20px', duration: 333 },
}

const ScreenmateDashBloggers: FC = () => {
    const { isMobile } = useInlineStyles()

    const { videos } = useAppSelector(fetchContent)
    
    const animationConfigs = useMemo(() => mapSimpleConfigs(animatedObjects), [])

    const { anime } = useAnime(animationConfigs)

    return (
        <div className="bloggers_block">
            <div className="bloggers_block__wrap">
                <div {...anime('title')} className="bloggers_block__title">
                    <span className="bloggers_block__title-bloggers">Bloggers’</span> Verdict
                </div>
                <div {...anime('subtitle')} className="bloggers_block__subtitle">
                    Watch video reviews from popular influencers
                </div>
                {videos && videos.length !== 0 && (
                    <TrackSlider
                        key={`bloggers-slider-${videos.length}`}
                        className="bloggers_block__list"
                        items={videos.map(({ videoUrl, videoCover, channelTitle, channelImage, html }, index) => (
                            <div className="bloggers_block__list-item" key={index}>
                                <a
                                    href={videoUrl}
                                    target="_blank"
                                    className="bloggers_block__list-item-thumbnail"
                                    style={{ backgroundImage: `url(${videoCover})` }}
                                    draggable="false"
                                >
                                    <Icon className="bloggers_block__list-item-thumbnail-yt-icon" icon={ytPlayIcon} />
                                </a>
                                <div className="bloggers_block__list-item-channel">
                                    <div className="bloggers_block__list-item-channel-top">
                                        <Image className="bloggers_block__list-item-channel-thumbnail" src={channelImage} />
                                        <span className="bloggers_block__list-item-channel-title">{channelTitle}:</span>
                                    </div>
                                    <div className="bloggers_block__list-item-channel-info">						
                                        <span className="bloggers_block__list-item-channel-excerpt">“{html}”</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        slidesToShow={!isMobile ? 3 : 1.1438}
                    />
                )}
            </div>
        </div>
    )
}

export default ScreenmateDashBloggers
