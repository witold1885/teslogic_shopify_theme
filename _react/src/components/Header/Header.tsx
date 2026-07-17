import React, { useState, useMemo } from 'react'
import './header.scss'
import { useAppSelector } from '../../redux/hooks'
import type { MenuItem } from '../../types/shopify'
import { Button, Icon, Image } from '../Common'
import logo from '../../assets/images/logo-white.svg'
import logoBlack from '../../assets/images/logo-black.svg'
import cartIcon from '../../assets/icons/cart-white.svg'
import ChevronDownIcon from '../../assets/icons/ChevronDownIcon'
import closeIcon from '@/assets/icons/close-black.svg'

import { mapCustomConfigs, useAnime, type AnimatedObjectOptions } from '../../hooks/anime'
import { useInlineStyles } from '../../hooks/inline-styles'
import { useScroll } from '../../hooks/scroll'

const animatedObjects: Record<string, AnimatedObjectOptions> = {
    header: { yFrom: '40px', duration: 666 },
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

    const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null)

    return (
        <div className="flex-end-center gap-28 mob:flex-column-between mob:flex-1 mob:gap-0">
            <div {...{className}}>
                {menu.map(({ title, children }, index) => (
                    <div
                        key={index}
                        className="header-menu-item"
                        onMouseEnter={mode === 'desktop' ? () => setOpenMenuIndex(index) : () => {}}
                        onMouseLeave={mode === 'desktop' ? () => setOpenMenuIndex(null) : () => {}}
                        onClick={mode === 'mobile' ? () => setOpenMenuIndex(index) : () => {}}
                    >
                        <span className="header-menu-item-title">{title}</span>
                        {index === 0 && <span className="header-menu-item-new">NEW</span>}
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
            {cartItemCount === 0 ? (
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
                : <Button className="header-menu-mobile-open" onClick={onMobileMenuOpen}><span>Menu</span></Button>
            }
        </header>
    )
}

interface HeaderMobileProps extends HeaderProps {
    onMobileMenuClose: () => void
}

const HeaderMobile: React.FC<HeaderMobileProps> = ({ menu, onOrder, onMobileMenuClose }) => (
    <div className="header-menu-mobile-wrap">
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

    return (<>
        <HeaderComponent position="absolute" className="absolute" {...headerComponentParams} />
        <HeaderComponent position="sticky" className={isAtTop ? 'hidden' : (isScrolling ? 'sticky' : 'transparent')} {...headerComponentParams} />
        {openMobileMenu && <HeaderMobile {...headerMobileParams} />}
    </>)
}

export default Header
