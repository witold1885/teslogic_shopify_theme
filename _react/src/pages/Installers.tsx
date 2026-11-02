import type { FC } from 'react'
import '../assets/styles/installers.scss'
import { mountForShopify } from './mount'
import { getComponent } from '../layouts/components'
import InfoLayout from '../layouts/InfoLayout'
import LazySection from '../layouts/LazySection'
import InstallersBanner from '../components/Installers/InstallersBanner'

const InstallersList = getComponent(() => import('../components/Installers/InstallersList'))

const Installers: FC = () => {
    return (
        <InfoLayout className="installers">
            <InstallersBanner />
            <div className="installers-delimiter" />
            {InstallersList && (
                <LazySection rootMargin="-120px">
                    <InstallersList />
                </LazySection>
            )}
        </InfoLayout>
    )
}

mountForShopify('react-installers-root', Installers)

export default Installers
