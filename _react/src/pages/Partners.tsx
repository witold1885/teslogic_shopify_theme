import type { FC } from 'react'
import '../assets/styles/partners.scss'
import { mountForShopify } from './mount'
import { getComponent } from '../layouts/components'
import InfoLayout from '../layouts/InfoLayout'
import LazySection from '../layouts/LazySection'
import PartnerSections from '../components/Partner/PartnerSections'
import { useInlineStyles } from '../hooks/inline-styles'

const PartnerForm = getComponent(() => import('../components/Partner/PartnerForm'))

const Partners: FC = () => {
    const { isMobile } = useInlineStyles()

    return (
        <InfoLayout className="partners">
            <div className="partners-wrap">
                <div className="partners-head">
                    <h1 className={!isMobile ? 'animate animate-big' : ''}>Become a Screenmate Partner</h1>
                    <p className="animate animate-small">
                        Grow your business by offering Screenmate products to Tesla owners.<br />
                        Join our network of installers, retailers, and distributors.
                    </p>
                </div>
                <div className="partners-content">
                    <PartnerSections />
                    {PartnerForm && (
                        <LazySection>
                            <PartnerForm />
                        </LazySection>
                    )}
                </div>
            </div>
        </InfoLayout>
    )
}

mountForShopify('react-partners-root', Partners)

export default Partners
