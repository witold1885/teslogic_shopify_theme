import React, { useMemo } from 'react'
import '../assets/styles/partners.scss'
import { mountForShopify } from './mount'
import InfoLayout from '../layouts/InfoLayout'
import PartnerSections from '../components/Partner/PartnerSections'
import PartnerForm from '../components/Partner/PartnerForm'
import { mapSimpleConfigs, useAnime, type AnimatedObjectOptions } from '../hooks/anime'

const animatedObjects: Record<string, AnimatedObjectOptions> = {
    title: { yFrom: '40px', duration: 666 },
    subtitle: { yFrom: '20px', duration: 333 },
    form: { yFrom: '20px', duration: 333 },
}

const Partners: React.FC = () => {
    const animationConfigs = useMemo(() => mapSimpleConfigs(animatedObjects), [])
    
    const { anime } = useAnime(animationConfigs)

    return (
        <InfoLayout className="partners">
            <div className="partners-wrap">
                <div className="partners-head">
                    <h1 {...anime('title')}>Become a Screenmate Partner</h1>
                    <p {...anime('subtitle')}>
                        Grow your business by offering Screenmate products to Tesla owners.<br />
                        Join our network of installers, retailers, and distributors.
                    </p>
                </div>
                <div className="partners-content">
                    <PartnerSections />
                    <PartnerForm {...anime('form')} />
                </div>
            </div>
        </InfoLayout>
    )
}

mountForShopify('react-partners-root', Partners)

export default Partners
