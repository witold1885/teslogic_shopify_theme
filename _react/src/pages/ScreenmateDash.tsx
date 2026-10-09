import type React from 'react'
import '../assets/styles/screenmate-dash.scss'
import ProductLayout from '../layouts/ProductLayout'
import ScreenmateDashBanner from '../components/ScreenmateDash/ScreenmateDashBanner'
import ScreenmateDashUsing from '../components/ScreenmateDash/ScreenmateDashUsing'

const ScreenmateDash: React.FC = () => (
    <ProductLayout className="screenmate-dash">
        <ScreenmateDashBanner />
        <ScreenmateDashUsing />
    </ProductLayout>
)

export default ScreenmateDash
