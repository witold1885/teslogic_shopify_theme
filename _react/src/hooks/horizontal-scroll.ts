import { useState, useEffect, useRef } from 'react'

export function useHorizontalScroll<T extends HTMLElement = HTMLDivElement>() {
    const elementRef = useRef<T | null>(null)
    const [scrollLeft, setScrollLeft] = useState<number>(0)
    const [scrollRight, setScrollRight] = useState<number>(0)

    useEffect(() => {
        const element = elementRef.current
        if (!element) return

        const handleScroll = (): void => {
            setScrollLeft(element.scrollLeft)
            setScrollRight(element.scrollWidth - element.clientWidth)
        }

        element.addEventListener('scroll', handleScroll, { passive: true })

        setScrollLeft(element.scrollLeft)
        setScrollRight(element.scrollWidth - element.clientWidth)

        return () => {
            element.removeEventListener('scroll', handleScroll)
        }
    }, [])

    return { elementRef, scrollLeft, scrollRight }
}
