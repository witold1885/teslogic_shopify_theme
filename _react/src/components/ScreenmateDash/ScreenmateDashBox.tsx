import React, { useMemo } from 'react'
import './screenmate-dash-box.scss'
import { Image } from '../Common'
import boxImageDesktop from '../../assets/images/screenmate-dash/box/box-image-desktop.png'
import boxImageRetina from '../../assets/images/screenmate-dash/box/box-image-retina.png'

import { mapSimpleConfigs, useAnime, type AnimatedObjectOptions } from '../../hooks/anime'
import { useInlineStyles } from '../../hooks/inline-styles'

const animatedObjects: Record<string, AnimatedObjectOptions> = {
    top: { yFrom: '40px', duration: 666 },
    title: { yFrom: '40px', duration: 666 },
    description: { yFrom: '40px', duration: 666 },
    image: { yFrom: '40px', duration: 666 },
    item: { yFrom: '20px', duration: 333 },
}

const ellipseModules: Record<string, any> = import.meta.glob('@/assets/images/screenmate-dash/box/box-ellipse-*.png', { eager: true })
const ellipses: Record<string, any> = Object.entries(ellipseModules).reduce((acc, [key, mod]) => ({
    ...acc,
    [key.replace('/src/assets/images/screenmate-dash/box/box-ellipse-', '').replace('.png', '')]: mod.default
}), {})

const itemImageModules: Record<string, any> = import.meta.glob('@/assets/images/screenmate-dash/box/box-item-*.png', { eager: true })
const itemImages: Record<string, any> = Object.entries(itemImageModules).reduce((acc, [key, mod]) => ({
    ...acc,
    [key.replace('/src/assets/images/screenmate-dash/box/box-item-', '').replace('.png', '')]: mod.default
}), {})

const chargerImageModules: Record<string, any> = import.meta.glob('@/assets/images/screenmate-dash/box/box-charger-*.png', { eager: true })
const chargerImages: Record<string, any> = Object.entries(chargerImageModules).reduce((acc, [key, mod]) => ({
    ...acc,
    [key.replace('/src/assets/images/screenmate-dash/box/box-charger-', '').replace('.png', '')]: mod.default
}), {})

const chargerItemImageModules: Record<string, any> = import.meta.glob('@/assets/images/screenmate-dash/box/box-charger-item-*.png', { eager: true })
const chargerItemImages: Record<string, any> = Object.entries(chargerItemImageModules).reduce((acc, [key, mod]) => ({
    ...acc,
    [key.replace('/src/assets/images/screenmate-dash/box/box-charger-item-', '').replace('.png', '')]: mod.default
}), {})

const ChargerImages: React.FC = () => (
    <div className="box_block-charger-images">
        {['image', 'photo'].map(type => (
            <div className="box_block-charger-images-item" key={type}>
                {type === 'image' && (
                    <Image
                        className="box_block-charger-images-ellipse"
                        src={ellipses['355-desktop']}
                        srcSet={`${ellipses['355-retina']} 2x`}
                    />
                )}
                <Image                    
                    className={`box_block-charger-images-${type}`}
                    src={chargerImages[`${type}-desktop`]}
                    srcSet={`${chargerImages[`${type}-retina`]} 2x`}
                />
            </div>
        ))}
    </div>
)

const ScreenmateDashBox: React.FC = () => {
    const { isMobile } = useInlineStyles()

    const mode = useMemo(() => !isMobile ? 'desktop' : 'mobile', [isMobile])

    const items = [
        { name: 'Screenmate Dash transmitter' },
        { name: 'Magsafe Magnet' },
        { name: 'Phone Holder' },
        { name: 'Transmitter Wiring' },
        { name: 'Plastic Tool' },
    ].map((item, index) => ({
        ...item,
        big: index === 0,
        ellipseSize: index === 0 ? '234' : '170',
        image: itemImages[`${index + 1}-desktop`],
        retina: itemImages[`${index + 1}-retina`]
    }))

    const chargerItems = useMemo(() => [
        { description: '90 Degree USB Type C to USB Type C Adapter for Convenient Charging Connection' },
        { description: 'USB Type C to USB Type A Adapter for Tesla Model 3 Cars' },
    ].map((item, index) => ({
        ...item,
        image: chargerItemImages[`${index + 1}-${mode}`],
        retina: chargerItemImages[`${index + 1}-${mode}-retina`]
    })), [mode])

    const animationConfigs = useMemo(() => mapSimpleConfigs({
        ...animatedObjects,
        ...items.reduce((acc, _, index) => ({ ...acc, [`item-${index}`]: animatedObjects.item }), {}),
        ...chargerItems.reduce((acc, _, index) => ({ ...acc, [`charger-item-${index}`]: animatedObjects.item }), {})
    }), [chargerItems])

    const { anime } = useAnime(animationConfigs)

    return (
        <div className="box_block" id="box_block">
            <div className="box_block-wrap">
                <div {...anime('top')} className="box_block-top">
                    <div className="box_block-info">
                        <div className="box_block-info-title">
                            <span className="box_block-info-title-what">What’s</span> in the box
                        </div>
                        <div className="box_block-info-description">
                            {!isMobile ? (<>
                                In the box, you will find a Screenmate Dash transmitter and everything you need to install it, as well as a holder for placing the phone where you are used to seeing the car dashboard.
                            </>) : (<>
                                <div>In the box, you will find a Screenmate Dash transmitter and everything you need to install it.</div>
                                <div>Also a holder for placing the phone where you are used to seeing the car dashboard is included</div>
                            </>)}
                        </div>
                    </div>
                    <Image className="box_block-image" src={boxImageDesktop} srcSet={`${boxImageRetina} 2x`} />
                </div>
                <div className="box_block-items">
                    {items.map(({ name, big, ellipseSize, image, retina }, index) => (
                        <div {...anime(`item-${index}`)} className={`box_block-item ${big ? 'box_block-item-big' : ''}`} key={index}>
                            <div className="box_block-item-top">
                                <Image
                                    className="box_block-item-ellipse"
                                    src={ellipses[`${ellipseSize}-desktop`]}
                                    srcSet={`${ellipses[`${ellipseSize}-retina`]} 2x`}
                                />
                                <Image
                                    className="box_block-item-image"
                                    src={image}
                                    srcSet={`${retina} 2x`}
                                />
                            </div>
                            <div className="box_block-item-name">{name}</div>
                        </div>
                    ))}
                </div>
                <div className="box_block-charger">
                    {!isMobile && <ChargerImages />}
                    <div className="box_block-charger-info">
                        <div {...anime('title')} className="box_block-charger-info-title">Additional Wireless Charger</div>
                        <div {...anime('description')} className="box_block-charger-info-description">
                            {!isMobile ? (<>
                                This magnetic charger installs on a phone holder instead of a magnet. It is compatible with the iPhone 12 and above, as well as any phone that supports wireless charging (when using the included magnetic ring).
                            </>) : (<>
                                <div>This magnetic charger installs on a phone holder instead of a magnet. </div>
                                <div>It is compatible with the iPhone 12 and above, as well as any phone that supports wireless charging (when using the included magnetic ring).</div>
                            </>)}
                        </div>
                        {isMobile && <ChargerImages />}
                        <div className="box_block-charger-items">
                            {chargerItems.map(({ description, image, retina }, index) => (
                                <div {...anime(`charger-item-${index}`)} className="box_block-charger-item" key={index}>
                                    <div className="box_block-charger-item-image">
                                        <Image
                                            className="box_block-charger-item-image-ellipse"
                                            src={ellipses['86-desktop']}
                                            srcSet={`${ellipses['86-retina']} 2x`}
                                        />
                                        <Image
                                            className={`box_block-charger-item-image-image box_block-charger-item-image-image-${index + 1}`}
                                            src={image}
                                            srcSet={`${retina} 2x`}
                                        />
                                    </div>
                                    <div className="box_block-charger-item-description">{description}</div>
                                </div>
                            ))}
                        </div>
                    </div>			
                </div>
            </div>
        </div>
    )
}

export default ScreenmateDashBox
