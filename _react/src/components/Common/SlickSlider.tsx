import { lazy } from 'react'
import 'slick-carousel/slick/slick.css'
import 'slick-carousel/slick/slick-theme.css'

const Slider = lazy(() =>
    import('react-slick').then(module => ({
        default: (module.default as any).default
    }))
)

const SlickSlider = (Slider as any).default || Slider

export { type Settings } from 'react-slick'

export default SlickSlider
