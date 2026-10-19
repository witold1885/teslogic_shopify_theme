import React, { Suspense, useEffect, type ReactNode } from 'react'
import { useInView } from 'react-intersection-observer'

interface LazySectionProps {
    name?: string
    rootMargin?: string
    children: ReactNode
}

const LazySection: React.FC<LazySectionProps> = ({ name = null, rootMargin = '400px 0px', children }) => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        rootMargin,
    })

    useEffect(() => {
        if (name) {
            console.log(`${name}: ${inView}`)
        }
    }, [name, inView])

    if (import.meta.env.SSR) {
        return <>{children}</>
    }

    return (
        <div ref={ref}>
            {inView ? (
                <Suspense fallback={null}>
                    {children}
                </Suspense>
            ) : null}
        </div>
    )
}

export default LazySection
