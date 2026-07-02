import { useState, useEffect } from 'react'

interface ScrollOffset {
    x: number
    y: number
}

export const useScroll = () => {
    const [scrollOffset, setScrollOffset] = useState<ScrollOffset>({ x: 0, y: 0 })

    useEffect(() => {
        const handleScroll = () => {
            setScrollOffset({
                x: window.scrollX,
                y: window.scrollY
            })
        }

        handleScroll()

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return scrollOffset
}
