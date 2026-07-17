import React, { type ReactNode } from 'react'
import { useInView } from 'react-intersection-observer'

interface LazySectionProps {
    rootMargin?: string
    children: ReactNode
}

const LazySection: React.FC<LazySectionProps> = ({ rootMargin = '400px 0px', children }) => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        rootMargin,
    })

    return (
        <div ref={ref}>
            {inView ? children : <div style={{ height: '300px' }} />}
        </div>
    )
}

export default LazySection
