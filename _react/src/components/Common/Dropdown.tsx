import React, { forwardRef, useState, useRef } from 'react'
import './styles.scss'
import Icon from './Icon'
import { useOutsideClick } from '../../hooks/outside-click'
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
    const menuRefs = useRef<(HTMLDivElement | null)[]>([])

    const setMenuRef = (index: number) => (el: HTMLDivElement | null) => {
        menuRefs.current[index] = el
    }        

    const [menuOpen, setMenuOpen] = useState<boolean>(false)
    const [selectedlabel, setSelectedLabel] = useState<string|null>(null)

    const handleOptionSelect = ({ label, value }: DropdownOption) => {
        setSelectedLabel(label)
        onSelect && onSelect(value)
        setMenuOpen(false)
    }

    useOutsideClick(menuRefs, () => {
        if (menuOpen) setMenuOpen(false)
    })

    return (
        <div ref={ref} className={`dropdown ${theme}`}>
            <DropdownItem
                className={`dropdown-field ${error ? 'dropdown-field-error' : ''}`}
                label={selectedlabel || placeholder}
                icon={theme === 'dark' ? chevronWhiteDown : chevronBlackDown}
                onClick={() => setMenuOpen(true)}
            />
            {menuOpen && (
                <div ref={setMenuRef(0)} className="dropdown-menu">
                    <DropdownItem
                        className="dropdown-menu-placeholder"
                        label={placeholder}
                        icon={theme === 'dark' ? chevronWhiteUp : chevronGreyUp}
                        onClick={() => setMenuOpen(false)}
                    />
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
