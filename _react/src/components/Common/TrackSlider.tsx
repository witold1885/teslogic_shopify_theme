import { forwardRef, useState, useRef, useMemo, Suspense, type WheelEvent, type MouseEvent as ReactMouseEvent } from 'react'
import './track-slider.scss'
import SlickSlider, { type Settings } from './SlickSlider'

interface TrackSliderProps {
    className?: string
    items: any[]
    slidesToShow: number
}

const TrackSlider = forwardRef<HTMLDivElement, TrackSliderProps>(({ className, items, slidesToShow }, ref) => {
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
                let pct = (next / maxScrollableSlides) * 100
                pct = Math.max(0, Math.min(100, pct))
                setScrollPercentage(pct)
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

    const handleTrackClick = (e: ReactMouseEvent<HTMLDivElement>) => {
        if (!trackRef.current || !sliderRef.current || items.length <= 1) return
        if ((e.target as HTMLElement).classList.contains('reviews-slider-scrollbar-thumb')) return

        const rect = trackRef.current.getBoundingClientRect()
        const offsetX = e.clientX - rect.left
        
        let clickPercentage = (offsetX / rect.width) * 100
        clickPercentage = Math.max(0, Math.min(100, clickPercentage))

        const maxScrollableSlides = items.length - sliderSettings.slidesToShow!
        const targetSlide = Math.round((clickPercentage / 100) * maxScrollableSlides)
        
        sliderRef.current.slickGoTo(targetSlide)
    }
    
    const handleThumbMouseDown = (e: ReactMouseEvent) => {
        e.preventDefault()
        if (!trackRef.current || !sliderRef.current || items.length <= 1) return

        const rect = trackRef.current.getBoundingClientRect()
        const maxScrollableSlides = items.length - sliderSettings.slidesToShow!

        const onMouseMove = (moveEvent: MouseEvent) => {
            const currentX = moveEvent.clientX - rect.left
            let dragPercentage = (currentX / rect.width) * 100
            dragPercentage = Math.max(0, Math.min(100, dragPercentage))

            const targetSlide = Math.round((dragPercentage / 100) * maxScrollableSlides)
            sliderRef.current.slickGoTo(targetSlide, true) 
        }

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove)
            document.removeEventListener('mouseup', onMouseUp)
        }

        document.addEventListener('mousemove', onMouseMove)
        document.addEventListener('mouseup', onMouseUp)
    }

    return (
        <div ref={ref} className={`track-slider-wrap ${className}-wrap`} onWheel={handleWheel}>
            <Suspense>
                <SlickSlider ref={sliderRef} className={`track-slider ${className}`} {...sliderSettings}>
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
