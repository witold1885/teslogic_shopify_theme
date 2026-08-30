import { useEffect, type RefObject } from 'react'

type Event = MouseEvent | TouchEvent

export const useOutsideClick = (
    ref: RefObject<(HTMLElement | null)[]>,
    callback: () => void
): void => {
    useEffect(() => {
        const listener = (event: Event) => {
            const target = event.target as Node
            if (ref.current?.some(el => el && el.contains(target))) {
                return
            }
            callback()
        }

        document.addEventListener('mousedown', listener)
        document.addEventListener('touchstart', listener)

        return () => {
            document.removeEventListener('mousedown', listener)
            document.removeEventListener('touchstart', listener)
        }
    }, [ref, callback])
}
