import { useState, useEffect, useMemo, type FC } from 'react'
import type { MenuItem } from '../../types/shopify'
import Button from '../Common/Button'
import Icon from '../Common/Icon'
import Image from '../Common/Image'
import logoBlack from '../../assets/images/logo-black.svg'
import closeIcon from '@/assets/icons/close-black.svg'
import ChevronDownIcon from '../../assets/icons/ChevronDownIcon'

import { getCollapseConfig, useAnime, type AnimationConfig, type AnimationMode } from '../../hooks/anime'

const pagesMap: Record<string, string[]> = {
    'Screenmate ONE': ['/', '/screenmate', '/pages/screenmate', '/pages/screenmate-one-react'],
    'Installers': ['/installers', '/pages/installers'],
}

interface HeaderMenuProps {
    theme?: 'dark' | 'light'
    menu: MenuItem[]
    orderButton: boolean
    onOrder: () => void
    onMobileMenuClose: () => void
}

const HeaderMenuMobile: FC<HeaderMenuProps> = ({
    menu,
    orderButton,
    onOrder,
    onMobileMenuClose
}) => {
    const activeMenuIndex = typeof window !== 'undefined' ? useMemo(() => menu.findIndex(
        ({ title }) => pagesMap[title as string]?.includes(window.location.pathname)
    ), [window.location.pathname]) : 0

    const [prevMenuIndex, setPrevMenuIndex] = useState<number | null>(null)
    const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(activeMenuIndex !== -1 ? activeMenuIndex : null)

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
        <div className="header-menu-mobile-wrap">
            <div>
                <Image className="header-logo" src={logoBlack} alt="Screenmate" />
                <Icon className="header-menu-mobile-close" icon={closeIcon} onClick={onMobileMenuClose} />
            </div>
            <div className="header-menu header-menu-mobile">
                <div>
                    {menu.map(({ title, children }, index) => {
                        const isOpen = openMenuIndex === index
                        const isPrev = prevMenuIndex === index

                        const isVisible = isOpen || isPrev

                        return (
                            <div
                                key={index}
                                className={`header-menu-item ${isOpen ? 'active' : ''}`}
                                onClick={() => toggleMenuItem(index)}
                            >
                                <span className="header-menu-item-title">
                                    {title}
                                    {index === 0 && <span className="header-menu-item-new">NEW</span>}
                                </span>
                                <div className="header-menu-item-chevron">
                                    <Icon svg={<ChevronDownIcon color="#000" />} />
                                </div>
                                {children?.length !== 0 && (
                                    <ul
                                        id={`header-menu-item-dropdown-${index}`}
                                        className={`header-menu-item-dropdown ${!isVisible ? 'hidden' : ''}`}
                                        {...(isPrev ? anime(`item-close-${index}`, 'hide') : (
                                            isOpen ? anime(`item-open-${index}`, 'show') : {} 
                                        ))}
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
                {orderButton && (
                    <Button className="header-menu-button" onClick={onOrder}>
                        <span>ORDER NOW</span>
                    </Button>
                )}
            </div>
        </div>
    )
}

export default HeaderMenuMobile
