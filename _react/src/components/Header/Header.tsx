import { useState, useEffect, useRef, useMemo, useCallback, type FC } from 'react'
import './header.scss'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { setCountry } from '../../redux/slices/content'
import { fetchContent } from '../../redux/selectors/content'
import type { Country, MenuItem } from '../../types/shopify'
import { getComponent } from '../../layouts/components'
import HeaderMenuDesktop from './HeaderMenuDesktop'
import HeaderCountrySelector, { type HeaderCountrySelectorProps } from './HeaderCountrySelector'
import Button from '../Common/Button'
import Icon from '../Common/Icon'
import logo from '../../assets/images/logo-white.svg'
import logoBlack from '../../assets/images/logo-black.svg'
import burgerIcon from '../../assets/icons/burger.svg'

import { useScroll } from '../../hooks/scroll'
import { useLockBodyScroll } from '../../hooks/lock-body-scroll'
import { useOutsideClick } from '../../hooks/outside-click'

const HeaderMenuMobile = getComponent(() => import('./HeaderMenuMobile.tsx'), true)

interface HeaderProps {
    theme?: 'dark' | 'light'
    className?: string
    menu: MenuItem[]
    orderButton: boolean
    onOrder?: () => void
}

interface HeaderComponentProps extends HeaderProps, HeaderCountrySelectorProps {
    position: 'absolute' | 'sticky'
    onMobileMenuOpen: () => void
    countriesDropdownRef: (el: HTMLDivElement | null) => void
}

const HeaderComponent: FC<HeaderComponentProps> = ({
    theme = 'dark',
    orderButton = true,
    position,
    className,
    menu,
    onOrder,
    onMobileMenuOpen,
    countriesDropdownRef,
    countriesDropdownOpen,
    onCountriesDropdownToggle,
    regionsOpen,
    onRegionToggle,
    selectedCountry,
    onCountrySelect
}) => {
    const mode: string | null = className === 'transparent' ? 'hide' : (className === 'sticky' ? 'show' : null)
    
    return (
        <header className={`header ${className} ${theme} animate animate-big ${mode ? `animate-big-${mode}` : ''}`}>
            <a href="/" className="header-logo">
                <img
                    className="object-cover"
                    src={theme === 'light' && position === 'absolute' ? logoBlack : logo}
                    alt="Screenmate"
                    fetchPriority="high"
                />
            </a>
            <div className="header-nav">
                <HeaderMenuDesktop {...{theme, menu, orderButton, onOrder}} />
                <HeaderCountrySelector
                    ref={countriesDropdownRef}
                    {...{countriesDropdownOpen, onCountriesDropdownToggle, regionsOpen, onRegionToggle, selectedCountry, onCountrySelect}}
                />
                <Button className="header-menu-mobile-open" label="Menu" onClick={onMobileMenuOpen}>
                    <Icon icon={burgerIcon} />
                </Button>
            </div>
        </header>
    )
}

const Header: FC<{ apiUrl?: string, theme: 'dark' | 'light'; orderButton: boolean; onOrder?: () => void }> = ({
    apiUrl = '',
    theme = 'dark',
    orderButton = true,
    onOrder
}) => {
    const dispatch = useAppDispatch()

    const { regions, country: currentCountry, main_menu } = useAppSelector(fetchContent)

    const countries: Country[] = useMemo(() => regions?.flatMap(region => region.subregions.flatMap(subregion => subregion.countries)) || [], [regions])

    const scrollOffset = useScroll()

    const [openMobileMenu, setOpenMobileMenu] = useState<boolean>(false)

    const menu = useMemo(() => {
        return main_menu ? main_menu.filter(({ title }) => title !== 'Buy Now') : []
    }, [main_menu])

    const isScrolling = scrollOffset.y > 0 && scrollOffset.direction === 'up'
    const isAtTop = scrollOffset.y <= 0

    const countriesDropdownRefs = useRef<(HTMLDivElement | null)[]>([])

    const setCountriesDropdownRef = (index: number) => (el: HTMLDivElement | null) => {
        countriesDropdownRefs.current[index] = el
    }

    const [countriesDropdownOpen, setCountriesDropdownOpen] = useState<boolean>(false)
    const [regionsOpen, setRegionsOpen] = useState<Record<string, boolean>>({})
    const [selectedCountry, setSelectedCountry] = useState<Country | null | undefined>(null)

    useEffect(() => {
        if (currentCountry) {
            const country = countries?.find(({ iso_code }) => iso_code === currentCountry.iso_code)
            setSelectedCountry({
                ...currentCountry,
                flag: country?.flag || (apiUrl ? `${apiUrl}/storage/CountryFlags/all/${currentCountry.iso_code}.svg` : '')
            })
        }
    }, [currentCountry, countries])

    const onCountriesDropdownToggle = useCallback((open?: boolean) => {
        if (open) setCountriesDropdownOpen(open)
        else setCountriesDropdownOpen(prev => !prev)
    }, [setCountriesDropdownOpen])

    const onRegionToggle = useCallback((regionName: string) => {
        setRegionsOpen(prev => ({ ...prev, [regionName]: !prev[regionName] }))
    }, [setRegionsOpen])

    useOutsideClick(countriesDropdownRefs, () => {
        if (countriesDropdownOpen) setCountriesDropdownOpen(false)
    })

    const onCountrySelect = useCallback((country: Country) => {
        setSelectedCountry(country)
        setCountriesDropdownOpen(false)
        dispatch(setCountry(country))
    }, [dispatch, setSelectedCountry, setCountriesDropdownOpen])

    const headerParams = useMemo(() => ({ menu: menu as MenuItem[], orderButton, onOrder }), [menu, orderButton, onOrder])

    const headerComponentParams = useMemo(() => ({
        theme,
        ...headerParams,
        onMobileMenuOpen: () => setOpenMobileMenu(true),
        countriesDropdownOpen,
        onCountriesDropdownToggle,
        regionsOpen,
        onRegionToggle,
        selectedCountry,
        onCountrySelect
    }), [
        theme,
        headerParams,
        setOpenMobileMenu,
        countriesDropdownOpen,
        onCountriesDropdownToggle,
        regionsOpen,
        onRegionToggle,
        selectedCountry,
        onCountrySelect
    ])

    const headerMobileParams = useMemo(() => ({
        theme,
        ...headerParams,
        onMobileMenuClose: () => setOpenMobileMenu(false)
    }), [theme, headerParams, setOpenMobileMenu])

    useLockBodyScroll(openMobileMenu)

    return (<>
        <HeaderComponent
            position="absolute"
            className="absolute"
            {...headerComponentParams}
            countriesDropdownRef={setCountriesDropdownRef(0)}
        />
        <HeaderComponent
            position="sticky"
            className={isAtTop ? 'hidden' : (isScrolling ? 'sticky' : 'transparent')}
            {...headerComponentParams}
            countriesDropdownRef={setCountriesDropdownRef(1)}
        />
        {openMobileMenu && HeaderMenuMobile && <HeaderMenuMobile {...headerMobileParams} />}
    </>)
}

export default Header
