import { forwardRef, useState, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { fetchContent } from '../../redux/selectors/content'
import { getRegions } from '../../redux/slices/content'
import type { Country } from '../../types/shopify'

export interface HeaderCountrySelectorProps {
    countriesDropdownOpen: boolean
    onCountriesDropdownToggle: (open?: boolean) => void
    regionsOpen: Record<string, boolean>
    onRegionToggle: (regionName: string) => void
    selectedCountry?: Country | null
    onCountrySelect: (country: Country) => void
}

const HeaderCountrySelector = forwardRef<HTMLDivElement, HeaderCountrySelectorProps>(({ 
    countriesDropdownOpen,
    onCountriesDropdownToggle,
    regionsOpen,
    onRegionToggle,
    selectedCountry,
    onCountrySelect
}, ref) => {
    const dispatch = useAppDispatch()

    const { regions } = useAppSelector(fetchContent)

    const [isRegionsLoaded, setIsRegionsLoaded] = useState(false)

    const handleFetchRegions = useCallback(() => {
        if (!isRegionsLoaded) {
            dispatch(getRegions())
            setIsRegionsLoaded(true)
        }
    }, [isRegionsLoaded, dispatch])

    return (
        <div className="header-country" ref={ref}>
            <div className="header-country-button" onMouseEnter={handleFetchRegions} onClick={() => onCountriesDropdownToggle()}>
                <div style={{ backgroundImage: selectedCountry?.flag || 'transparent' }} />
                <span>{selectedCountry?.currency_symbol}</span>
            </div>
            <div className={`header-country-dropdown ${countriesDropdownOpen ? '' : 'hidden'}`}>
                <div className="header-country-dropdown-list">
                    {regions?.map((region, ri) => (
                        <div className={`header-country-dropdown-region ${regionsOpen[region.name] ? 'opened' : ''}`} key={ri}>
                            <div
                                className="header-country-dropdown-region-name"
                                onClick={() => onRegionToggle(region.name)}
                            >
                                <span>{region.name}</span>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M4 6L8 10L12 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                            <div className={`header-country-dropdown-subregions ${regionsOpen[region.name] ? '' : 'hidden'}`}>
                                {region.subregions.map((subregion, si) => (
                                    <div className="header-country-dropdown-subregion" key={si}>
                                        <div className="header-country-dropdown-subregion-name">{subregion.name}</div>
                                        <div className="header-country-dropdown-countries">
                                            {subregion.countries.map(country => (
                                                <div
                                                    key={country.iso_code}
                                                    className={`header-country-dropdown-country ${
                                                        country.iso_code === selectedCountry?.iso_code ? 'selected' : ''
                                                    }`}
                                                    onClick={() => onCountrySelect(country)}
                                                >
                                                    <div>
                                                        <img src={country.flag} alt={country.iso_code} />
                                                        <span>{country.name}</span>
                                                    </div>
                                                    <div>{country.currency_symbol}</div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
})

export default HeaderCountrySelector
