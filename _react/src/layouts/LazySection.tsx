import React, { Suspense, type ReactNode } from 'react'
import { useInView } from 'react-intersection-observer'

interface LazySectionProps {
    id?: string | null
    minHeight?: string
    rootMargin?: string
    forceRender?: boolean
    children: ReactNode
}

const LazySection: React.FC<LazySectionProps> = ({ id = null, minHeight = '405px', rootMargin = '202.5px', forceRender = false, children }) => {
    const { ref, inView } = useInView({ triggerOnce: true, rootMargin })

    const isVisible = inView || forceRender

    if (import.meta.env.SSR) return <>{children}</>

    return (
        <div ref={ref} {...(id ? { id } : {})} style={{ minHeight }}>
            {isVisible ? (
                <Suspense fallback={null}>{children}</Suspense>
            ) : null}
        </div>
    )
}

export default LazySection
