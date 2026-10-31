import {
    forwardRef, useState, useRef, useMemo, useCallback, Suspense,
    type CSSProperties, type WheelEvent, type MouseEvent as ReactMouseEvent
} from 'react'
import './track-slider.scss'
import SlickSlider, { type Settings } from './SlickSlider'

const calcPercentage = (value: number, total: number): number => Math.max(0, Math.min(100, (value / total) * 100))

interface TrackSliderProps {
    style?: CSSProperties
    className?: string
    items: any[]
    slidesToShow: number
}

const TrackSlider = forwardRef<HTMLDivElement, TrackSliderProps>(({ style, className, items, slidesToShow }, ref) => {
    const sliderRef = useRef<any>(null)
    const trackRef = useRef<HTMLDivElement>(null)
    const [scrollPercentage, setScrollPercentage] = useState<number>(0)

    const sliderSettings: Settings = {
        dots: false,
        infinite: false,
        arrows: false,
        speed: 500,
        slidesToShow,
        slidesToScroll: 1,
        swipeToSlide: true,
        beforeChange: (_, next) => {
            const maxScrollableSlides = items.length - sliderSettings.slidesToShow!
            if (maxScrollableSlides > 0) {
                setScrollPercentage(calcPercentage(next, maxScrollableSlides))
            }
        }
    }

    const handleWheel = (e: WheelEvent) => {
        if (!sliderRef.current) return
        
        if (e.deltaX !== 0 || e.shiftKey) {
            e.preventDefault()
            const delta = e.deltaX !== 0 ? e.deltaX : e.deltaY
            if (delta > 0) {
                sliderRef.current.slickNext()
            } else {
                sliderRef.current.slickPrev()
            }
        }
    }
    
    const scrollWidth: number = useMemo(() => 100 / items.length, [items])

    const getTargetSlide = useCallback((percentage: number): number => {
        const maxScrollableSlides = items.length - sliderSettings.slidesToShow!
        return Math.round((percentage / 100) * maxScrollableSlides)
    }, [items, sliderSettings])

    const handleTrackClick = (e: ReactMouseEvent<HTMLDivElement>) => {
        if (!trackRef.current || !sliderRef.current || items.length <= 1) return
        if ((e.target as HTMLElement).classList.contains('reviews-slider-scrollbar-thumb')) return

        const rect = trackRef.current.getBoundingClientRect()
        const offsetX = e.clientX - rect.left
        sliderRef.current.slickGoTo(getTargetSlide(calcPercentage(offsetX, rect.width)))
    }
    
    const handleThumbMouseDown = (e: ReactMouseEvent) => {
        e.preventDefault()
        if (!trackRef.current || !sliderRef.current || items.length <= 1) return

        const rect = trackRef.current.getBoundingClientRect()

        const onMouseMove = (moveEvent: MouseEvent) => {
            const currentX = moveEvent.clientX - rect.left
            sliderRef.current.slickGoTo(getTargetSlide(calcPercentage(currentX, rect.width)), true) 
        }

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove)
            document.removeEventListener('mouseup', onMouseUp)
        }

        document.addEventListener('mousemove', onMouseMove)
        document.addEventListener('mouseup', onMouseUp)
    }

    return (
        <div
            ref={ref}
            style={style || {}}
            className={`track-slider-wrap ${className}-wrap animate animate-small`}
            onWheel={handleWheel}
        >
            <Suspense>
                <SlickSlider
                    ref={sliderRef}
                    className={`track-slider ${className}`}
                    {...sliderSettings}
                >
                    {items}
                </SlickSlider>
                <div
                    ref={trackRef}
                    className={`track-slider-scrollbar ${className}-scrollbar`}
                    onClick={handleTrackClick}
                >
                    <div 
                        className={`track-slider-scrollbar-thumb ${className}-scrollbar-thumb`}
                        onMouseDown={handleThumbMouseDown}
                        style={{
                            width: `${scrollWidth}%`,
                            left: `calc(${scrollPercentage}% - (${scrollWidth}% * ${scrollPercentage / 100}))`
                        }} 
                    />
                </div>
            </Suspense>
        </div>
    )
})

export default TrackSlider
