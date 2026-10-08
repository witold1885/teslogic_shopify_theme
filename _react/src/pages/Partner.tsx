import React, { useMemo } from 'react'
import '../assets/styles/partner.scss'
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

const Partner: React.FC = () => {
    const animationConfigs = useMemo(() => mapSimpleConfigs(animatedObjects), [])
    
    const { anime } = useAnime(animationConfigs)

    return (
        <InfoLayout className="partner">
            <div className="partner-wrap">
                <div className="partner-head">
                    <h1 {...anime('title')}>Become an Authorized <br />Screenmate Partner</h1>
                    <p {...anime('subtitle')}>Expand your business by joining the elite network <br />of installers transforming the Tesla driving experience.</p>
                </div>
                <div className="partner-content">
                    <PartnerSections />
                    <PartnerForm {...anime('form')} />
                </div>
            </div>
        </InfoLayout>
    )
}

mountForShopify('react-partner-root', Partner)

export default Partner
