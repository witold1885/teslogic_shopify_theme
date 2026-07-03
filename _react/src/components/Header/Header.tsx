import React, { useState, useMemo } from 'react'
import './styles.scss'
import { useAppSelector } from '../../redux/hooks'
import type { MenuItem } from '../../types/shopify'
import { Button, Icon, Image } from '../Common'
import logo from '../../assets/images/logo.svg'
import logoBlack from '../../assets/images/logo-black.svg'
import ChevronDownIcon from '../../assets/icons/ChevronDownIcon'
import closeIcon from '@/assets/icons/close-black.svg'

import { useInlineStyles } from '../../hooks/inline-styles'
import { useScroll } from '../../hooks/scroll'

interface HeaderMenuProps {
    className?: string
    menu: MenuItem[]
    mode: 'desktop' | 'mobile'
}

const HeaderMenu: React.FC<HeaderMenuProps> = ({ className = '', menu, mode }) => {
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
            <Button className="header-menu-button">
                <span>ORDER NOW</span>
            </Button>
        </div>
    )
}

const Header: React.FC = () => {
    const { isMobile } = useInlineStyles()
    const scrollOffset = useScroll()

    const [openMobileMenu, setOpenMobileMenu] = useState<boolean>(false)

    const { main_menu } = useAppSelector(state => state.content)

    const menu = useMemo(() => {
        return main_menu ? main_menu.filter(({ title }) => title !== 'Buy Now') : []
    }, [main_menu])

    return (<>
        <header className={`header ${scrollOffset.y > 0 ? 'sticky' : ''}`}>
            <Image className="header-logo" src={logo} alt="Screenmate" />
            {!isMobile 
                ? <HeaderMenu className="header-menu-desktop" menu={menu as MenuItem[]} mode="desktop" />
                : <Button className="header-menu-mobile-open" onClick={() => setOpenMobileMenu(true)}><span>Menu</span></Button>
            }
        </header>
        {openMobileMenu && (
            <div className="header-menu-mobile-wrap">
                <div className="flex-between-center">
                    <Image className="header-logo" src={logoBlack} alt="Screenmate" />
                    <Icon className="header-menu-mobile-close" icon={closeIcon} onClick={() => setOpenMobileMenu(false)}/>
                </div>
                <HeaderMenu className="header-menu-mobile" menu={menu as MenuItem[]} mode="mobile" />
            </div>
        )}
    </>)
}

export default Header
