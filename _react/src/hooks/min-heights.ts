import { useMemo, useCallback } from 'react'
import { useInlineStyles } from './inline-styles'

export type SectionHeight = { desktop: number; mobile: number }

export const useMinHeights = (sectionHeights: Record<string, SectionHeight>) => {
    const { isMobile } = useInlineStyles()

    const mode = useMemo(() => !isMobile ? 'desktop' : 'mobile', [isMobile])

    const getMinHeight = useCallback((slug: string) => {
        return sectionHeights[slug][mode] 
             ? `calc(${sectionHeights[slug][mode]} * 100vw / ${mode === 'desktop' ? '1440' : '390'})` 
             : undefined
    }, [sectionHeights, mode])

    return { getMinHeight }
}
