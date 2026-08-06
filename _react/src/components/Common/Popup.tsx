import React, { useEffect, useRef, type ReactNode } from 'react'

interface PopupProps {
    open: boolean
    children: ReactNode
    onClose: () => void
}

const Popup: React.FC<PopupProps> = ({ open, children, onClose }) => {
    const popupRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!open) return

        const handleClickOutside = (event: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
                onClose()
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        
        return () => {
            document.removeEventListener('mousedown', handleClickOutside)
        }
    }, [open, onClose])

    return open ? (
        <div className="shadow">
            <div ref={popupRef}>
                {children}
            </div>
        </div>
    ) : null
}

export default Popup
