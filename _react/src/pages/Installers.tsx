import { useMemo, useCallback, type FC } from 'react'
import '../assets/styles/installers.scss'
import { mountForShopify } from './mount'
import { getComponent } from '../layouts/components'
import InfoLayout from '../layouts/InfoLayout'
import LazySection from '../layouts/LazySection'
import InstallersBanner from '../components/Installers/InstallersBanner'

import { useInlineStyles } from '../hooks/inline-styles'

const sectionHeights: Record<string, any> = {
    InstallersList: { desktop: 1020, mobile: 1444 },
}

const InstallersList = getComponent(() => import('../components/Installers/InstallersList.tsx'))

const Installers: FC = () => {
    const { isMobile } = useInlineStyles()

    const mode = useMemo(() => !isMobile ? 'desktop' : 'mobile', [isMobile])

    const getMinHeight = useCallback((slug: string) => {
        return sectionHeights[slug][mode] 
             ? `calc(${sectionHeights[slug][mode]} * 100vw / ${mode === 'desktop' ? '1440' : '390'})` 
             : undefined
    }, [mode])

    return (
        <InfoLayout className="installers">
            <InstallersBanner />
            <div className="installers-delimiter" />
            {InstallersList && (
                <LazySection minHeight={getMinHeight('InstallersList')} rootMargin="-120px">
                    <InstallersList />
                </LazySection>
            )}
        </InfoLayout>
    )
}

mountForShopify('react-installers-root', Installers)

export default Installers
