import React, { forwardRef, useMemo, useState } from 'react'
import Icon from './Icon'
import chevronWhiteUp from '@/assets/icons/chevron-white-up.svg'
import chevronWhiteDown from '@/assets/icons/chevron-white-down.svg'
import chevronGreyUp from '@/assets/icons/chevron-grey-up.svg'
import chevronBlackDown from '@/assets/icons/chevron-black-down.svg'
import selectedIcon from '@/assets/icons/selected.svg'

export interface DropdownOption {
    label: string
    value: number|string
}

interface DropdownItemProps {
    className?: string
    label?: string
    icon: string|null
    onClick?: () => void
}

const DropdownItem: React.FC<DropdownItemProps> = ({ className, label, icon, onClick }) => (
    <div className={`${className} dropdown-item`} onClick={onClick}>
        <span>{label}</span>
        {icon && <Icon icon={icon} />}
    </div>
)

interface DropdownProps {
    theme?: 'dark' | 'light'
    placeholder?: string
    options: DropdownOption[]
    onSelect?: (value: DropdownOption['value']) => void
    error?: boolean
}

const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(({ theme = 'dark', placeholder, options, onSelect, error }, ref) => {
    const [menuOpen, setMenuOpen] = useState<boolean>(false)
    const [selectedlabel, setSelectedLabel] = useState<string|null>(null)

    const handleOptionSelect = ({ label, value }: DropdownOption) => {
        setSelectedLabel(label)
        onSelect && onSelect(value)
        setMenuOpen(false)
    }

    const chevronDown = useMemo(() => theme === 'dark' ? chevronWhiteDown : chevronBlackDown, [theme])
    const chevronUp = useMemo(() => theme === 'dark' ? chevronWhiteUp : chevronGreyUp, [theme])

    return (
        <div ref={ref} className={`dropdown ${theme}`}>
            <DropdownItem
                className={`dropdown-field ${error ? 'dropdown-field-error' : ''}`}
                label={selectedlabel || placeholder}
                icon={chevronDown}
                onClick={() => setMenuOpen(true)}
            />
            {menuOpen && (
                <div className="dropdown-menu">
                    <DropdownItem className="dropdown-menu-placeholder" label={placeholder} icon={chevronUp} onClick={() => setMenuOpen(false)}/>
                    {options.map((option, index) => (
                        <DropdownItem
                            key={index}
                            className="dropdown-menu-item"
                            label={option.label}
                            icon={option.label === selectedlabel ? selectedIcon : null}
                            onClick={() => handleOptionSelect(option)}
                        />
                    ))}
                </div>
            )}
        </div>
    )
})

export default Dropdown
