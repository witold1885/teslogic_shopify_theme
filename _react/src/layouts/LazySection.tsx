import React, { Suspense, type ReactNode } from 'react'
import { useInView } from 'react-intersection-observer'

interface LazySectionProps {
    minHeight?: string
    rootMargin?: string
    children: ReactNode
}

const LazySection: React.FC<LazySectionProps> = ({ minHeight = '200px', rootMargin = '400px 0px', children }) => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        rootMargin,
    })

    if (import.meta.env.SSR) {
        return <>{children}</>
    }

    return (
        <div ref={ref} style={{ minHeight }}>
            {inView ? (
                <Suspense fallback={null}>
                    {children}
                </Suspense>
            ) : null}
        </div>
    )
}

export default LazySection
