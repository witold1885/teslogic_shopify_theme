import { useMemo, useCallback } from 'react'
import { useInlineStyles } from './inline-styles'

export type PreSection = { desktop: number; mobile: number; background?: string }

export const usePreSections = (preSections: Record<string, PreSection>) => {
    const { isMobile } = useInlineStyles()

    const mode = useMemo(() => !isMobile ? 'desktop' : 'mobile', [isMobile])

    const getPreSectionStyle = useCallback((slug: string) => ({
        ...(preSections[slug][mode] ? { minHeight: `calc(${preSections[slug][mode]} * 100vw / ${mode === 'desktop' ? '1440' : '390'})` } : {}),
        ...(preSections[slug].background ? { background: preSections[slug].background } : {})
    }), [preSections, mode])

    return { getPreSectionStyle }
}
