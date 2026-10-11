import type React from 'react'
import '../assets/styles/screenmate-dash.scss'
import ProductLayout from '../layouts/ProductLayout'
import ScreenmateDashBanner from '../components/ScreenmateDash/ScreenmateDashBanner'
import ScreenmateDashUsing from '../components/ScreenmateDash/ScreenmateDashUsing'
import ScreenmateDashScreens from '../components/ScreenmateDash/ScreenmateDashScreens'

const ScreenmateDash: React.FC = () => (
    <ProductLayout className="screenmate-dash">
        <ScreenmateDashBanner />
        <ScreenmateDashUsing />
        <ScreenmateDashScreens />
    </ProductLayout>
)

export default ScreenmateDash
