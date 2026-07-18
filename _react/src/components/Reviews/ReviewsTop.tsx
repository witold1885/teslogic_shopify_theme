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
        <div className="flex-column gap-24 mob:gap-12">
            <div {...anime('top')} className="flex-start-center gap-12">
                <div className="flex-start-center gap-8">
                    {[...Array(5).keys()].map((_, index) => (
                        <Icon className="reviews-star" icon={starIcon} key={index} />
                    ))}
                </div>
                <div className="font-manrope-24 font-500 mob:hidden">Reviews by</div>
                <Icon className="reviews-judgeme" icon={judgeMeLogo} alt="Judge.me" />
            </div>
            <div className="flex-between mob:flex-column mob:gap-32">
                <div {...anime('title')} className="font-manrope-52 mob:font-manrope-32 font-600">
                    Positive feedback <br className="hidden mob:block" />
                    from clients — <br />
                    one of our main tasks
                </div>
                <div {...anime('summary')} className="mob:flex-row mob:flex-start-center mob:gap-26">
                    {isMobile && <Icon className="reviews-star-big" icon={starIcon} />}
                    <div className="flex-column-between gap-12 mob:flex-column-start">
                        <div className="font-manrope-16 font-500">Overall rating</div>
                        <div className="flex mob:flex-center mob:flex-row-reverse gap-16 mob:gap-26">
                            <div className="font-manrope-52 font-500">{avgRating}</div>
                            {!isMobile && <Icon className="reviews-star-big" icon={starIcon} />}
                        </div>
                        <div className="font-manrope-16 font-500">{totalCount} reviews</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ReviewsTop
