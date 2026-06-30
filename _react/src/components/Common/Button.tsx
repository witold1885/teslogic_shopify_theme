import { forwardRef } from 'react'
import type { CSSProperties, ReactNode } from 'react'

interface ButtonProps {
    className?: string
    style?: CSSProperties
    onClick?: () => void
    children: ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
    className = '',
    style = {},
    onClick = () => {},
    children
}, ref) => (
    <button type="button" {...{ref, className, style, onClick}}>
        {children}
    </button>
))

Button.displayName = 'Button'

export default Button
