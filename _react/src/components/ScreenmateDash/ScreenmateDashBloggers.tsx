import { useMemo, type FC } from 'react'
import './screenmate-dash-bloggers.scss'
import { useAppSelector } from '../../redux/hooks'
import { getVideoId } from '../../redux/yt'
import { fetchContent } from '../../redux/selectors/content'
import Icon from '../Common/Icon'
import Image from '../Common/Image'
import TrackSlider from '../Common/TrackSlider'
import ytPlayIcon from '../../assets/icons/yt-play.svg'

import { mapSimpleConfigs, useAnime, type AnimatedObjectOptions } from '../../hooks/anime'
import { useInlineStyles } from '../../hooks/inline-styles'
import { useDynamicSlice } from '../../hooks/dynamic-slice'
import { useLazyData } from '../../hooks/lazy-data'

const animatedObjects: Record<string, AnimatedObjectOptions> = {
    title: { yFrom: '40px', duration: 666 },
    subtitle: { yFrom: '20px', duration: 333 },
    slider: { yFrom: '20px', duration: 333 },
}

const ScreenmateDashBloggers: FC = () => {
    const { isMobile } = useInlineStyles()

    const { parseYoutubeVideos } = useDynamicSlice('content', () => import('../../redux/slices/content'))
    const { videos, videoItems: items } = useAppSelector(fetchContent)

    const data = useMemo(() => videos?.map(({ url, html }) => ({
        id: getVideoId(url), url, html
    })).filter(({ id }) => !!id) || [], [videos])
    
    const lazyParams = useMemo(() => ({
        condition: data.length !== 0,
        action: parseYoutubeVideos ? () => parseYoutubeVideos(data) : () => {},
        selector: '.bloggers_block'
    }), [data, parseYoutubeVideos])
    
    useLazyData(lazyParams)
    
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
                {items && (
                    <TrackSlider
                        {...anime('slider')}
                        className="bloggers_block__list"
                        items={items.map((item, index) => (
                            <div className="bloggers_block__list-item" key={index}>
                                <a
                                    href={item.url}
                                    target="_blank"
                                    className="bloggers_block__list-item-thumbnail"
                                    style={{ backgroundImage: `url(${item.snippet.thumbnails.high.url})` }}
                                    draggable="false"
                                >
                                    <Icon className="bloggers_block__list-item-thumbnail-yt-icon" icon={ytPlayIcon} />
                                </a>
                                <div className="bloggers_block__list-item-channel">
                                    <div className="bloggers_block__list-item-channel-top">
                                        <Image className="bloggers_block__list-item-channel-thumbnail" src={item.channelSnippet.thumbnails.default.url} />
                                        <span className="bloggers_block__list-item-channel-title">{item.channelSnippet.title}: </span>
                                    </div>
                                    <div className="bloggers_block__list-item-channel-info">						
                                        <span className="bloggers_block__list-item-channel-excerpt">“{item.html}”</span>
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
