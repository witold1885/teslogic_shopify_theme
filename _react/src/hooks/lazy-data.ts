import { useEffect, useRef } from 'react'
import { useAppDispatch } from '../redux/hooks'

export interface LazyDataParams {
    condition?: boolean
    action: () => any
    selector: string
    rootMargin?: string
}

export function useLazyData ({ condition = true, action, selector, rootMargin = '810px' }: LazyDataParams) {
    const dispatch = useAppDispatch()

    const actionRef = useRef(action)
    actionRef.current = action

    useEffect(() => {
        if (!condition) return

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                dispatch(actionRef.current())
                observer.disconnect()
            }
        }, { rootMargin })

        const element = document.querySelector(selector)
        if (element) observer.observe(element)

        return () => observer.disconnect()
    }, [condition, selector, rootMargin, dispatch])
}
