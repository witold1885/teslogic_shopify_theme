import { useState, useEffect, useRef, useCallback, isValidElement } from 'react'
import { animate } from 'animejs'
import type { VideoRefMethods } from '../components/Common'

export interface AnimatedObjectOptions {
    yFrom: string
    duration?: number
}

export interface AnimationConfig extends Record<string, any> {
    duration?: number
    delay?: number
    stagger?: boolean
    rootMargin?: string
}

const defaultDuration: number = 333

interface ValidElement {
    key: string
    el: HTMLElement
    config: AnimationConfig
}

export type AnimationMode = 'show' | 'hide' | 'shift'
export type AnimationDirection = 'top' | 'bottom'

const getDomElement = (target: HTMLElement | VideoRefMethods | null): HTMLElement | null => {
    if (!target) return null
    if ('el' in target) {
        return target.el as HTMLElement
    }
    return target as HTMLElement
}

export const useAnime = (configs: Record<string, AnimationConfig> = {}) => {
    const targetsRef = useRef<Record<string, HTMLElement | VideoRefMethods | null>>({})
    
    const timeoutsRef = useRef<number[]>([])
    const lastAnimationStartRef = useRef<number>(0)
    const lastAnimationDurationRef = useRef<number>(0)

    const [finishedAnimations, setFinishedAnimations] = useState<Record<string, boolean>>({})

    const configsKey = Object.keys(configs).join(',')

    // useEffect(() => {
    //     const validElements: ValidElement[] = []

    //     Object.keys(configs).forEach((key) => {
    //         const el = getDomElement(targetsRef.current[key])

    //         if (el) {
    //             validElements.push({ key, el, config: configs[key] })
    //         }
    //     })

    //     if (validElements.length === 0) return

    //     const animations: Record<string, any> = {}
        
    //     validElements.forEach(({ key, el, config }) => {
    //         animations[key] = animate(el, {
    //             autoplay: false,
    //             ...config
    //         })
    //     })

    //     const groupedByMargin = validElements.reduce<Record<string, ValidElement[]>>((acc, item) => {
    //         const rootMargin = item.config.rootMargin || '0px 0px -10% 0px'
    //         if (!acc[rootMargin]) acc[rootMargin] = []
    //         acc[rootMargin].push(item)
    //         return acc
    //     }, {})

    //     const observers: IntersectionObserver[] = []

    //     Object.entries(groupedByMargin).forEach(([rootMargin, elements]) => {
    //         const observer = new IntersectionObserver(
    //             (entries) => {
    //                 entries.forEach((entry) => {
    //                     if (entry.isIntersecting) {
    //                         const targetElement = entry.target as HTMLElement
                            
    //                         const found = validElements.find(item => item.el === targetElement)
    //                         if (!found) return

    //                         const { key, config } = found
    //                         const currentAnim = animations[key]
    //                         if (!currentAnim) return

    //                         const now = performance.now()
    //                         const duration = config.duration || defaultDuration
                            
    //                         const timePassedSinceLastStart = now - lastAnimationStartRef.current
    //                         const halfOfLastDuration = lastAnimationDurationRef.current / 2

    //                         let delay = config.delay || 0
                            
    //                         if (config.stagger !== false && timePassedSinceLastStart < halfOfLastDuration) {
    //                             delay = halfOfLastDuration - timePassedSinceLastStart
    //                         }

    //                         const startAnimation = () => {
    //                             currentAnim.play().then(() => {
    //                                 setFinishedAnimations(prev => ({ ...prev, [key]: true }))
    //                             }).catch(() => {})

    //                             lastAnimationStartRef.current = performance.now()
    //                             lastAnimationDurationRef.current = duration
    //                         }

    //                         if (delay === 0) {
    //                             startAnimation()
    //                         } else {
    //                             const timer = window.setTimeout(() => {
    //                                 startAnimation()
    //                             }, delay)
    //                             timeoutsRef.current.push(timer)
    //                         }

    //                         observer.unobserve(targetElement)
    //                     }
    //                 })
    //             },
    //             { root: null, rootMargin, threshold: 0.1 }
    //         )

    //         elements.forEach(({ el }) => observer.observe(el))
    //         observers.push(observer)
    //     })

    //     return () => {
    //         observers.forEach(observer => observer.disconnect())
    //         timeoutsRef.current.forEach(clearTimeout)
    //     }
    // }, [configsKey])

    const setRef = useCallback((key: string) => (el: HTMLElement | VideoRefMethods | null) => {
        if (el) {
            targetsRef.current[key] = el
        } else {
            delete targetsRef.current[key]
        }
    }, [])

    const anime = useCallback((key: string, mode?: AnimationMode) => ({
        ref: setRef(key),
        style: (
            !!finishedAnimations[key] ? { '--is-finished': 1 } 
                                      : { opacity: mode === 'hide' || mode === 'shift' ? 1 : 0 }
        ) as any
    }), [setRef, finishedAnimations])

    return { anime, setRef, finishedAnimations }
}

export const getAnimationConfig = (yFrom: string, duration?: number) => (
    { translateY: [yFrom, '0px'], opacity: [0, 1], duration: duration || defaultDuration }
)

export const getShiftConfig = (yFrom: string, yTo: string, duration?: number) => (
    { translateY: [yFrom, yTo], duration: duration || defaultDuration }
)

export const getCustomConfig = (yFrom: string, duration?: number, mode?: AnimationMode, direction?: AnimationDirection) => {
    let translateY, opacity
    if (mode === 'show') {
        opacity = [0, 1]
        if (direction === 'top') {
            translateY = [`-${yFrom}`, '0px']
        }
        if (direction === 'bottom') {
            translateY = [yFrom, '0px']
        }
    }
    if (mode === 'hide') {
        opacity = [1, 0]
        if (direction === 'top') {
            translateY = ['0px', `-${yFrom}`]
        }
        if (direction === 'bottom') {
            translateY = ['0px', yFrom]
        }
    }
    return translateY && opacity ? { translateY, opacity, duration: duration || defaultDuration } : getAnimationConfig(yFrom, duration)
}

export const getCollapseConfig = (duration?: number, mode?: AnimationMode) => {
    let height, opacity
    if (mode === 'show') {
        height = ['0px', (el: HTMLElement) => `${el.scrollHeight}px`]
        opacity = [0, 1]
    }
    if (mode === 'hide') {
        height = [(el: HTMLElement) => `${el.scrollHeight || el.clientHeight}px`, '0px']
        opacity = [1, 0]
    }
    return height && opacity ? { height, opacity, duration: duration || defaultDuration } : {}
}

export const mapSimpleConfigs = (animatedObjects: Record<string, AnimatedObjectOptions>) => {
    return Object.entries(animatedObjects).reduce<Record<string, AnimationConfig>>(
        (acc, [key, { yFrom, duration }]) => ({
            ...acc, [key]: getAnimationConfig(yFrom, duration)
        }), {}
    )
}

export const mapCustomConfigs = (animatedObjects: Record<string, AnimatedObjectOptions>, mode?: AnimationMode, direction?: AnimationDirection) => {
    return Object.entries(animatedObjects).reduce<Record<string, AnimationConfig>>(
        (acc, [key, { yFrom, duration }]) => ({
            ...acc, [key]: getCustomConfig(yFrom, duration, mode, direction)
        }), {}
    )
}

export const mapBlocksConfigs = (
    blocks: Record<string, any>,
    animatedObjects: Record<string, AnimatedObjectOptions>,
    getOptions?: (blockKey: string, param: string) => AnimatedObjectOptions
) => {
    return Object.fromEntries(
        Object.entries(
            Object.entries(blocks).reduce<Record<string, AnimationConfig>>((acc, [blockKey, block]) => ({
                ...acc,
                ...Object.entries(block).reduce((obj, [param, value]) => {
                    const { yFrom, duration } = getOptions ? getOptions(blockKey, param) : (animatedObjects[param] || {})
                    const config = yFrom ? getAnimationConfig(yFrom, duration) : null
                    return typeof value === 'object' && value !== null && !isValidElement(value) ? {
                        ...obj,
                        ...Object.keys(value).reduce((carry, itemKey) => ({
                            ...carry,
                            [`${blockKey}-${param}-${itemKey}`]: config
                        }), {})
                    } : { ...obj, [`${blockKey}-${param}`]: config }
                }, {})
            }), {})
        ).filter(([_, value]) => !!value)
    )
}
