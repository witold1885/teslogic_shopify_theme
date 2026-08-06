import React, { forwardRef, useState } from 'react'
import Icon from './Icon'
import chevronUp from '@/assets/icons/chevron-white-up.svg'
import chevronDown from '@/assets/icons/chevron-white-down.svg'
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
    placeholder?: string
    options: DropdownOption[]
    onSelect?: (value: DropdownOption['value']) => void
    error?: boolean
}

const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(({ placeholder, options, onSelect, error }, ref) => {
    const [menuOpen, setMenuOpen] = useState<boolean>(false)
    const [selectedlabel, setSelectedLabel] = useState<string|null>(null)

    const handleOptionSelect = ({ label, value }: DropdownOption) => {
        setSelectedLabel(label)
        onSelect && onSelect(value)
        setMenuOpen(false)
    }

    return (
        <div ref={ref} className="dropdown">
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
