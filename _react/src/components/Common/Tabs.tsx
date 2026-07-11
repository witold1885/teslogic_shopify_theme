import { forwardRef, useState, useEffect, useRef, type ReactNode } from 'react'
import './styles.scss'

export interface TabProps {
    title: ReactNode
    text?: ReactNode
    content?: ReactNode
    video?: string
    background?: string
    timeout?: number
}

export interface TabsProps {
    tabs: Record<string, TabProps>
    activeTab: string | null
    setActiveTab: (tab: string) => void
    timeout?: number
    autoplay?: boolean
    replay?: boolean
}

const Tabs = forwardRef<HTMLDivElement, TabsProps>(({ tabs, activeTab, setActiveTab, timeout = 4000, autoplay = true, replay = true }, ref) => {
    const [progress, setProgress] = useState<number>(0)
    const [isIntersecting, setIsIntersecting] = useState<boolean>(false)

    const elementRef = useRef<HTMLDivElement | null>(null)

    const setRef = (node: HTMLDivElement | null) => {
        elementRef.current = node
        
        if (!ref) return
        if (typeof ref === 'function') {
            ref(node)
        } else {
            (ref as React.RefObject<HTMLDivElement | null>).current = node
        }
    }

    useEffect(() => {
        const el = elementRef.current
        if (!el) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsIntersecting(entry.isIntersecting)
            },
            {
                root: null,
                rootMargin: "0px 0px -10% 0px",
                threshold: 0.1
            }
        )

        observer.observe(el)

        return () => {
            observer.disconnect()
        }
    }, [])

    useEffect(() => {
        if (!activeTab|| !isIntersecting) return

        if (!autoplay) {
            setProgress(100)
            return
        }

        setProgress(0)

        const keys = Object.keys(tabs)
        const activeTabIndex = keys.findIndex(tab => tab === activeTab)
        const nextTabIndex = activeTabIndex + 1
        
        const step: number = 10
        const duration: number = tabs[activeTab].timeout || timeout
        
        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer)
                    
                    if (nextTabIndex < keys.length) {
                        setActiveTab(keys[nextTabIndex])
                    } else if (replay) {
                        setActiveTab(keys[0])
                    }

                    return 100
                }
                
                return prev + (100 * step / duration)
            })
        }, step)

        return () => {
            clearInterval(timer)
        }
    }, [isIntersecting, tabs, activeTab, setActiveTab, timeout, autoplay, replay])

    return (
        <div ref={setRef} className="tabs">
            {Object.entries(tabs).map(([tab, { title }]) => (
                <div
                    key={tab}
                    className={`tabs-item ${activeTab === tab ? 'active': ''} cursor-pointer`}
                    onClick={() => setActiveTab(tab)}
                >
                    <div className="tabs-item-title">{title}</div>
                    {activeTab === tab && (
                        <div className="tabs-item-marker" style={{ width: `${progress}%` }}></div>
                    )}
                </div>
            ))}
        </div>
    )
})

export default Tabs
