import { useEffect } from 'react'
import { useAppDispatch } from '../redux/hooks'

interface LazyDataParams {
    condition: boolean
    action: any
    selector: string
    rootMargin: string
}

export function useLazyData (params: LazyDataParams) {
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (!params || !params?.condition) return

        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                dispatch(params.action())
                observer.disconnect()
            }
        }, { rootMargin: params.rootMargin })

        const element = document.querySelector(params.selector)
        if (element) observer.observe(element)

        return () => observer.disconnect()
    }, [params, dispatch])
}
