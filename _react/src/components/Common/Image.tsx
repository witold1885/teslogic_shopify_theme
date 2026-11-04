import { forwardRef, type CSSProperties } from 'react'

export interface ImageProps {
    className?: string
    style?: CSSProperties
    src: string
    srcSet?: string
    alt?: string
    loading?: 'eager' | 'lazy'
    fetchPriority?: 'high' | 'auto'
    onClick?: () => void
}

const Image = forwardRef<HTMLDivElement, ImageProps>(({ className = '', style, src, srcSet = null, alt = '', loading = 'lazy', fetchPriority = 'auto', onClick }, ref) => {
    const isAbsolute = src.startsWith('http') || src.startsWith('data:')
    const finalSrc = isAbsolute ? src : new URL(src, import.meta.url).href
    
    return (
        <div className={`image ${className}`} {...{ref, style, onClick}}>
            <img className="object-cover" draggable="false" src={finalSrc} {...(srcSet ? { srcSet } : {})} {...{alt, loading, fetchPriority}} />
        </div>
    )
})

export default Image
