import { useState, useMemo, useCallback, type FC } from 'react'
import './screenmate-dash-shortcuts.scss'
import { useAppSelector } from '../../redux/hooks'
import { fetchContent } from '../../redux/selectors/content'
import Icon from '../Common/Icon'
import Image from '../Common/Image'
import topIcon from '../../assets/icons/screenmate-dash/shortcuts/shortcuts-top-icon.svg'
import chevron from '../../assets/icons/screenmate-dash/shortcuts/shortcuts_mobile_chevron.svg'

import { mapSimpleConfigs, useAnime, type AnimatedObjectOptions } from '../../hooks/anime'
import { useInlineStyles } from '../../hooks/inline-styles'

const animatedObjects: Record<string, AnimatedObjectOptions> = {
    title: { yFrom: '40px', duration: 666 },
    subtitle: { yFrom: '40px', duration: 666 },
    info: { yFrom: '20px', duration: 333 },
    background: { yFrom: '40px', duration: 666 },
    item: { yFrom: '20px', duration: 333 },
}

const imageModules: Record<string, any> = import.meta.glob('@/assets/images/screenmate-dash/shortcuts/shortcuts-*.png', { eager: true })
const images: Record<string, any> = Object.entries(imageModules).reduce((acc, [key, mod]) => ({
    ...acc,
    [key.replace('/src/assets/images/screenmate-dash/shortcuts/shortcuts-', '').replace('.png', '')]: mod.default
}), {})

const iconModules: Record<string, any> = import.meta.glob('@/assets/icons/screenmate-dash/shortcuts/shortcuts-*.svg', { eager: true })
const icons: Record<string, any> = Object.entries(iconModules).reduce((acc, [key, mod]) => ({
    ...acc,
    [key.replace('/src/assets/icons/screenmate-dash/shortcuts/shortcuts-', '').replace('.svg', '')]: mod.default
}), {})

const blogs: string[] = ['performance-driv-ing-modes', 'safety-stability-features', 'convenien-ce-comfort', 'autopilot-tweaks-beta']

const ScreenmateDashShortcuts: FC = () => {
    const { isMobile } = useInlineStyles()

    const { features } = useAppSelector(fetchContent)

    const mode = useMemo(() => !isMobile ? 'desktop' : 'mobile', [isMobile])

    const [contentOpened, setContentOpened] = useState<string[]>([])

    const handleContentToggle = useCallback((slug: string) => {
        if (isMobile) {
            setContentOpened(prev => prev.includes(slug) ? prev.filter(item => item !== slug) : [ ...prev, slug ])
        }
    }, [isMobile])

    const infoBlocks = useMemo(() => [
        {
            className: 'shortcuts-info-block-text',
            content: <>
                <div className="shortcuts-info-block-text-primary">"Screenmate Shortcuts" is a set of convenient commands that enable you to manage auxiliary vehicle systems not found in Tesla's basic functionality.</div>
                <div className="shortcuts-info-block-text-secondary">These commands add convenience without affecting the driving process or compromising vehicle safety</div>     
            </>
        },
        {
            className: 'shortcuts-info-block-car shortcuts-info-block-relative',
            content: <>
                <div className="shortcuts-info-block-background">
                    <Image src={images[`car-bg-${mode}`]} srcSet={images[`car-bg-${mode}-retina`]} />
                </div>
                <div className="shortcuts-info-block-image">
                    <Image src={images[`iphone-${mode}`]} srcSet={images[`iphone-${mode}-retina`]} />
                </div>
            </>
        },
        {
            className: 'shortcuts-info-block-artboard shortcuts-info-block-between',
            content: <>
                <div className="shortcuts-info-block-between-image shortcuts-info-artboard-image">
                    <Image className="shortcuts-info-artboard-image" src={images[`artboard-${mode}`]} srcSet={images[`artboard-${mode}-retina`]} />
                </div>
                <div className="shortcuts-info-block-between-text shortcuts-info-artboard-text">
                    To activate Shortcuts, you need to switch the Active Control toggle to the "on" position using a pin or any other object.
                </div>
            </>
        },
        {
            className: 'shortcuts-info-block-info shortcuts-info-block-between',
            content: <>
                <div className="shortcuts-info-block-between-image shortcuts-info-info-image">
                    <Icon icon={icons[`info-icon-${mode}`]} />
                </div>
                <div className="shortcuts-info-block-between-text shortcuts-info-info-text">
                    Shortcuts settings and changes are stored within the transmitter, enabling them to function when the phone is disconnected.
                </div>
            </>
        },
    ], [mode])

    const animationConfigs = useMemo(() => mapSimpleConfigs({
        ...animatedObjects,
        ...infoBlocks.reduce((acc, _, index) => ({ ...acc, [`info-${index}`]: animatedObjects.info }), {}),
        ...blogs.filter(key => features?.[key] || false).reduce((acc, key) => ({
            ...acc,
            ...features?.[key].items?.reduce((obj, _, i) => ({
                ...obj,
                [`item-${key}-${i}`]: animatedObjects.item
            }), {})
        }), {})
    }), [infoBlocks, features])

    const { anime } = useAnime(animationConfigs)

    return (
        <div id="shortcuts" className="shortcuts">
            <div className="shortcuts-wrap">
                <div {...anime('title')} className="shortcuts-title">
                    <div className="shortcuts-title-text">Screenmate Shortcuts:</div>
                    <div className="shortcuts-title-icon">
                        <Icon icon={topIcon} />
                    </div>	
                </div>
                <div {...anime('subtitle')} className="shortcuts-subtitle">
                    Maximize your driving comfort with an innovative set of commands
                </div>
                <div className="shortcuts-info">
                    {infoBlocks.map(({ className, content }, index) => (
                        <div {...anime(`info-${index}`)} className={`shortcuts-info-block ${className}`} key={index}>
                            {content}
                        </div>
                    ))}
                </div>
                <div {...anime('background')} className="shortcuts-features">
                    {blogs.filter(key => features?.[key] || false).map((key, index) => {
                        const { title, items } = features?.[key] || {}
                        return items?.length !== 0 ? (
                            <div className={`shortcuts-features-block shortcuts-features-block-${index + 1}`} key={key}>
                                <div className="shortcuts-features-block-title">{title}</div>
                                <div className="shortcuts-features-block-items">
                                    {items?.map((item, i) => (
                                        <div
                                            key={i}
                                            {...anime(`item-${key}-${i}`)}
                                            className={`shortcuts-features-block-item shortcuts-features-block-item-${i} ${
                                                contentOpened.includes(`${key}-${i}`) ? 'opened' : ''
                                            }`}
                                        >
                                            <div className="shortcuts-features-block-item-top">
                                                <div
                                                    className="shortcuts-features-block-item-title"
                                                    onClick={() => handleContentToggle(`${key}-${i}`)}
                                                >
                                                    <span>{item.title}</span>
                                                    <Icon icon={chevron} />
                                                </div>
                                                <div className="shortcuts-features-block-item-icon">
                                                    <Icon icon={item.image} />
                                                </div>
                                            </div>
                                            <div
                                                className="shortcuts-features-block-item-content"
                                                dangerouslySetInnerHTML={{ __html: item.content }}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : null
                    })}
                </div>
            </div>
        </div>
    )
}

export default ScreenmateDashShortcuts
