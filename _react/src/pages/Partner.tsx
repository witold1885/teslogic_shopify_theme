import React from 'react'
import '../assets/styles/partner.scss'
import { mountForShopify } from './mount'
import InfoLayout from '../layouts/InfoLayout'
import PartnerSections from '../components/Partner/PartnerSections'
import PartnerForm from '../components/Partner/PartnerForm'

const Partner: React.FC = () => (
    <InfoLayout className="partner">
        <div className="partner-wrap">
            <div className="partner-head">
                <h1>Become an Authorized <br />Screenmate Partner</h1>
                <p>Expand your business by joining the elite network <br />of installers transforming the Tesla driving experience.</p>
            </div>
            <div className="partner-content">
                <PartnerSections />
                <PartnerForm />
            </div>
        </div>
    </InfoLayout>
)

mountForShopify('react-partner-root', Partner)

export default Partner
