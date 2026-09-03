import { useEffect } from 'react'

export const useLockBodyScroll = (isOpen: boolean) => {
    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (!isOpen) return

            const originalStyle = window.getComputedStyle(document.body).overflow
            
            document.body.style.overflow = 'hidden'

            return () => {
                document.body.style.overflow = originalStyle
            }
        }
    }, [isOpen])
}
