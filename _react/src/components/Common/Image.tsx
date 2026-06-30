import { forwardRef, type CSSProperties } from 'react'

interface ImageProps {
    className?: string
    style?: CSSProperties
    src: string
    alt?: string
    onClick?: () => void
}

const Image = forwardRef<HTMLDivElement, ImageProps>(({ className = '', style, src, alt = '', onClick }, ref) => (
    <div {...{ref, className, style, onClick}}>
        <img className="object-cover" {...{src, alt}} loading="lazy" />
    </div>
))

export default Image
