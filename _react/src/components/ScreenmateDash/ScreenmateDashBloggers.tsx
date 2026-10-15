import React, { useEffect, useMemo } from 'react'
import './screenmate-dash-bloggers.scss'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { parseYoutubeVideos } from '../../redux/slices/content'
import { getVideoId } from '../../redux/yt'
import { useInlineStyles } from '../../hooks/inline-styles'
import { Icon, Image } from '../Common'
import TrackSlider from '../Common/TrackSlider'
import ytPlayIcon from '../../assets/icons/yt-play.svg'

const ScreenmateDashBloggers: React.FC = () => {
    const { isMobile } = useInlineStyles()

    const dispatch = useAppDispatch()

    const { videos, videoItems: items } = useAppSelector(state => state.content)

    const data = useMemo(() => videos?.map(({ url, html }) => ({
        id: getVideoId(url), url, html
    })).filter(({ id }) => !!id) || [], [videos])

    useEffect(() => {
        dispatch(parseYoutubeVideos(data))
    }, [data])

    return (
        <div className="bloggers_block">
            <div className="bloggers_block__wrap">
                <div className="bloggers_block__title">
                    <span className="bloggers_block__title-bloggers">Bloggers’</span> Verdict
                </div>
                <div className="bloggers_block__subtitle">
                    Watch video reviews from popular influencers
                </div>
                {items && (
                    <TrackSlider
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
