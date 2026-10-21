import { useEffect, useRef } from 'react'
import { useAppDispatch } from '../redux/hooks'

interface LazyDataParams {
    condition?: boolean
    action: () => any
    selector: string
    rootMargin?: string
}

export function useLazyData ({ condition = true, action, selector, rootMargin = '810px' }: LazyDataParams) {
    const dispatch = useAppDispatch()
    const hasDispatched = useRef(false)

    useEffect(() => {
        if (!condition|| hasDispatched.current) return

        const element = document.querySelector(selector)
        if (!element) return

        const triggerAction = () => {
            const actionToDispatch = action()
            if (actionToDispatch && (typeof actionToDispatch === 'function' || typeof actionToDispatch === 'object')) {
                dispatch(actionToDispatch)
                hasDispatched.current = true
                return true
            }
            return false
        }

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                const success = triggerAction()
                if (success) {
                    observer.disconnect()
                }
            }
        }, { rootMargin })

        observer.observe(element)

        return () => observer.disconnect()
    }, [condition, action, selector, rootMargin, dispatch])
}
