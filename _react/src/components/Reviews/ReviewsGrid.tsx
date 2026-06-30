import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useAppSelector } from '../../redux/hooks'
import macy, { type MacyInstance } from 'macy'
import Icon from '../Common/Icon'

import starBlue from '@/assets/icons/star-blue.svg'
import starGrey from '@/assets/icons/star-grey.svg'
import chevronActiveLeft from '@/assets/icons/chevron-active-left.svg'
import chevronInactiveLeft from '@/assets/icons/chevron-inactive-left.svg'
import chevronActiveRight from '@/assets/icons/chevron-active-right.svg'
import chevronInactiveRight from '@/assets/icons/chevron-inactive-right.svg'

import { getAnimationConfig, useAnime, type AnimationConfig } from '../../hooks/anime'
import { useInlineStyles } from '../../hooks/inline-styles'

const PER_PAGE: number = 7

const ReviewsGrid: React.FC = () => {
    const { isMobile } = useInlineStyles()
    const { reviews, totalCount } = useAppSelector(state => state.reviews)

    const containerRef = useRef<HTMLDivElement>(null)
    const macyInstance = useRef<MacyInstance>(null)

    const [macyInitialized, setMacyInitialized] = useState<boolean>(false)
    const [page, setPage] = useState<number>(1)

    useEffect(() => {
        if (containerRef.current) {
            macyInstance.current = macy({
                container: containerRef.current,
                trueOrder: true,
                margin: 24,
                columns: !isMobile ? 2 : 1,
            })

            return () => {
                if (macyInstance.current && typeof macyInstance.current.remove === 'function') {
                    macyInstance.current.remove()
                }
            }
        }
    }, [])

    const pages = useMemo(() => {
        return Array.from({ length: Math.ceil(totalCount / PER_PAGE) }, (_, i) => i + 1)
    }, [totalCount])

    const handlePageChange = (num: number) => {
        if (num >= 1 && num <= pages.length) {
            setPage(num)
            setMacyInitialized(false)
        }
    }

    const items = useMemo(() => {
        return reviews.slice((page - 1) * PER_PAGE, page * PER_PAGE)
    }, [reviews, page])

    useEffect(() => {
        if (macyInstance?.current && items.length > 0) {
            const timer = setTimeout(() => {
                macyInstance?.current?.recalculate(true)
                setMacyInitialized(true)
            }, 50)

            return () => clearTimeout(timer)
        }
    }, [items])
    
    const animationConfigs = useMemo(() => macyInitialized ? items.reduce<Record<string, AnimationConfig>>((acc, { id }) => ({
        ...acc, [`review_${id}`]: getAnimationConfig('20px', 333)
    }), {}) : {}, [items, macyInitialized])
    
    const { anime } = useAnime(animationConfigs)

    return (
        <div className="flex-column gap-60 mob:gap-40">
            <div ref={containerRef} className="reviews-grid">
                {items.map(({ id, reviewer_name, rating, updated_datetime, body }) => (
                    <div
                        {...anime(`review_${id}`)}
                        className="reviews-grid-item"
                        key={id}
                    >
                        <div className="flex-between">
                            <div className="flex-column gap-12 mob:gap-8">
                                <div className="font-manrope-18 mob:font-manrope-16 font-600 text-white">{reviewer_name}</div>
                                <div className="flex gap-4">
                                    {Array.from({ length: 5 }).map((_, index) => (
                                        <Icon icon={index < rating ? starBlue : starGrey} key={index} />
                                    ))}
                                </div>
                            </div>
                            <div className="font-manrope-16 text-right">
                                {new Date(updated_datetime).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: '2-digit',
                                    year: 'numeric'
                                })}
                            </div>
                        </div>
                        <div className="font-manrope-16">{body}</div>
                    </div>
                ))}
            </div>
            {pages?.length !== 0 && (
                <div className="reviews-pagination">
                    <div className={`reviews-pagination-item ${page === 1 ? 'disabled' : ''}`} onClick={() => handlePageChange(page - 1)}>
                        <Icon className="reviews-pagination-nav" icon={page === 1 ? chevronInactiveLeft : chevronActiveLeft} />
                    </div>
                    {pages.map(num => (
                        <div className={`reviews-pagination-item ${num === page ? 'active' : ''}`} key={num} onClick={() => handlePageChange(num)}>{num}</div>
                    ))}
                    <div className={`reviews-pagination-item ${page === pages.length ? 'disabled' : ''}`} onClick={() => handlePageChange(page + 1)}>
                        <Icon className="reviews-pagination-nav" icon={page === pages.length ? chevronInactiveRight : chevronActiveRight} />
                    </div>
                </div>
            )}
        </div>
    )
}

export default ReviewsGrid
