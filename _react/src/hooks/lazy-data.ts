import { useEffect } from 'react'
import { useAppDispatch } from '../redux/hooks'

interface LazyDataParams {
    condition: boolean
    action: () => any
    selector: string
    rootMargin: string
}

export function useLazyData ({ condition, action, selector, rootMargin }: LazyDataParams) {
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!condition) return

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                dispatch(action())
                observer.disconnect()
            }
        }, { rootMargin })

        const element = document.querySelector(selector)
        if (element) observer.observe(element)

        return () => observer.disconnect()
    }, [condition, action, selector, rootMargin, dispatch])
}
