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
}, ref) => {
    return (
        <h1
            ref={ref}
            className={`heading ${className} ${aurora ? 'relative overflow-hidden' : ''}`}
            style={style}
        >
            {title}
            {aurora && <Aurora />}
        </h1>
    )
})

export default Heading
