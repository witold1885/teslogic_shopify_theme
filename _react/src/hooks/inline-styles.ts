import { useState, useEffect, useCallback, type CSSProperties } from 'react'

export const mediaDesktop = '(min-width: 577px)'
export const mediaMobile = '(max-width: 576px)'

export const useInlineStyles = () => {
    const [isMobile, setIsMobile] = useState<boolean>(false)

    useEffect(() => {
        const mediaQuery = window.matchMedia(mediaMobile)
        
        setIsMobile(mediaQuery.matches)

        const handler = (e: MediaQueryListEvent) => setIsMobile(e.matches)
        mediaQuery.addEventListener('change', handler)
        
        return () => mediaQuery.removeEventListener('change', handler)
    }, [])

    const responsive = useCallback((styles?: CSSProperties) => {
        return styles ? Object.entries(styles).reduce((acc, [property, value]) => ({
            ...acc,
            [property]: String(value).split(' ').map(part => 
                part.endsWith('px') ? `calc(${part.replace('px', '')} * 100vw / ${!isMobile ? 1440 : 390})` : part
            ).join(' ')
        }), {}) : {}
    }, [isMobile])

    return { isMobile, responsive }
}