import React from 'react'
import './screenmate-dash-bloggers.scss'
import { useAppSelector } from '../../redux/hooks'

const ScreenmateDashBloggers: React.FC = () => {
    const { videos } = useAppSelector(state => state.content)

    console.log({ videos })
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
                    <div className="bloggers_block__list-scroller"></div>
                    <div className="bloggers_block__list-scrollbar">
                        <div className="bloggers_block__list-scrollbar-thumb"></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ScreenmateDashBloggers
