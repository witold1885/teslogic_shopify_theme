import React, { forwardRef, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
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
import TrackSlider from '../Common/TrackSlider'

const PER_PAGE: number = 7

interface ReviewItemProps {
    className?: string
    reviewer_name: string
    rating: number
    updated_datetime: string
    body: ReactNode
    hasMaxHeight?: boolean
}

const ReviewItem = forwardRef<HTMLDivElement, ReviewItemProps>(({ className = '', reviewer_name, rating, updated_datetime, body, hasMaxHeight }, ref) => {
    const [open, setOpen] = useState<boolean>(false)

    return (
        <div {...{ref, className}} style={open ? { height: 'auto', maxHeight: 'unset' } : {}}>
            <div className="flex-between">
                <div className="flex-column gap-12 mob:gap-8">
                    <div className="font-manrope-18 mob:font-manrope-16 font-600 text-white">{reviewer_name}</div>
                    <div className="flex gap-4">
                        {[...Array(5).keys()].map((_, index) => (
                            <Icon icon={index < rating ? starBlue : starGrey} key={index} />
                        ))}
                    </div>
                </div>
                <div className="font-manrope-16 text-right whitespace-nowrap">
                    {new Date(updated_datetime).toLocaleDateString('en-US', {
                        month: 'short',
                        day: '2-digit',
                        year: 'numeric'
                    })}
                </div>
            </div>
            <div
                className="item-body h-full flex-1 overflow-hidden-y font-manrope-16"
                style={hasMaxHeight && !open ? {
                    background: 'linear-gradient(180deg, #A3A3A3 73.8%, rgba(102, 102, 102, 0.00) 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                } : {}}
            >
                {body}
            </div>
            {hasMaxHeight && (
                <div className="flex-center">
                    <Icon className="flex-center" style={open ? { transform: 'rotate(180deg)' } : {}} svg={
                        <svg width="13" height="7" viewBox="0 0 13 7" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M0.904297 0.209962C0.723127 0.21042 0.560858 0.273672 0.425781 0.394532C0.285148 0.520374 0.209961 0.684199 0.209961 0.873048C0.210051 1.05336 0.273219 1.21522 0.396484 1.34668L0.407227 1.35742L5.91992 6.43359C6.05802 6.56463 6.22873 6.62988 6.41992 6.62988C6.61044 6.62988 6.7811 6.56565 6.91895 6.43555L12.4326 1.3418L12.4355 1.33984C12.5649 1.21703 12.6298 1.05889 12.6299 0.880859C12.6299 0.695072 12.5535 0.533977 12.4189 0.40625C12.2844 0.278592 12.1197 0.209961 11.9346 0.209961C11.7506 0.210069 11.5882 0.278962 11.4541 0.405274L11.4531 0.404297L6.4209 5.05859L1.3877 0.404298L1.36426 0.382813L1.35254 0.377931C1.22459 0.269605 1.0744 0.209532 0.904297 0.209962Z" fill="#D1D1D1" stroke="#D1D1D1" strokeWidth="0.42" />
                        </svg>
                    } onClick={() => setOpen(prev => !prev)} />
                </div>
            )}
        </div>
    )
})

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
        return [...Array(Math.ceil(totalCount / PER_PAGE)).keys()].map(i => i + 1)
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

    const itemRefs = useRef<Record <number, HTMLDivElement | null>>({})
    const [heights, setHeights] = useState<Record <number, number>>({})
    const [maxHeight, setMaxHeight] = useState<number>(0)

    useEffect(() => {
        if (!isMobile || reviews.length === 0) return

        const handle = requestAnimationFrame(() => {
            const newHeights: Record<number, number> = {}
            let newMaxHeight = -Infinity

            Object.keys(itemRefs.current).forEach((id: any) => {
                const element = itemRefs.current[id]
                if (element) {
                    const height = element.offsetHeight
                    newHeights[id] = height
                    if (height > newMaxHeight) {
                        newMaxHeight = height
                    }
                }
            })

            setHeights(newHeights)
            setMaxHeight(newMaxHeight)
        })

        return () => cancelAnimationFrame(handle)
    }, [reviews, isMobile])
    
    const animationConfigs = useMemo(() => macyInitialized ? items.reduce<Record<string, AnimationConfig>>((acc, { id }) => ({
        ...acc, [`review_${id}`]: getAnimationConfig('20px', 333)
    }), {}) : {}, [items, macyInitialized])
    
    const { anime } = useAnime({ ...animationConfigs, slider: getAnimationConfig('20px', 333) })

    return (
        <div className="flex-column gap-60 mob:gap-40">
            {!isMobile && (<>
                <div ref={containerRef} className="reviews-grid">
                    {items.map(({ id,  ...item}) => (
                        <ReviewItem {...anime(`review_${id}`)} className="reviews-grid-item" {...item} key={id} />
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
            </>)}
            {isMobile && reviews.length !== 0 && (
                <TrackSlider
                    {...anime('slider')}
                    className="reviews-slider"
                    items={reviews.map(({ id,  ...item}) => (
                        <ReviewItem
                            key={id}
                            ref={(el) => {
                                if (el) itemRefs.current[id] = el
                                else delete itemRefs.current[id]
                            }}
                            className="reviews-slider-item"
                            {...item}
                            hasMaxHeight={heights[id] === maxHeight}
                        />
                    ))}
                    slidesToShow={1.148026316}
                />
            )}
        </div>
    )
}

export default ReviewsGrid
