import { forwardRef } from 'react'
import './styles.scss'
import type { CSSProperties, ReactNode } from 'react'

interface ButtonProps {
    className?: string
    label?: string
    style?: CSSProperties
    onClick?: () => void
    children: ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    className = '',
    label = null,
    style = {},
    onClick = () => {},
    children
}, ref) => (
    <button type="button" {...{ref, className, style, onClick}} {...(label ? { 'aria-label': label } : {})}>
        {children}
    </button>
))

Button.displayName = 'Button'

export default Button
