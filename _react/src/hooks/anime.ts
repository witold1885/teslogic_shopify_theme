import { useEffect, useRef, useCallback, isValidElement } from 'react'
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

export type AnimationMode = 'show' | 'hide' | 'shift'
export type AnimationDirection = 'top' | 'bottom'

const getDomElement = (target: HTMLElement | VideoRefMethods | null): HTMLElement | null => {
    if (!target) return null
    if ('el' in target) {
        return target.el as HTMLElement
    }
    return target as HTMLElement
}

const observers = new Map<string, IntersectionObserver>()
const handlers = new WeakMap<Element, () => void>()

const getObserver = (rootMargin: string) => {
    let observer = observers.get(rootMargin)

    if (!observer) {
        observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return

                const element = entry.target as HTMLElement

                const handler = handlers.get(element)

                if (handler) {
                    handlers.delete(element)
                    observer!.unobserve(element)
                    handler()
                }
            })
        }, {
            rootMargin,
            threshold: 0.1
        })

        observers.set(rootMargin, observer)
    }

    return observer
}

export const useAnime = (configs: Record<string, AnimationConfig> = {}) => {
    const targetsRef = useRef<Record<string, HTMLElement | VideoRefMethods | null>>({})
    const timeoutsRef = useRef<number[]>([])
    const lastAnimationStartRef = useRef<number>(0)
    const lastAnimationDurationRef = useRef<number>(0)

    useEffect(() => {
        Object.entries(configs).forEach(([key, config]) => {
            const target = getDomElement(targetsRef.current[key])
            if (!target) return

            const rootMargin = config.rootMargin ?? '0px 0px -10% 0px'
            const observer = getObserver(rootMargin)

            handlers.set(target, () => {
                const now = performance.now()
                const duration = config.duration ?? defaultDuration
                const half = lastAnimationDurationRef.current / 2
                const passed = now - lastAnimationStartRef.current

                let delay = config.delay ?? 0

                if (config.stagger !== false && passed < half) {
                    delay += half - passed
                }

                const run = () => {
                    animate(target, {
                        ease: 'outSine',
                        ...config,
                        onComplete: () => {
                            target.classList.add('anime-finished')
                            target.style.setProperty('--is-finished', '1')
                        }
                    })

                    lastAnimationStartRef.current = performance.now()
                    lastAnimationDurationRef.current = duration
                }

                if (delay) {
                    const id = window.setTimeout(run, delay)
                    timeoutsRef.current.push(id)
                } else {
                    run()
                }

            })

            observer.observe(target)
        })

        return () => {
            timeoutsRef.current.forEach(clearTimeout)
        }
    }, [configs])

    const setRef = useCallback((key: string) => (el: HTMLElement | VideoRefMethods | null) => {
        if (el) {
            targetsRef.current[key] = el
        } else {
            delete targetsRef.current[key]
        }
    }, [])

    const anime = useCallback((key: string, mode?: AnimationMode) => ({
        ref: setRef(key),
        style: { opacity: mode === 'hide' || mode === 'shift' ? 1 : 0 }
    }), [setRef])

    return { anime, setRef }
}

export const getAnimationConfig = (yFrom: string, duration?: number) => (
    { translateY: [yFrom, '0px'], opacity: [0, 1], duration: duration || defaultDuration }
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
    const configs: Record<string, AnimationConfig> = {}
    for (const [blockKey, block] of Object.entries(blocks)) {
        for (const [param, value] of Object.entries(block)) {
            const { yFrom, duration } = getOptions ? getOptions(blockKey, param) : (animatedObjects[param] || {})
            const config = yFrom ? getAnimationConfig(yFrom, duration) : null
            if (config) {
                if (typeof value === 'object' && value !== null && !isValidElement(value)) {
                    for (const itemKey of Object.keys(value)) {
                        configs[`${blockKey}-${param}-${itemKey}`] = config
                    }
                } else {
                    configs[`${blockKey}-${param}`] = config
                }
            }
        }
    }
    return configs
}
