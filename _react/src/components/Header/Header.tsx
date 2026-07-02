import React, { useState } from 'react'
import './styles.scss'
import { useAppSelector } from '../../redux/hooks'
import { useScroll } from '../../hooks/scroll'
import { Button, Icon, Image } from '../Common'
import logo from '../../assets/images/logo.svg'
import chevron from '../../assets/icons/chevron-down.svg'

const Header: React.FC = () => {
    const { main_menu } = useAppSelector(state => state.content)
    const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null)
    const scrollOffset = useScroll()

    return (
        <header className={`header ${scrollOffset.y > 0 ? 'sticky' : ''}`}>
            <Image className="header-logo" src={logo} alt="Screenmate" />
            <div className="header-menu flex">
                {main_menu?.map(({ title, children }, index) => (
                    <div
                        key={index}
                        className="header-menu-item"
                        onMouseEnter={() => setOpenMenuIndex(index)}
                        onMouseLeave={() => setOpenMenuIndex(null)}
                    >
                        {index < main_menu.length - 1 ? (<>
                            <span className="header-menu-item-title">{title}</span>
                            {index === 0 && <span className="header-menu-item-new">NEW</span>}
                            <div className="header-menu-item-chevron">
                                <Icon className="flex-center" icon={chevron} />
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
                        </>) : (
                            <Button className="header-menu-item-button">
                                <span>{title}</span>
                            </Button>
                        )}
                    </div>
                ))}
            </div>
        </header>
    )
}

export default Header
