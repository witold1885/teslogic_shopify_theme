import type React from 'react'
import '../assets/styles/screenmate-dash.scss'
import ProductLayout from '../layouts/ProductLayout'
import ScreenmateDashBanner from '../components/ScreenmateDash/ScreenmateDashBanner'
import ScreenmateDashUsing from '../components/ScreenmateDash/ScreenmateDashUsing'
import ScreenmateDashScreens from '../components/ScreenmateDash/ScreenmateDashScreens'
import ScreenmateDashDevicesSupporting from '../components/ScreenmateDash/ScreenmateDashDevicesSupporting'
import ScreenmateDashSignificant from '../components/ScreenmateDash/ScreenmateDashSignificant'

const ScreenmateDash: React.FC = () => (
    <ProductLayout className="screenmate-dash">
        <ScreenmateDashBanner />
        <ScreenmateDashUsing />
        <ScreenmateDashScreens />
        <ScreenmateDashDevicesSupporting />
        <ScreenmateDashSignificant />
    </ProductLayout>
)

export default ScreenmateDash
