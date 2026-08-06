import React, { useMemo } from 'react'
import { useAppSelector } from '../../redux/hooks'
import Icon from '../Common/Icon'
import starIcon from '@/assets/icons/star.svg'
import judgeMeLogo from '@/assets/images/logo-judgeme.svg'

import { mapSimpleConfigs, useAnime, type AnimatedObjectOptions } from '../../hooks/anime'
import { useInlineStyles } from '../../hooks/inline-styles'

const animatedObjects: Record<string, AnimatedObjectOptions> = {
    top: { yFrom: '20px', duration: 333 },
    title: { yFrom: '40px', duration: 666 },
    summary: { yFrom: '40px', duration: 666 },
}

const ReviewsTop: React.FC = () => {
    const { isMobile } = useInlineStyles()

    const { totalCount, avgRating } = useAppSelector(state => state.reviews)

    const animationConfigs = useMemo(() => mapSimpleConfigs(animatedObjects), [])
        
    const { anime } = useAnime(animationConfigs)

    return (
        <div className="reviews-top">
            <div {...anime('top')}>
                <div className="reviews-stars">
                    {[...Array(5).keys()].map((_, index) => (
                        <Icon className="reviews-star" icon={starIcon} key={index} />
                    ))}
                </div>
                <span>Reviews by</span>
                <Icon className="reviews-judgeme" icon={judgeMeLogo} alt="Judge.me" />
            </div>
            <div>
                <div {...anime('title')} className="reviews-title">
                    Positive feedback <br className="hidden mob:block" />
                    from clients — <br />
                    one of our main tasks
                </div>
                <div {...anime('summary')} className="reviews-summary">
                    {isMobile && <Icon className="reviews-star-big" icon={starIcon} />}
                    <div className="reviews-summary-info">
                        <div>Overall rating</div>
                        <div>
                            <div>{avgRating}</div>
                            {!isMobile && <Icon className="reviews-star-big" icon={starIcon} />}
                        </div>
                        <div>{totalCount} reviews</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReviewsTop
