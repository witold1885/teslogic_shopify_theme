import { forwardRef, useState, useEffect, useRef, useImperativeHandle, type CSSProperties } from 'react'

interface VideoProps {
    className?: string
    style?: CSSProperties
    src: string
    background?: string
    fetchpriority?: string
    autoPlay?: boolean
    loop?: boolean
    isActive?: boolean
}

export interface VideoRefMethods {
    play: () => Promise<void> | void
    pause: () => void
    el: HTMLDivElement | null
}

const Video = forwardRef<VideoRefMethods, VideoProps>(({ className = '', style, src, background, fetchpriority = 'auto', autoPlay = true, loop = true, isActive = true }, ref) => {
    const isAbsolute = src.startsWith('http') || src.startsWith('data:')
    const finalSrc = isAbsolute ? src : new URL(src, import.meta.url).href

    const [isIntersecting, setIsIntersecting] = useState(false)
    const [isReadyToPlay, setIsReadyToPlay] = useState(false)

    const containerRef = useRef<HTMLDivElement | null>(null)
    const videoRef = useRef<HTMLVideoElement | null>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsIntersecting(entry.isIntersecting)
            },
            {
                rootMargin: '200px',
                threshold: 0.01
            }
        )

        if (containerRef.current) {
            observer.observe(containerRef.current)
        }

        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        const video = videoRef.current
        if (!video) return

        const shouldLoadAndPlay = isIntersecting && isActive

        if (shouldLoadAndPlay) {
            video.src = finalSrc
            video.load()
            
            if (autoPlay && isReadyToPlay) {
                const playPromise = video.play()
                if (playPromise !== undefined) {
                    playPromise.catch((error) => {
                        if (error.name !== 'AbortError') {
                            console.error('Autoplay failed:', error)
                        }
                    })
                }
            }
        } else {
            video.removeAttribute('src')
            video.load() 
            setIsReadyToPlay(false)
        }
    }, [isIntersecting, isActive, finalSrc, autoPlay, isReadyToPlay])

    useImperativeHandle(ref, () => ({
        play: () => {
            if (videoRef.current && isReadyToPlay) {
                const playPromise = videoRef.current.play()
                if (playPromise !== undefined) {
                    playPromise.catch((error) => {
                        if (error.name !== 'AbortError') {
                            console.error('Manual play failed:', error)
                        }
                    })
                }
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
            className={className}
            style={{ ...style, ...(background ? { backgroundImage: `url(${background})`, backgroundSize: 'cover', backgroundPosition: 'center' } : {}) }}
        >
            <video 
                ref={videoRef}
                className="object-cover"
                style={{ display: isReadyToPlay ? 'block' : 'none' }}
                loop={loop}
                {...{ fetchpriority } as React.HTMLAttributes<HTMLVideoElement>}
                playsInline
                muted
                preload={isIntersecting && isActive ? 'auto' : 'none'}
                onCanPlayThrough={() => setIsReadyToPlay(true)}
            />
        </div>
    )
})

export default Video
