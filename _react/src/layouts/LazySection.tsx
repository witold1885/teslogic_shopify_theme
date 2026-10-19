import React, { useState, useEffect, Suspense, type ReactNode } from 'react'
import { useInView } from 'react-intersection-observer'

interface LazySectionProps {
    minHeight?: string
    rootMargin?: string
    children: ReactNode
}

const LazySection: React.FC<LazySectionProps> = ({ minHeight = '405px', rootMargin = '202.5px', children }) => {
    const [shouldRender, setShouldRender] = useState<boolean>(false)
    const { ref, inView } = useInView({ triggerOnce: true, rootMargin })

    useEffect(() => {
        if (inView) {
            if ('requestIdleCallback' in window) {
                window.requestIdleCallback(() => setShouldRender(true))
            } else {
                setTimeout(() => setShouldRender(true), 200)
            }
        }
    }, [inView])

    useEffect(() => {
        console.log({ shouldRender })
    }, [shouldRender])

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
