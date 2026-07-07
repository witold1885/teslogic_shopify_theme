import { forwardRef, type CSSProperties } from 'react'
import Icon from './Icon'

interface AnchorProps {
    className?: string
    style?: CSSProperties
    text?: string
    textClassName?: string
    icon?: string
    iconClassName?: string
    onClick?: () => void
}

const Anchor = forwardRef<HTMLAnchorElement, AnchorProps>(({
    className = '',
    style = {},
    text = '',
    textClassName = '',
    icon = null,
    iconClassName = '',
    onClick = () => {}
}, ref) => (
    <a {...{ref, className, style, onClick}}>
        {text && <span className={textClassName}>{text}</span>}
        {icon && <Icon className={iconClassName} icon={icon} />}
    </a>
))

export default Anchor
