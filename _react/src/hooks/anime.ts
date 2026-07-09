import { useState, useEffect, useRef, useCallback, isValidElement } from 'react'
import { animate } from 'animejs'

export interface AnimatedObjectOptions {
    yFrom: string
    duration?: number
}

export interface AnimationConfig extends Record<string, any> {
    duration?: number
}

const defaultDuration: number = 333

interface ValidElement {
    key: string
    el: HTMLElement
    config: AnimationConfig
}

type AnimationMode = 'show' | 'hide' | 'shift'
type AnimationDirection = 'top' | 'bottom'

export const useAnime = (configs: Record<string, AnimationConfig> = {}) => {
    const targetsRef = useRef<Record<string, HTMLElement | null>>({})
    
    const timeoutsRef = useRef<number[]>([])
    const lastAnimationStartRef = useRef<number>(0)
    const lastAnimationDurationRef = useRef<number>(0)

    const [finishedAnimations, setFinishedAnimations] = useState<Record<string, boolean>>({})

    const configsKey = Object.keys(configs).join(',')

    useEffect(() => {
        const validElements: ValidElement[] = []

        Object.keys(configs).forEach((key) => {
            const el = targetsRef.current[key]
            if (el) {
                validElements.push({ key, el, config: configs[key] })
            }
        })

        if (validElements.length === 0) return

        const animations: Record<string, any> = {}
        
        validElements.forEach(({ key, el, config }) => {
            animations[key] = animate(el, {
                autoplay: false,
                ...config
            })
        })

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const targetElement = entry.target as HTMLElement
                        
                        const found = validElements.find(item => item.el === targetElement)
                        if (!found) return

                        const { key, config } = found
                        const currentAnim = animations[key]
                        if (!currentAnim) return

                        const now = performance.now()
                        const duration = config.duration || defaultDuration
                        
                        const timePassedSinceLastStart = now - lastAnimationStartRef.current
                        const halfOfLastDuration = lastAnimationDurationRef.current / 2

                        let delay = 0
                        
                        if (timePassedSinceLastStart < halfOfLastDuration) {
                            delay = halfOfLastDuration - timePassedSinceLastStart
                        }

                        const startAnimation = () => {
                            currentAnim.play().then(() => {
                                setFinishedAnimations(prev => ({ ...prev, [key]: true }))
                            }).catch(() => {})

                            lastAnimationStartRef.current = performance.now()
                            lastAnimationDurationRef.current = duration
                        }

                        if (delay === 0) {
                            startAnimation()
                        } else {
                            const timer = window.setTimeout(() => {
                                startAnimation()
                            }, delay)
                            timeoutsRef.current.push(timer)
                        }

                        observer.unobserve(targetElement)
                    }
                })
            },
            {
                root: null,
                rootMargin: "0px 0px -10% 0px",
                threshold: 0.1
            }
        )

        validElements.forEach(({ el }) => observer.observe(el))

        return () => {
            observer.disconnect()
            timeoutsRef.current.forEach(clearTimeout)
        }
    }, [configsKey])

    const setRef = useCallback((key: string) => (el: HTMLElement | null) => {
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

    return { anime, setRef }
}

export const getAnimationConfig = (yFrom: string, duration?: number) => (
    { y: [yFrom, '0px'], opacity: [0, 1], duration: duration || defaultDuration }
)

export const getShiftConfig = (yFrom: string, yTo: string, duration?: number) => (
    { y: [yFrom, yTo], duration: duration || defaultDuration }
)

export const getCustomConfig = (yFrom: string, duration?: number, mode?: AnimationMode, direction?: AnimationDirection) => {
    let y, opacity
    if (mode === 'show') {
        opacity = [0, 1]
        if (direction === 'top') {
            y = [`-${yFrom}`, '0px']
        }
        if (direction === 'bottom') {
            y = [yFrom, '0px']
        }
    }
    if (mode === 'hide') {
        opacity = [1, 0]
        if (direction === 'top') {
            y = ['0px', `-${yFrom}`]
        }
        if (direction === 'bottom') {
            y = ['0px', yFrom]
        }
    }
    return y && opacity ? { y, opacity, duration: duration || defaultDuration } : getAnimationConfig(yFrom, duration)
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
