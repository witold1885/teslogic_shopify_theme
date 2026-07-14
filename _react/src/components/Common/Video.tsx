import { forwardRef, useState, useEffect, useRef, useImperativeHandle, type CSSProperties } from 'react'

interface VideoProps {
    className?: string
    style?: CSSProperties
    src: string
    background?: string
    autoPlay?: boolean
    loop?: boolean
}

export interface VideoRefMethods {
    play: () => Promise<void> | void
    pause: () => void
    el: HTMLDivElement | null
}

const Video = forwardRef<VideoRefMethods, VideoProps>(({ className = '', style, src, background, autoPlay = true, loop = true }, ref) => {
    const isAbsolute = src.startsWith('http') || src.startsWith('data:')
    const finalSrc = isAbsolute ? src : new URL(src, import.meta.url).href

    const [isIntersecting, setIsIntersecting] = useState(false)
    const containerRef = useRef<HTMLDivElement | null>(null)
    const videoRef = useRef<HTMLVideoElement | null>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsIntersecting(true)
                    if (containerRef.current) observer.unobserve(containerRef.current)
                }
            },
            {
                rootMargin: '100px',
                threshold: 0.1
            }
        )

        if (containerRef.current) {
            observer.observe(containerRef.current)
        }

        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (isIntersecting && videoRef.current) {
            videoRef.current.play().catch((error) => {
                console.log(error)
            })
        }
    }, [isIntersecting])

    useImperativeHandle(ref, () => ({
        play: () => {
            if (videoRef.current) {
                videoRef.current.currentTime = 0
                return videoRef.current.play()
            }
        },
        pause: () => {
            if (videoRef.current) {
                videoRef.current.pause()
            }
        },
        el: containerRef.current
    }))

    return (
        <div
            ref={containerRef}
            className={`h-full ${className}`}
            style={{ ...style, ...(background ? { backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}) }}
        >
            <video 
                ref={videoRef}
                className="object-cover"
                src={isIntersecting ? finalSrc : undefined}
                autoPlay={autoPlay}
                loop={loop}
                playsInline
                muted
                preload={isIntersecting ? 'auto' : 'none'}
            />
        </div>
    )
})

export default Video
