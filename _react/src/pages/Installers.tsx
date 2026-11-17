import type { FC } from 'react'
import '../assets/styles/installers.scss'
import { mountForShopify } from './mount'
import { usePreSections, type PreSection } from '../hooks/pre-sections.ts'
import { getComponent } from '../layouts/components'
import InfoLayout from '../layouts/InfoLayout'
import LazySection from '../layouts/LazySection'
import InstallersBanner from '../components/Installers/InstallersBanner'

const preSections: Record<string, PreSection> = {
    InstallersList: { desktop: 1020, mobile: 1444 },
}

const InstallersList = getComponent(() => import('../components/Installers/InstallersList.tsx'))

const Installers: FC = () => {
    const { getPreSectionStyle } = usePreSections(preSections)

    return (
        <InfoLayout className="installers">
            <InstallersBanner />
            <div className="installers-delimiter" />
            {InstallersList && (
                <LazySection
                    {...getPreSectionStyle('InstallersList')}
                    rootMargin="-120px"
                >
                    <InstallersList />
                </LazySection>
            )}
        </InfoLayout>
    )
}

mountForShopify('react-installers-root', Installers)

export default Installers
