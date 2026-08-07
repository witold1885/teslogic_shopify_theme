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
    const finalSrc = isAbsolute ? src : new URL(src, import.meta.url).href + '#t=0.001'

    const [isIntersecting, setIsIntersecting] = useState<boolean>(false)
    const [isLoaded, setIsLoaded] = useState<boolean>(false)

    const containerRef = useRef<HTMLDivElement | null>(null)
    const videoRef = useRef<HTMLVideoElement | null>(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsIntersecting(entry.isIntersecting)
            },
            {
                rootMargin: '100px',
                threshold: 0.01
            }
        )

        if (containerRef.current) {
            observer.observe(containerRef.current)
        }

        return () => observer.disconnect()
    }, [])

    const safePlay = () => {
        const video = videoRef.current
        if (!video) return

        const playPromise = video.play()
        if (playPromise !== undefined) {
            playPromise.then(() => setIsLoaded(true)).catch((error) => {
                if (error.name !== 'AbortError') {
                    console.error('Video play error:', error)
                }
            })
        }
    }

    useEffect(() => {
        const video = videoRef.current
        if (!video) return

        const shouldPlay = isIntersecting && isActive

        if (shouldPlay) {
            if (video.readyState === 0) {
                video.load()
            }
            
            if (autoPlay) {
                safePlay()
            }
        } else {
            video.pause()
            try {
                video.currentTime = 0
            } catch (e) {}
            if (video.readyState > 0) { 
                video.load()
            }
            setIsLoaded(false)
        }
    }, [isIntersecting, isActive, autoPlay])

    useImperativeHandle(ref, () => ({
        play: () => {
            safePlay()
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
                style={{ opacity: isLoaded ? 1 : 0 }}
                loop={loop}
                muted
                {...{ fetchpriority, loop, muted: true } as React.HTMLAttributes<HTMLVideoElement>}
                playsInline
                // @ts-ignore
                playsinline="true"
                // @ts-ignore
                x5-playsinline="true"
                // @ts-ignore
                webkit-playsinline="true"
                // preload="metadata"
                preload={isIntersecting ? 'metadata' : 'none'}
                onCanPlay={() => {
                    if (isIntersecting && isActive && autoPlay) {
                        safePlay()
                    }
                }}
                onPlaying={() => setIsLoaded(true)}
            >
                <source type="video/mp4" src={finalSrc} />
            </video>
        </div>
    )
})

export default Video
