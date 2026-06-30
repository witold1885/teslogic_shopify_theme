import React, { type CSSProperties } from 'react'

interface IconProps {
    className?: string
    style?: CSSProperties
    icon: string
    alt?: string
    onClick?: () => void
}

const Icon: React.FC<IconProps> = ({ className = '', style, icon, alt = '', onClick }) => (
    <div className={`icon ${className} ${onClick ? 'cursor-pointer' : ''}`} {...{style, onClick}}>
        <img className="w-full" src={icon} alt={alt} />
    </div>
)

export default Icon
