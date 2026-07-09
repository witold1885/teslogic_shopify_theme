import { forwardRef, useMemo, useState } from 'react'
import { Heading, Tabs, type TabProps, Video } from '../Common'
import {
    streaming as streamingVideo,
    navigation as navigationVideo,
    gaming as gamingVideo,
    social as socialVideo
} from '../../assets/videos/screenmate-one'
import {
    streaming as streamingBackground,
    navigation as navigationBackground,
    gaming as gamingBackground,
    social as socialBackground
} from '../../assets/videos/screenmate-one/backgrounds'

import { mapSimpleConfigs, useAnime, type AnimatedObjectOptions } from '../../hooks/anime'

const animatedObjects: Record<string, AnimatedObjectOptions> = {
    title: { yFrom: '40px', duration: 666 },
    subtitle: { yFrom: '40px', duration: 666 },
    video: { yFrom: '40px', duration: 666 },
    tabs: { yFrom: '20px', duration: 333 },
    text: { yFrom: '20px', duration: 333 },
}

const ScreenmateOneSetup = forwardRef<HTMLDivElement, {}>(({}, ref) => {
    const tabs: Record<string, TabProps> = {
        streaming: {
            title: 'Streaming',
            text: <>Enjoy premium streaming of your favorite movies, TV shows,<br />music, and more with smooth, high-quality playback.</>,
            video: streamingVideo,
            background: streamingBackground,
            timeout: 13000
        },
        navigation: {
            title: 'Navigation',
            text: <>Use the navigation apps you love, right on your Tesla’s display.</>,
            video: navigationVideo,
            background: navigationBackground,
            timeout: 7000
        },
        gaming: {
            title: 'Gaming',
            text: <>Bring mobile gaming to your Tesla’s screen<br />with Google Play Games.</>,
            video: gamingVideo,
            background: gamingBackground,
            timeout: 7000
        },
        social: {
            title: 'Social & Messaging',
            text: <>Stay connected on the go with quick access to social media,<br />email, video calls, and messaging apps.</>,
            video: socialVideo,
            background: socialBackground,
            timeout: 13000
        },
    }

    const [activeTab, setActiveTab] = useState<string | null>(Object.keys(tabs)[0])

    const animationConfigs = useMemo(() => mapSimpleConfigs(animatedObjects), [])
        
    const { anime } = useAnime(animationConfigs)
    
    return (
        <div ref={ref} className="screenmate-one__setup">
            <div className="container flex-column-center gap-64 mob:gap-28">
                <div className="flex-column-center gap-24 mob:flex-column-start mob:gap-12">
                    <Heading {...anime('title')} title="Your Screen, Your Setup" />
                    <div {...anime('subtitle')} className="screenmate-one__setup-subtitle">
                        Use the apps you already know and love.
                    </div>
                </div>
                <div className="w-full flex-column-center gap-32 mob:gap-8">
                    <div {...anime('video')} className="screenmate-one__setup-video">
                        {Object.entries(tabs).map(([tab, { video, background }]) => (
                            <Video className={tab === activeTab ? '' : 'hidden'} key={tab} src={video as string} background={background} />
                        ))}
                    </div>
                    <div className="flex-column-center gap-32 mob:flex-column mob:gap-24">
                        <Tabs {...anime('tabs')} {...{tabs, activeTab, setActiveTab}} />
                        {activeTab && tabs[activeTab] && (
                            <div {...anime('text')} className="screenmate-one__setup-text">{tabs[activeTab].text}</div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
})

export default ScreenmateOneSetup
