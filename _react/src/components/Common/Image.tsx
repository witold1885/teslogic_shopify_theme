import { forwardRef, type CSSProperties } from 'react'

interface ImageProps {
    className?: string
    style?: CSSProperties
    src: string
    alt?: string
    onClick?: () => void
}

const Image = forwardRef<HTMLDivElement, ImageProps>(({ className = '', style, src, alt = '', onClick }, ref) => {
    const isAbsolute = src.startsWith('http') || src.startsWith('data:')
    const finalSrc = isAbsolute ? src : new URL(src, import.meta.url).href
    
    return (
        <div {...{ref, className, style, onClick}}>
            <img className="object-cover" src={finalSrc} alt={alt} loading="lazy" />
        </div>
    )
})

export default Image
