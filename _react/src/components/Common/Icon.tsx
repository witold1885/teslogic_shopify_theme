import { type CSSProperties, type ReactNode, type FC } from 'react'

interface IconProps {
    className?: string
    style?: CSSProperties
    icon?: string
    svg?: ReactNode
    alt?: string
    fetchPriority?: 'high' | 'auto'
    onClick?: () => void
}

const Icon: FC<IconProps> = ({ className = '', style, icon, svg, alt = '', fetchPriority = 'auto', onClick }) => (
    <div className={`icon ${className} ${onClick ? 'cursor-pointer' : ''}`} {...{style, onClick}}>
        {icon && <img src={icon} alt={alt} fetchPriority={fetchPriority} />}
        {svg}
    </div>
)

export default Icon
