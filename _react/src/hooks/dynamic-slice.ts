import { useState, useEffect, useRef, useMemo } from 'react'
import { useStore } from 'react-redux'
import { rootReducer } from '../redux/store'


const NO_OP_ACTION = { type: '@@DYNAMIC_SLICE/NO_OP' }
const noOpFunction = () => NO_OP_ACTION

type Slice = 'content' | 'products' | 'order' | 'reviews' | 'subscribe'

export const useDynamicSlice = (
    sliceName: Slice,
    importFn: () => any,
    condition: boolean = true
): any => {
    const store = useStore()

    const [actions, setActions] = useState<any>({})
    const [isLoaded, setIsLoaded] = useState<boolean>(false)

    const importFnRef = useRef(importFn)
    importFnRef.current = importFn

    useEffect(() => {
        if (!condition || isLoaded) return
        
        let isMounted = true

        importFnRef.current().then((module: any) => {
            if (!isMounted) return
            
            const { default: slice, ...extractedActions } = module

            if (slice && slice.injectInto) {
                const currentState = store.getState() as any
                const hasServerState = sliceName && currentState[sliceName] !== undefined

                slice.injectInto(rootReducer, {
                    ...(hasServerState ? { preserveExisting: true } : {}) 
                })
            }
            
            setActions(extractedActions)
            setIsLoaded(true)
        }).catch((e: any) => {
            console.error('Dynamic slice loading error:', e.toString())
        })
        
        return () => {
            isMounted = false
        }
    }, [condition, isLoaded, store, sliceName])

    const resultActions = useMemo(() => {
        if (isLoaded && Object.keys(actions).length > 0) {
            return actions
        }
        return new Proxy({}, {
            get: (_, prop) => {
                if (prop === 'then' || prop === '@@toStringTag' || typeof prop === 'symbol') {
                    return undefined
                }
                return noOpFunction
            }
        })
    }, [actions, isLoaded])

    return { ...resultActions, isLoaded }
}
