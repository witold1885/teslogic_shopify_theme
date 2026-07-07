import React, { useState, useMemo } from 'react'
import './styles.scss'
import { useAppSelector } from '../../redux/hooks'
import type { MenuItem } from '../../types/shopify'
import { Button, Icon, Image } from '../Common'
import logo from '../../assets/images/logo.svg'
import logoBlack from '../../assets/images/logo-black.svg'
import cartIcon from '../../assets/icons/cart-white.svg'
import ChevronDownIcon from '../../assets/icons/ChevronDownIcon'
import closeIcon from '@/assets/icons/close-black.svg'

import { mapSimpleConfigs, useAnime, type AnimatedObjectOptions } from '../../hooks/anime'
import { useInlineStyles } from '../../hooks/inline-styles'
import { useScroll } from '../../hooks/scroll'

const animatedObjects: Record<string, AnimatedObjectOptions> = {
    header: { yFrom: '20px', duration: 333 },
}

interface HeaderMenuProps {
    className?: string
    menu: MenuItem[]
    mode: 'desktop' | 'mobile'
    onOrder?: () => void
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
                                        <a href={child.url}>{child.title}</a>
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
                <a className="header-menu-cart" href="/cart">
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

const Header: React.FC<{ onOrder?: () => void }> = ({ onOrder }) => {
    const { isMobile } = useInlineStyles()
    const scrollOffset = useScroll()

    const [openMobileMenu, setOpenMobileMenu] = useState<boolean>(false)

    const { main_menu } = useAppSelector(state => state.content)

    const menu = useMemo(() => {
        return main_menu ? main_menu.filter(({ title }) => title !== 'Buy Now') : []
    }, [main_menu])

    const animationConfigs = useMemo(() => mapSimpleConfigs(animatedObjects), [])
        
    const { anime } = useAnime(animationConfigs)

    return (<>
        <header {...anime('header')} className={`header ${scrollOffset.y > 0 ? 'sticky' : ''}`}>
            <a href="/">
                <Image className="header-logo" src={logo} alt="Screenmate" />
            </a>
            {!isMobile 
                ? <HeaderMenu className="header-menu-desktop" menu={menu as MenuItem[]} mode="desktop" onOrder={onOrder} />
                : <Button className="header-menu-mobile-open" onClick={() => setOpenMobileMenu(true)}><span>Menu</span></Button>
            }
        </header>
        {openMobileMenu && (
            <div className="header-menu-mobile-wrap">
                <div className="flex-between-center">
                    <Image className="header-logo" src={logoBlack} alt="Screenmate" />
                    <Icon className="header-menu-mobile-close" icon={closeIcon} onClick={() => setOpenMobileMenu(false)}/>
                </div>
                <HeaderMenu className="header-menu-mobile" menu={menu as MenuItem[]} mode="mobile" onOrder={onOrder} />
            </div>
        )}
    </>)
}

export default Header
