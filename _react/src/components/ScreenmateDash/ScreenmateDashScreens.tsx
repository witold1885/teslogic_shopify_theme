import React, { useState, useMemo, Children, type ReactNode, type ReactElement, useRef } from 'react'
import './screenmate-dash-screens.scss'
import './screenmate-dash-pointers.scss'
import Slider, { type Settings } from 'react-slick'
import { useInlineStyles } from '../../hooks/inline-styles'
import { countReactNodeLines } from '../../utils/helpers'
import { Icon } from '../Common'

const screenImageModules: Record<string, any> = import.meta.glob('@/assets/images/screenmate-dash/screens/screens/*.png', { eager: true })
const screenImages: Record<string, any> = Object.entries(screenImageModules).reduce((acc, [key, mod]) => ({
    ...acc,
    [key.replace('/src/assets/images/screenmate-dash/screens/screens/', '').replace('.png', '')]: mod.default
}), {})

const pointerLineModules: Record<string, any> = import.meta.glob('@/assets/icons/screenmate-dash/screens/pointer-*.svg', { eager: true })
const pointerLines: Record<string, any> = Object.entries(pointerLineModules).reduce((acc, [key, mod]) => ({
    ...acc,
    [key.replace('/src/assets/icons/screenmate-dash/screens/pointer-', '').replace('.svg', '')]: mod.default
}), {})

const pointerIconModules: Record<string, any> = import.meta.glob('@/assets/icons/screenmate-dash/screens/icon-*.svg', { eager: true })
const pointerIcons: Record<string, any> = Object.entries(pointerIconModules).reduce((acc, [key, mod]) => ({
    ...acc,
    [key.replace('/src/assets/icons/screenmate-dash/screens/icon-', '').replace('.svg', '')]: mod.default
}), {})

const pointIconModules: Record<string, any> = import.meta.glob('@/assets/icons/point-*.svg', { eager: true })
const pointIcons: Record<string, any> = Object.entries(pointIconModules).reduce((acc, [key, mod]) => ({
    ...acc,
    [key.replace('/src/assets/icons/', '').replace('.svg', '')]: mod.default
}), {})

const markerModules: Record<string, any> = import.meta.glob('@/assets/icons/screenmate-dash/screens/marker-*.svg', { eager: true })
const markers: Record<string, any> = Object.entries(markerModules).reduce((acc, [key, mod]) => ({
    ...acc,
    [key.replace('/src/assets/icons/screenmate-dash/screens/marker-', '').replace('.svg', '')]: mod.default
}), {})

const chevronModules: Record<string, any> = import.meta.glob('@/assets/icons/screenmate-dash/screens/screen-select-*.svg', { eager: true })
const chevrons: Record<string, any> = Object.entries(chevronModules).reduce((acc, [key, mod]) => ({
    ...acc,
    [key.replace('/src/assets/icons/screenmate-dash/screens/screen-select-', '').replace('.svg', '')]: mod.default
}), {})

interface Pointer {
    legend: ReactNode
    position?: string
    line?: string
    icon?: string
}

interface Screen {
	title: string
	text: ReactNode
    pointers: Pointer[]
}

interface Block {
    image: string
    retina: string
    pointers: Pointer[]
}

type Theme = 'light' | 'dark'
type Mode = 'desktop' | 'mobile'

const screenTypes = ['dashboard', 'performance', 'energy-screen', 'car-data', 'map']

const screens: Record<string, Screen> = {
	dashboard: {
		title: 'Dashboard',
		text: <>Easily control the speed, power <br className="mobile" />and battery of your Model 3/Y.</>,
		pointers: [
			{ position: 'top-left', legend: <>Recognizable autopilot, <br />cruise and speed limit <br className="mobile" />indicators</> },
			{ position: 'top-right', legend: <>Monitor your <br />car battery <br className="mobile" />status</> },
			{ position: 'bottom-left', legend: <>Miles saved by <br className="mobile" />regeneration <br className="desktop" />and current <br className="mobile" />energy consumption</> },
			{ position: 'bottom-right', legend: <>Screenmate Dash supports both <br className="mobile" />the SI and Imperial <br className="mobile" />measurement <br className="desktop" />systems, <br className="mobile" />synchronizing it with the <br className="mobile" />main Tesla interface</> },
		]
	},
	performance: {
		title: 'Performance',
		text: <>Experience the performance mode <br className="mobile" />data even if you are driving.</>,
		pointers: [
			{ position: 'top-left', legend: <>G-sensor shows changes <br />in the direction of <br className="mobile" />acceleration</> },
			{ position: 'top-right', legend: <>The best <br className="mobile" />performance <br className="desktop" />during <br className="mobile" />your current trip</> },
			{ position: 'bottom-left', legend: <>To reach best results <br className="mobile" />battery should <br className="desktop" />be neither <br className="mobile" />cold, nor overheated</> },
			{ position: 'bottom-right', legend: <>Current used <br />horsepower value</> },
		]
	},
	'energy-screen': {
		title: 'Energy screen',
		text: <>Detailed pictures of how different <br className="mobile" />vehicle systems consume power.</>,
		pointers: [
			{ position: 'top-left', legend: <>Green color highlights <br />energy consumers in real <br className="mobile" />time</> },
			{ position: 'top-right', legend: <>Look at the battery power <br className="mobile" />distribution <br className="desktop" />map and try to <br className="mobile" />optimize consumption</> },
			{ position: 'bottom-left', legend: <>Orange color highlights <br className="mobile" />energy <br className="desktop" />suppliers in real <br className="mobile" />time</> },
			{ position: 'bottom-right', legend: <>It also shows the percentage <br className="mobile" />and kilowatts of energy <br className="desktop" />spent <br className="mobile" />by each consumer during the <br className="mobile" />last trip</> },
		]
	},
	'car-data' : {
		title: 'Car Data',
		text: <>Get and share all needed <br className="mobile" />info about your car.</>,
		pointers: [
			{ position: 'top-left', legend: <>Get complete <br className="mobile" />unique <br className="desktop" />info about <br className="mobile" />your car</> }, 
			{ position: 'top-right', legend: <>Share the info with your <br />friends on social <br className="mobile" />networks</> }, 
			{ position: 'bottom-left', legend: <>Access battery <br className="mobile" />data <br className="desktop" />hidden in <br className="mobile" />the system</> }, 
		]
	},
	map: {
		title: 'Map and Nav',
		text: <>Plan your route and conveniently <br className="mobile" />follow it along the way.</>,
		pointers: [
			{ position: 'top-left', legend: <>Follow the route <br className="mobile" />without taking <br className="desktop" />your <br className="mobile" />attention off the road</> }, 
			{ position: 'bottom-left', legend: <>Screenmate Dash utilizes Google's <br />map and navigation</> }, 
			{ position: 'bottom-right', legend: <>All important <br className="mobile" />indicators, such as <br />self-drive mode and <br className="mobile" />others, remain visible</> }, 
		]
	}
}

const ScreenSwitcher: React.FC<{ theme: Theme, onChangeTheme: (key: Theme) => void }> = ({ theme, onChangeTheme }) => {
	const switcher = useMemo(() => (['light', 'dark'] as Theme[]).map(key => ({
		key,
		className: `screens__top-switcher-item screens__top-switcher-item-${key} ${key === theme ? 'active': ''}`,
		label: key.charAt(0).toUpperCase() + key.slice(1),
		onClick: () => onChangeTheme(key)
	})), [theme, onChangeTheme])
	
	return (
		<div className="screens__top-switcher">
			{switcher.map(({ key, label, ...item }) => <div key={key} {...item}>{label}</div>)}
		</div>
	)
}

const ScreenDots: React.FC<{ dots: ReactNode; theme: Theme }> = ({ dots, theme }) => (
	<div className="screens__select">
		{(Children.toArray(dots) as ReactElement[]).map(({ props }, i) => {
			const { className, children } = props as any
			const isActive = className?.includes('active')
			const { title, text } = screens[screenTypes[i]] || {}

			return (
				<div 
					key={i}
					className={`screens__select-item ${theme} ${isActive ? 'active' : ''}`}
					onClick={children.props.onClick}
				>
					<img
						className={`screens__select-item-marker`}
						src={markers[`${theme}${isActive ? '-active' : ''}`]}
					/>
					<div className="screens__select-item-title">{title}</div>
					<div className="screens__select-item-text">{text}</div>             
				</div>
			)
		})}
	</div>
)

const ScreenmateDashScreens: React.FC = () => {
    const { isMobile } = useInlineStyles()

    const [theme, setTheme] = useState<Theme>('light')
	const mode: Mode = useMemo(() => !isMobile ? 'desktop' : 'mobile', [isMobile])

	const blocks = useMemo(() => Object.entries(screens).reduce<Record<string, Block>>((acc, [type, { pointers }], index) => {
		acc[type] = {
            image: screenImages[`${index + 1}-${mode}-${theme}`],
            retina: screenImages[`${index + 1}-${mode}-retina-${theme}`],
			pointers: pointers.map(({ position, legend }) => {
				const slug = `${type}-${position}-${theme}-${mode}`
				return { position, legend, line: pointerLines[slug], icon: pointerIcons[slug] }
			})
		}
		return acc
	}, {}), [theme, mode])

	const [currentScreenIndex, setCurrentScreenIndex] = useState<number>(0)

	const SlickSlider = (Slider as any).default || Slider

	const sliderRef = useRef<any>(null)
	
	const sliderSettings: Settings = useMemo(() => ({
		dots: true,
		infinite: true,
		fade: true,
		arrows: false,
		speed: 500,
		slidesToShow: 1,
		slidesToScroll: 1,
		swipeToSlide: true,
		waitForAnimate: false,
		dotsClass: 'screens__select',
		appendDots: dots => <ScreenDots {...{dots, theme}} />,
        beforeChange: (_, next) => setCurrentScreenIndex(next)
	}), [theme])

	return (
		<div className={`screens ${theme}`} id="features">
			<div className="screens__bg"></div>
			<div className="screens__wrap">
				<div className="screens__top">
					<div className="screens__top-title">
						<span className="screens__top-title-primary">Switch between five screens</span>{isMobile && <>&nbsp;</>}
						<span className="screens__top-title-secondary">and explore your car</span>{isMobile && <>&nbsp;</>}
						<span className="screens__top-title-secondary">with Screenmate Dash</span>
					</div>
					{!isMobile && <ScreenSwitcher theme={theme} onChangeTheme={setTheme} />}
				</div>
				<SlickSlider ref={sliderRef} {...sliderSettings}>
					{Object.entries(blocks).map(([key, { image, retina, pointers }]) => (
						<div className="screens__features-block" key={key}>
							<div className="screens__features-image-wrap">
								<img
									draggable="false"
									className={`screens__features-image ${theme} ${mode}`}
									src={image}
									srcSet={`${retina} 2x`}
									loading="lazy"
								/>
							</div>
							{pointers.map(({ position, legend, line, icon }) => {
								const slug = `${key}-${position}`
								const classNames = [...(position?.split('-') || []), slug].map(suffix => `pointer-${suffix}`).join(' ')
								const lines = countReactNodeLines(legend, mode)
								return (
									<div className={`pointer ${classNames}`} key={slug}>
										<div className="pointer-wrap">
											<div className={`pointer-legend ${mode} lines-${lines}`}>{legend}</div>
											<img className={`pointer-line ${mode}`} src={line} />
											<img className={`pointer-icon ${mode}`} src={icon} />
											<img className="pointer-point" src={pointIcons[`point-${theme}`]} />
										</div>
									</div>
								)
							})}
						</div>
					))}
				</SlickSlider>
				{isMobile && currentScreenIndex !== undefined && (
					<div className="screens__selected">
						<Icon className="screens__selected-nav screens__selected-nav-prev" icon={chevrons[`prev-${theme}`]} onClick={() => sliderRef?.current?.slickPrev()} />
						<div className="screens__selected-item">
							<div className="screens__selected-item-title">{screens[screenTypes[currentScreenIndex]].title}</div>
							<div className="screens__selected-item-text">{screens[screenTypes[currentScreenIndex]].text}</div>
						</div>
						<Icon className="screens__selected-nav screens__selected-nav-next" icon={chevrons[`next-${theme}`]} onClick={() => sliderRef?.current?.slickNext()} />
					</div>
				)}
				{isMobile && <ScreenSwitcher theme={theme} onChangeTheme={setTheme} />}
			</div>
		</div>
	)
}

export default ScreenmateDashScreens
