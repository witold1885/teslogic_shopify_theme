import { forwardRef, useState, useEffect, useRef, type CSSProperties } from 'react'

interface VideoProps {
    className?: string
    style?: CSSProperties
    src: string
    background?: string
    loop?: boolean
}

const Video = forwardRef<HTMLDivElement, VideoProps>(({ className = '', style, src, background, loop = false }, ref) => {
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

    return (
        <div
            ref={(node) => {
                containerRef.current = node
                if (typeof ref === 'function') ref(node)
                else if (ref) ref.current = node
            }}
            className={className}
            style={{ ...style, background: background ? `url(${background})` : 'transparent' }}
        >
            <video 
                ref={videoRef}
                className="object-cover"
                src={isIntersecting ? src : undefined}
                loop={loop}
                playsInline
                muted
                preload={isIntersecting ? 'auto' : 'none'}
            />
        </div>
    )
})

export default Video
