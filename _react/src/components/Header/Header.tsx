import React, { useState, useEffect, useRef, useMemo, forwardRef, type RefObject } from 'react'
import './header.scss'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { setCountry } from '../../redux/slices/content'
import type { Country, MenuItem } from '../../types/shopify'
import { Button, Icon, Image } from '../Common'
import logo from '../../assets/images/logo-white.svg'
import logoBlack from '../../assets/images/logo-black.svg'
import cartIcon from '../../assets/icons/cart-white.svg'
import burgerIcon from '../../assets/icons/burger.svg'
import ChevronDownIcon from '../../assets/icons/ChevronDownIcon'
import closeIcon from '@/assets/icons/close-black.svg'

import { getCollapseConfig, mapCustomConfigs, useAnime, type AnimatedObjectOptions, type AnimationConfig, type AnimationMode } from '../../hooks/anime'
import { useInlineStyles } from '../../hooks/inline-styles'
import { useScroll } from '../../hooks/scroll'
import { useLockBodyScroll } from '../../hooks/lock-body-scroll'
import { useOutsideClick } from '../../hooks/outside-click'

const animatedObjects: Record<string, AnimatedObjectOptions> = {
    header: { yFrom: '40px', duration: 666 },
}

const pagesMap: Record<string, string[]> = {
    'Screenmate ONE': ['/', '/screenmate', '/pages/screenmate', '/pages/screenmate-one-react'],
}

interface HeaderProps {
    className?: string
    menu: MenuItem[]
    onOrder?: () => void
}

interface HeaderMenuProps extends HeaderProps {
    mode: 'desktop' | 'mobile'
    onMobileMenuClose?: () => void
}

const HeaderMenu: React.FC<HeaderMenuProps> = ({
    className = '',
    menu,
    mode,
    onMobileMenuClose
}) => {
    const { cartItemCount } = useAppSelector(state => state.products)

    const activeMenuIndex = useMemo(() => menu.findIndex(
        ({ title }) => pagesMap[title as string].includes(window.location.pathname)
    ), [window.location.pathname])

    const [prevMenuIndex, setPrevMenuIndex] = useState<number | null>(null)
    const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(mode === 'mobile' && activeMenuIndex !== -1 ? activeMenuIndex : null)

    const toggleMenuItem = (index: number) => {
        setPrevMenuIndex(openMenuIndex)
        setOpenMenuIndex(prev => prev !== index ? index : null)
    }

    const duration: number = 333

    useEffect(() => {
        if (prevMenuIndex === null) return

        const timer = setTimeout(() => {
            setPrevMenuIndex(null)
        }, duration)

        return () => clearTimeout(timer)
    }, [prevMenuIndex])

    const configs: Record<string, string | AnimationMode>[] = useMemo(() => {
        const result = []
        if (prevMenuIndex !== null) {
            result.push({ key: `item-close-${prevMenuIndex}`, mode: 'hide' })
        }
        if (openMenuIndex !== null) {
            result.push({ key: `item-open-${openMenuIndex}`, mode: 'show' })
        }
        return result
    }, [openMenuIndex])

    const animationConfigs = useMemo(() => configs.reduce<Record<string, AnimationConfig>>((acc, { key, mode }) => ({
        ...acc,
        [key]: { ...getCollapseConfig(duration, mode as AnimationMode), stagger: false }
    }), {}), [configs])

    const { anime } = useAnime(animationConfigs)

    return (
        <div className="header-menu">
            <div {...{className}}>
                {menu.map(({ title, children }, index) => {
                    const isOpen = openMenuIndex === index
                    const isPrev = prevMenuIndex === index

                    const isVisible = mode === 'mobile' ? (isOpen || isPrev) : isOpen

                    return (
                        <div
                            key={index}
                            className={`header-menu-item ${isOpen ? 'active' : ''}`}
                            onMouseEnter={mode === 'desktop' ? () => setOpenMenuIndex(index) : () => {}}
                            onMouseLeave={mode === 'desktop' ? () => setOpenMenuIndex(null) : () => {}}
                            onClick={mode === 'mobile' ? () => toggleMenuItem(index) : () => {}}
                        >
                            <span className="header-menu-item-title">
                                {title}
                                {index === 0 && <span className="header-menu-item-new">NEW</span>}
                            </span>
                            <div className="header-menu-item-chevron">
                                <Icon svg={<ChevronDownIcon color={mode === 'desktop' ? '#FFF' : '#000'} />} />
                            </div>
                            {children?.length !== 0 && (
                                <ul
                                    id={`header-menu-item-dropdown-${index}`}
                                    className={`header-menu-item-dropdown ${!isVisible ? 'hidden' : ''}`}
                                    {...(mode === 'mobile' ? (
                                        isPrev 
                                            ? anime(`item-close-${index}`, 'hide') 
                                            : (
                                                isOpen 
                                                    ? anime(`item-open-${index}`, 'show')
                                                    : {} 
                                            )
                                    ) : {})}
                                >
                                    {children?.map((child, i) => (
                                        <li key={i}>
                                            <a href={child.url}>{child.title}</a>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )
                })}
            </div>
            {(cartItemCount === 0 || mode === 'mobile') ? (
                <a className="header-menu-button" href="/#order-now" onClick={onMobileMenuClose}>
                    <span>ORDER NOW</span>
                </a>
            ) : (
                <a className="header-menu-cart" href="/cart" target="_blank">
                    <div>
                        <Icon icon={cartIcon} />
                        <span>{cartItemCount}</span>
                    </div>
                    <span>Cart</span>
                </a>
            )}
        </div>
    )
}

interface HeaderCountrySelectorProps {
    countriesDropdownOpen: boolean
    onCountriesDropdownToggle: (open?: boolean) => void
    selectedCountry?: Country | null
    onCountrySelect: (country: Country) => void
}

const HeaderCountrySelector = forwardRef<HTMLDivElement, HeaderCountrySelectorProps>(({ 
    countriesDropdownOpen,
    onCountriesDropdownToggle,
    selectedCountry,
    onCountrySelect
}, ref) => {
    const { countries } = useAppSelector(state => state.content)

    return selectedCountry ? (
        <div className="header-country" ref={ref}>
            <div className="header-country-button" onClick={() => onCountriesDropdownToggle()}>
                <span>{selectedCountry.iso_code}&nbsp;{selectedCountry.currency_symbol}</span>
                <div className="header-menu-item-chevron">
                    <Icon svg={<ChevronDownIcon />} />
                </div>
            </div>
            {countriesDropdownOpen && (
                <div className="header-country-dropdown">
                    <div className="header-country-dropdown-list">
                        <div
                            className="header-country-dropdown-item selected"
                            onClick={() => onCountriesDropdownToggle(false)}
                        >
                            <span>{selectedCountry.name}</span>
                            <span>{selectedCountry.currency_code}&nbsp;{selectedCountry.currency_symbol}</span>
                            {selectedCountry.iso_code === 'US' && (
                                <span className="header-country-dropdown-item-note">
                                    Non-EU prices are shown in USD $. Select your EU country to see VAT-inclusive pricing.
                                </span>
                            )}
                        </div>
                        {countries?.filter(({ iso_code }) => iso_code !== selectedCountry?.iso_code).map(country => (
                            <div
                                key={country.iso_code}
                                className="header-country-dropdown-item"
                                onClick={() => onCountrySelect(country)}
                            >
                                <span>{country.name}</span>
                                <span>{country.currency_code}&nbsp;{country.currency_symbol}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    ) : null
})

interface HeaderComponentProps extends HeaderProps, HeaderCountrySelectorProps {
    position: 'absolute' | 'sticky'
    isMobile: boolean
    onMobileMenuOpen: () => void
    countriesDropdownRef: RefObject<HTMLDivElement | null>
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({
    position,
    className,
    menu,
    isMobile,
    onOrder,
    onMobileMenuOpen,
    countriesDropdownRef,
    countriesDropdownOpen,
    onCountriesDropdownToggle,
    selectedCountry,
    onCountrySelect
}) => {
    const headerKey = `header-${position}-${className}`
    const mode = className === 'transparent' ? 'hide' : 'show'
    const direction = position === 'sticky' ? 'top' : 'bottom'
    const animationConfigs = useMemo(() => mapCustomConfigs({ [headerKey]: animatedObjects.header }, mode, direction), [headerKey])

    const { anime } = useAnime(animationConfigs)

    return (
        <header
            {...anime(headerKey, mode)}
            className={`header ${className}`}
        >
            <a href="/">
                <Image className="header-logo" src={logo} alt="Screenmate" />
            </a>
            <div className="header-nav">
                {!isMobile && (
                    <HeaderMenu className="header-menu-desktop" mode="desktop" {...{menu, onOrder}} />
                )}
                <HeaderCountrySelector
                    ref={countriesDropdownRef}
                    {...{countriesDropdownOpen, onCountriesDropdownToggle, selectedCountry, onCountrySelect}}
                />
                {isMobile && (
                    <Button className="header-menu-mobile-open" onClick={onMobileMenuOpen}>
                        <Icon icon={burgerIcon} />
                    </Button>
                )}
            </div>
        </header>
    )
}

interface HeaderMobileProps extends HeaderProps {
    onMobileMenuClose: () => void
}

const HeaderMobile: React.FC<HeaderMobileProps> = ({
    className = '',
    menu,
    onOrder,
    onMobileMenuClose
}) => (
    <div className={`header-menu-mobile-wrap ${className}`}>
        <div>
            <Image className="header-logo" src={logoBlack} alt="Screenmate" />
            <Icon className="header-menu-mobile-close" icon={closeIcon} onClick={onMobileMenuClose} />
        </div>
        <HeaderMenu
            className="header-menu-mobile"
            mode="mobile"
            {...{menu, onOrder}}
        />
    </div>
)

const Header: React.FC<{ onOrder?: () => void }> = ({ onOrder }) => {
    const dispatch = useAppDispatch()
    const { isMobile } = useInlineStyles()
    const scrollOffset = useScroll()

    const [openMobileMenu, setOpenMobileMenu] = useState<boolean>(false)

    const { country: currentCountry, main_menu } = useAppSelector(state => state.content)

    const menu = useMemo(() => {
        return main_menu ? main_menu.filter(({ title }) => title !== 'Buy Now') : []
    }, [main_menu])

    const isScrolling = scrollOffset.y > 0 && scrollOffset.direction === 'up'
    const isAtTop = scrollOffset.y <= 0

    const countriesDropdownRef = useRef<HTMLDivElement | null>(null)
    const [countriesDropdownOpen, setCountriesDropdownOpen] = useState<boolean>(false)
    const [selectedCountry, setSelectedCountry] = useState<Country | null | undefined>(currentCountry)

    const onCountriesDropdownToggle = (open?: boolean) => {
        if (open) setCountriesDropdownOpen(open)
        else setCountriesDropdownOpen(prev => !prev)
    }

    useOutsideClick(countriesDropdownRef, () => {
        if (countriesDropdownOpen) setCountriesDropdownOpen(false)
    })

    const onCountrySelect = (country: Country) => {
        setSelectedCountry(country)
        setCountriesDropdownOpen(false)
        dispatch(setCountry(country))
    }

    const headerParams = { menu: menu as MenuItem[], onOrder }

    const headerComponentParams = {
        ...headerParams,
        isMobile,
        onMobileMenuOpen: () => setOpenMobileMenu(true),
        countriesDropdownRef,
        countriesDropdownOpen,
        onCountriesDropdownToggle,
        selectedCountry,
        onCountrySelect
    }

    const headerMobileParams = {
        ...headerParams,
        onMobileMenuClose: () => setOpenMobileMenu(false)
    }

    useLockBodyScroll(openMobileMenu)

    return (<>
        <HeaderComponent position="absolute" className="absolute" {...headerComponentParams} />
        <HeaderComponent position="sticky" className={isAtTop ? 'hidden' : (isScrolling ? 'sticky' : 'transparent')} {...headerComponentParams} />
        <HeaderMobile className={openMobileMenu ? '' : 'transparent'} {...headerMobileParams} />
    </>)
}

export default Header
