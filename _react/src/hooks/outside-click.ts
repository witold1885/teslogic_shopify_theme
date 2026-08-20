import { useEffect, type RefObject } from 'react'

type Event = MouseEvent | TouchEvent

export const useOutsideClick = (
    ref: RefObject<HTMLElement | null>,
    callback: () => void
): void => {
    useEffect(() => {
        const listener = (event: Event) => {
            if (!ref.current || ref.current.contains(event.target as Node)) {
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
