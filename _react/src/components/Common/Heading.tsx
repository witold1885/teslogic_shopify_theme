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
    const isFinished = style && (style as any)['--is-finished'] === 1
    return (
        <h1
            ref={ref}
            className={`heading ${className} ${aurora ? 'relative overflow-hidden' : ''}`}
            style={style}
        >
            {title}
            {aurora && isFinished && <Aurora />}
        </h1>
    )
})

export default Heading
