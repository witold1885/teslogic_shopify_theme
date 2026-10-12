import type React from 'react'
import '../assets/styles/screenmate-dash.scss'
import { mountForShopify } from './mount'
import ProductLayout from '../layouts/ProductLayout'
import ScreenmateDashBanner from '../components/ScreenmateDash/ScreenmateDashBanner'
import ScreenmateDashUsing from '../components/ScreenmateDash/ScreenmateDashUsing'
import ScreenmateDashScreens from '../components/ScreenmateDash/ScreenmateDashScreens'
import ScreenmateDashDevicesSupporting from '../components/ScreenmateDash/ScreenmateDashDevicesSupporting'
import ScreenmateDashSignificant from '../components/ScreenmateDash/ScreenmateDashSignificant'
import ScreenmateDashShortcuts from '../components/ScreenmateDash/ScreenmateDashShortcuts'

const ScreenmateDash: React.FC = () => (
    <ProductLayout className="screenmate-dash">
        <ScreenmateDashBanner />
        <ScreenmateDashUsing />
        <ScreenmateDashScreens />
        <ScreenmateDashDevicesSupporting />
        <ScreenmateDashSignificant />
        <ScreenmateDashShortcuts />
    </ProductLayout>
)

mountForShopify('react-screenmate-dash-root', ScreenmateDash)

export default ScreenmateDash
