import React, { type CSSProperties, type ReactNode } from 'react'

interface IconProps {
    className?: string
    style?: CSSProperties
    icon?: string
    svg?: ReactNode
    alt?: string
    onClick?: () => void
}

const Icon: React.FC<IconProps> = ({ className = '', style, icon, svg, alt = '', onClick }) => (
    <div className={`icon ${className} ${onClick ? 'cursor-pointer' : ''}`} {...{style, onClick}}>
        {icon && <img src={icon} alt={alt} />}
        {svg}
    </div>
)

export default Icon
