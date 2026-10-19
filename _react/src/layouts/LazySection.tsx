import React, { useState, useEffect, Suspense, type ReactNode } from 'react'
import { useInView } from 'react-intersection-observer'

interface LazySectionProps {
    minHeight?: string
    rootMargin?: string
    children: ReactNode
}

const LazySection: React.FC<LazySectionProps> = ({ minHeight = '405px', rootMargin = '202.5px', children }) => {
    const [shouldRender, setShouldRender] = useState(false)
    const { ref, inView } = useInView({ triggerOnce: true, rootMargin })

    useEffect(() => {
        if (inView) {
            if ('requestIdleCallback' in window) {
                const handle = window.requestIdleCallback(() => setShouldRender(true))
                return () => window.cancelIdleCallback(handle)
            } else {
                const timer = setTimeout(() => setShouldRender(true), 500)
                return () => clearTimeout(timer)
            }
        }
    }, [inView])

    if (import.meta.env.SSR) return <>{children}</>

    return (
        <div ref={ref} style={{ minHeight }}>
            {shouldRender ? (
                <Suspense fallback={null}>{children}</Suspense>
            ) : null}
        </div>
    )
}

export default LazySection
