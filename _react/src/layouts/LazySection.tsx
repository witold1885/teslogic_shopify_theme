import React, { Suspense, type ReactNode } from 'react'
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

    if (import.meta.env.SSR) {
        return <>{children}</>
    }

    return (
        <div ref={ref} style={{ minHeight: '1px' }}>
            {inView ? (
                <Suspense fallback={null}>
                    {children}
                </Suspense>
            ) : null}
        </div>
    )
}

export default LazySection
