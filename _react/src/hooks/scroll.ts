import { useState, useEffect, useRef } from 'react'

type ScrollDirection = 'up' | 'down' | 'none'

interface ScrollOffset {
    x: number
    y: number
    direction: ScrollDirection
}

export const useScroll = () => {
    const [scrollOffset, setScrollOffset] = useState<ScrollOffset>({ x: 0, y: 0, direction: 'none' })

    const lastScrollY = useRef<number>(0)

    useEffect(() => {
        lastScrollY.current = window.scrollY

        const handleScroll = () => {
            const currentScrollY = window.scrollY

            let direction: ScrollDirection = 'none'

            if (currentScrollY > lastScrollY.current) {
                direction = 'down'
            } else if (currentScrollY < lastScrollY.current) {
                direction = 'up'
            }

            setScrollOffset({
                x: window.scrollX,
                y: window.scrollY,
                direction
            })

            lastScrollY.current = currentScrollY
        }

        handleScroll()

        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return scrollOffset
}
