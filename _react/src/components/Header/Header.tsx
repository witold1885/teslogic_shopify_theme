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

import { getCustomConfig, mapCustomConfigs, useAnime, type AnimatedObjectOptions, type AnimationConfig, type AnimationDirection, type AnimationMode } from '../../hooks/anime'
import { useInlineStyles } from '../../hooks/inline-styles'
import { useScroll } from '../../hooks/scroll'
import { useLockBodyScroll } from '../../hooks/lock-body-scroll'

const animatedObjects: Record<string, AnimatedObjectOptions> = {
    header: { yFrom: '40px', duration: 666 },
    menu: { yFrom: '40px', duration: 666 },
    item: { yFrom: '20px', duration: 333 },
}

const pagesMap: Record<string, string[]> = {
    'Screenmate ONE': ['/screenmate', '/pages/screenmate', '/pages/screenmate-one-react'],
}

interface HeaderProps {
    className?: string
    menu: MenuItem[]
    onOrder?: () => void
}

interface HeaderMenuProps extends HeaderProps {
    mode: 'desktop' | 'mobile'
}

const HeaderMenu: React.FC<HeaderMenuProps> = ({ className = '', menu, mode, onOrder }) => {
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

    // useEffect(() => {
    //     console.log({ prevMenuIndex, openMenuIndex })
    // }, [prevMenuIndex, openMenuIndex])

    // const itemKeys: string[] = useMemo(() => {
    //     const result = []
    //     if (prevMenuIndex) {
    //         result.push(`item-close-${prevMenuIndex}`)
    //     }
    //     if (openMenuIndex) {
    //         result.push(`item-open-${openMenuIndex}`)
    //     }
    //     return result
    // }, [prevMenuIndex, openMenuIndex])

    // const modes: string[] = useMemo(() => {
    //     const result = []
    //     if (prevMenuIndex) result.push('hide')
    //     if (openMenuIndex) result.push(`show`)
    //     return result
    // }, [prevMenuIndex, openMenuIndex])

    // // const itemKey = `item-${position}-${className}`
    // const mode = className === 'transparent' ? 'hide' : 'show'
    // const direction: string = useMemo(() => !prevMenuIndex && openMenuIndex ? 'bottom' : 'top', [prevMenuIndex, openMenuIndex])
    // // const animationConfigs = useMemo(() => mapCustomConfigs({ [itemKey]: animatedObjects.item }, mode, direction), [itemKey])
    // const animationConfigsOld = useMemo(() => mapCustomConfigs(itemKeys.reduce((acc, key) => ({
    //     ...acc,
    //     [key]: animatedObjects.item
    // }), {}), mode, direction), [itemKeys, direction])

    const configs: Record<string, string | AnimationMode | AnimationDirection>[] = useMemo(() => {
        const result = []
        const direction = !prevMenuIndex && openMenuIndex ? 'bottom' : 'top'
        if (prevMenuIndex !== null) {
            result.push({
                key: `item-close-${prevMenuIndex}`,
                mode: 'hide',
                direction
            })
        }
        if (openMenuIndex !== null) {
            result.push({
                key: `item-open-${openMenuIndex}`,
                mode: 'show',
                direction
            })
        }
        return result
    }, [prevMenuIndex, openMenuIndex])

    const { yFrom, duration } = animatedObjects.item

    const animationConfigs = useMemo(() => configs.reduce<Record<string, AnimationConfig>>((acc, { key, mode, direction}) => ({
        ...acc,
        [key]: getCustomConfig(yFrom, duration, mode as AnimationMode, direction as AnimationDirection)
    }), {}), [configs])

    // console.log({ animationConfigsOld, animationConfigsNew })
    console.log({ configs, animationConfigs })

    const { anime } = useAnime(animationConfigs)

    return (
        <div className="flex-end-start gap-28 mob:flex-column-between mob:flex-1 mob:gap-0">
            <div {...{className}}>
                {menu.map(({ title, children }, index) => (
                    <div
                        key={index}
                        className={`header-menu-item ${openMenuIndex === index ? 'active' : ''}`}
                        onMouseEnter={mode === 'desktop' ? () => setOpenMenuIndex(index) : () => {}}
                        onMouseLeave={mode === 'desktop' ? () => setOpenMenuIndex(null) : () => {}}
                        // onClick={mode === 'mobile' ? () => setOpenMenuIndex(prev => prev !== index ? index : null) : () => {}}
                        onClick={mode === 'mobile' ? () => toggleMenuItem(index) : () => {}}
                        {...(mode === 'mobile' ? (
                            index === prevMenuIndex 
                                ? anime(`item-close-${index}`, 'hide') 
                                : (
                                    index === openMenuIndex 
                                        ? anime(`item-open-${index}`, 'show')
                                        : {} 
                                )
                        ) : {})}
                    >
                        <span className="header-menu-item-title">
                            {title}
                            {index === 0 && <span className="header-menu-item-new">NEW</span>}
                        </span>                        
                        <div className="header-menu-item-chevron">
                            <Icon className="flex-center" svg={<ChevronDownIcon color={mode === 'desktop' ? '#FFF' : '#000'} />} />
                        </div>
                        {openMenuIndex === index && children?.length !== 0 && (
                            <ul className="header-menu-item-dropdown">
                                {children?.map((child, i) => (
                                    <li key={i}>
                                        <a href={child.url} target="_blank">{child.title}</a>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                ))}
            </div>
            {(cartItemCount === 0 || mode === 'mobile') ? (
                <Button className="header-menu-button" onClick={onOrder}>
                    <span>ORDER NOW</span>
                </Button>
            ) : (
                <a className="header-menu-cart" href="/cart" target="_blank">
                    <div>
                        <Icon className="w-full h-full flex-center" icon={cartIcon} />
                        <span>{cartItemCount}</span>
                    </div>
                    <span>Cart</span>
                </a>
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
            <a href="/" target="_blank">
                <Image className="header-logo" src={logo} alt="Screenmate" />
            </a>
            {!isMobile 
                ? <HeaderMenu className="header-menu-desktop" mode="desktop" {...{menu, onOrder}} />
                : <Button className="header-menu-mobile-open" onClick={onMobileMenuOpen}>
                    <Icon className="flex-center" icon={burgerIcon} />
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
        <div className="flex-between-center">
            <Image className="header-logo" src={logoBlack} alt="Screenmate" />
            <Icon className="header-menu-mobile-close" icon={closeIcon} onClick={onMobileMenuClose} />
        </div>
        <HeaderMenu className="header-menu-mobile" mode="mobile" {...{menu, onOrder}} />
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

    const mode = useMemo(() => openMobileMenu ? 'show' : 'hide', [openMobileMenu])
    const direction = useMemo(() => openMobileMenu ? 'top' : 'bottom', [openMobileMenu])
    const menuKey = useMemo(() => `menu-${mode}`, [mode])
    const animationConfigs = useMemo(() => mapCustomConfigs({ [menuKey]: animatedObjects.menu }, mode, direction), [menuKey])

    const { anime } = useAnime(animationConfigs)

    useLockBodyScroll(openMobileMenu)

    return (<>
        <HeaderComponent position="absolute" className="absolute" {...headerComponentParams} />
        <HeaderComponent position="sticky" className={isAtTop ? 'hidden' : (isScrolling ? 'sticky' : 'transparent')} {...headerComponentParams} />
        {/* {openMobileMenu && <HeaderMobile {...headerMobileParams} />} */}
        <HeaderMobile {...anime(menuKey, mode)} className={openMobileMenu ? '' : 'transparent'} {...headerMobileParams} />
    </>)
}

export default Header
