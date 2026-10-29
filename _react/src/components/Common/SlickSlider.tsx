import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'
import { getComponent } from '../../layouts/components'

const Slider = getComponent(() =>
    import('react-slick').then(module => ({
        default: (module.default as any).default || module.default
    }))
)

const SlickSlider = (Slider as any).default || Slider

export { type Settings } from 'react-slick'

export default SlickSlider
