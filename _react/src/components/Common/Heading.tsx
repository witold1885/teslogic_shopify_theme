import { forwardRef, type CSSProperties, type ReactNode } from 'react'
import Aurora from './Aurora'

interface HeadingProps {
    className?: string
    title: ReactNode
    aurora?: boolean
    style?: CSSProperties
}

const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(({
    className = '',
    title,
    aurora = true,
    style = {}
}, ref) => (
    <h2
        ref={ref}
        className={`heading ${className}`}
        style={style}
    >
        {title}
        {aurora && <Aurora />}
    </h2>
))

export default Heading
