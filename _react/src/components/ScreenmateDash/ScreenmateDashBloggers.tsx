import React, { useEffect, useMemo } from 'react'
import './screenmate-dash-bloggers.scss'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { parseYoutubeVideos } from '../../redux/slices/content'
import { getVideoId } from '../../redux/yt'

const ScreenmateDashBloggers: React.FC = () => {
    const dispatch = useAppDispatch()

    const { videos, videoItems: items } = useAppSelector(state => state.content)

    const data = useMemo(() => videos?.map(({ url, html }) => ({
        id: getVideoId(url), url, html
    })).filter(({ id }) => !!id) || [], [videos])

    useEffect(() => {
        dispatch(parseYoutubeVideos(data))
    }, [data])

    console.log({ items })

    return (
        <div className="bloggers_block">
            <div className="bloggers_block__wrap">
                <div className="bloggers_block__title">
                    <span className="bloggers_block__title-bloggers">Bloggers’</span> Verdict
                </div>
                <div className="bloggers_block__subtitle">
                    Watch video reviews from popular influencers
                </div>
                <div className="bloggers_block__list">
                    <div className="bloggers_block__list-scroller">
                        {items?.map((item, index) => (
                            <div className="bloggers_block__list-item" key={index}>
                                <a
                                    href={item.url}
                                    target="_blank"
                                    className="bloggers_block__list-item-thumbnail"
                                    style={{ backgroundImage: `url(${item.snippet.thumbnails.high.url})` }}
                                >                                    
                                    <img draggable="false" className="bloggers_block__list-item-thumbnail-yt-icon" src="{{ 'YT.svg' | asset_url }}" />
                                </a>
                                <div className="bloggers_block__list-item-channel">
                                    <div className="bloggers_block__list-item-channel-top">
                                        <div className="bloggers_block__list-item-channel-thumbnail">
                                            <img src={item.channelSnippet.thumbnails.default.url} />
                                        </div>
                                        <span className="bloggers_block__list-item-channel-title">{item.channelSnippet.title}: </span>
                                    </div>
                                    <div className="bloggers_block__list-item-channel-info">						
                                        <span className="bloggers_block__list-item-channel-excerpt">“{item.html}”</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="bloggers_block__list-scrollbar">
                        <div className="bloggers_block__list-scrollbar-thumb"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ScreenmateDashBloggers
