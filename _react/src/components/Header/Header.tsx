import React, { useState, useMemo, useEffect } from 'react'
import './header.scss'
import { useAppSelector } from '../../redux/hooks'
import type { MenuItem } from '../../types/shopify'
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

const HeaderMenu: React.FC<HeaderMenuProps> = ({ className = '', menu, mode, onMobileMenuClose }) => {
    const { cartItemCount } = useAppSelector(state => state.products)
    const { country, countries } = useAppSelector(state => state.content)

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

    const [countriesDropdownOpen, setCountriesDropdownOpen] = useState<boolean>(false)

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
            {mode === 'desktop' && country && (
                <div className="header-menu-country">
                    <div className="header-menu-country-button" onClick={() => setCountriesDropdownOpen(prev => !prev)}>
                        <span>{country.iso_code}&nbsp;{country.currency_symbol}</span>
                        <div className="header-menu-item-chevron">
                            <Icon svg={<ChevronDownIcon />} />
                        </div>
                    </div>
                    {countriesDropdownOpen && (
                        <div className="header-menu-country-dropdown">
                            <div className="header-menu-country-dropdown-list">
                                {countries?.map(({ name, iso_code, currency_code, currency_symbol }) => (
                                    <div className="header-menu-country-dropdown-item" key={iso_code}>
                                        <span>{name}</span>
                                        <span>{currency_code}&nbsp;{currency_symbol}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

interface HeaderComponentProps extends HeaderProps {
    position: 'absolute' | 'sticky'
    isMobile: boolean
    onMobileMenuOpen: () => void
}

const HeaderComponent: React.FC<HeaderComponentProps> = ({ position, className, menu, isMobile, onOrder, onMobileMenuOpen }) => {
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
            {!isMobile 
                ? <HeaderMenu className="header-menu-desktop" mode="desktop" {...{menu, onOrder}} />
                : <Button className="header-menu-mobile-open" onClick={onMobileMenuOpen}>
                    <Icon icon={burgerIcon} />
                </Button>
            }
        </header>
    )
}

interface HeaderMobileProps extends HeaderProps {
    onMobileMenuClose: () => void
}

const HeaderMobile: React.FC<HeaderMobileProps> = ({ className = '', menu, onOrder, onMobileMenuClose }) => (
    <div className={`header-menu-mobile-wrap ${className}`}>
        <div>
            <Image className="header-logo" src={logoBlack} alt="Screenmate" />
            <Icon className="header-menu-mobile-close" icon={closeIcon} onClick={onMobileMenuClose} />
        </div>
        <HeaderMenu className="header-menu-mobile" mode="mobile" {...{menu, onOrder, onMobileMenuClose}} />
    </div>
)

const Header: React.FC<{ onOrder?: () => void }> = ({ onOrder }) => {
    const { isMobile } = useInlineStyles()
    const scrollOffset = useScroll()

    const [openMobileMenu, setOpenMobileMenu] = useState<boolean>(false)

    const { main_menu } = useAppSelector(state => state.content)

    const menu = useMemo(() => {
        return main_menu ? main_menu.filter(({ title }) => title !== 'Buy Now') : []
    }, [main_menu])

    const isScrolling = scrollOffset.y > 0 && scrollOffset.direction === 'up'
    const isAtTop = scrollOffset.y <= 0

    const headerParams = { menu: menu as MenuItem[], onOrder }

    const headerComponentParams = {
        ...headerParams,
        isMobile,
        onMobileMenuOpen: () => setOpenMobileMenu(true)
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
