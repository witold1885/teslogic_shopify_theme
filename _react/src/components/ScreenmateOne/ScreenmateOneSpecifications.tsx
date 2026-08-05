import React, { useMemo, useState, type ReactNode } from 'react'
import './screenmate-one-specifications.scss'
import { Heading, Icon, Image, Tabs, type ImageProps, type TabProps } from '../Common'

import dimensionsSketchDesktop from '../../assets/images/screenmate-one/dimensions-sketch-desktop.png'
import dimensionsSketchMobile from '../../assets/images/screenmate-one/dimensions-sketch-mobile.png'

import chipset from '../../assets/icons/screenmate-one/chipset.svg'
import gpu from '../../assets/icons/screenmate-one/gpu.svg'
import memory from '../../assets/icons/screenmate-one/memory.svg'
import storage from '../../assets/icons/screenmate-one/storage.svg'
import android from '../../assets/icons/screenmate-one/android.svg'
import bluetooth from '../../assets/icons/screenmate-one/bluetooth.svg'
import displayPort from '../../assets/icons/screenmate-one/display-port.svg'
import wiFi from '../../assets/icons/screenmate-one/wi-fi.svg'
import hdmi from '../../assets/icons/screenmate-one/hdmi.svg'
import can from '../../assets/icons/screenmate-one/can.svg'
import usb from '../../assets/icons/screenmate-one/usb.svg'
import fpd from '../../assets/icons/screenmate-one/fpd.svg'

import model31723 from '../../assets/images/screenmate-one/models/model-3-17-23.png'
import model324Highland from '../../assets/images/screenmate-one/models/model-3-24-highland.png'
import modelY2024 from '../../assets/images/screenmate-one/models/model-y-20-24.png'
import modelY25Juniper from '../../assets/images/screenmate-one/models/model-y-25-juniper.png'
import modelS21 from '../../assets/images/screenmate-one/models/model-s-21.png'
import modelX21 from '../../assets/images/screenmate-one/models/model-x-21.png'

import installationImage from '../../assets/images/screenmate-one/installation.png'
import ArrowTopRightBlueIcon from '../../assets/icons/ArrowTopRightBlueIcon'

import { mapSimpleConfigs, useAnime, type AnimatedObjectOptions } from '../../hooks/anime'
import { useInlineStyles } from '../../hooks/inline-styles'
import { useHorizontalScroll } from '../../hooks/horizontal-scroll'

const specificationsAnimatedObjects: Record<string, AnimatedObjectOptions> = {
    title: { yFrom: '40px', duration: 666 },
    content: { yFrom: '40px', duration: 666 },
    tabs: { yFrom: '20px', duration: 333 },
}

const installationAnimatedObjects: Record<string, AnimatedObjectOptions> = {
    body: { yFrom: '40px', duration: 666 },
    title: { yFrom: '40px', duration: 666 },
    texts: { yFrom: '20px', duration: 333 },
    links: { yFrom: '20px', duration: 333 },
}

interface ContentGridItemProps {
    icon?: string
    image?: string
    title: string
    subtitle?: string
    text?: ReactNode
}

const ContentGridInfoItem: React.FC<ContentGridItemProps> = ({ icon, title, text }) => (
    <div className="screenmate-one__specifications-body-content-grid-item info-item">
        <div className="flex-start-center gap-8">
            <Icon className="flex-center" icon={icon as string} />
            <span className="font-manrope-16 mob:font-manrope-14 font-600 text-darkgrey uppercase">{title}</span>
        </div>
        <div className="font-manrope-20 mob:font-manrope-16">{text}</div>
    </div>
)

const ContentGridImageItem: React.FC<ContentGridItemProps> = ({ image, title, subtitle }) => (
    <div className="screenmate-one__specifications-body-content-grid-item image-item">
        <Image className="screenmate-one__specifications-body-content-grid-item-image" src={image as string} />
        <div className="flex-column font-manrope-24 mob:font-manrope-16 font-500">
            <div>{title}</div>
            <div className="text-darkgrey whitespace-nowrap">{subtitle}</div>
        </div>
    </div>
)

interface ContentProps {
    title: string
    subtitle: ReactNode
    items: ContentGridItemProps[]
    cols: number
}

const Content: React.FC<ContentProps> = ({ title, subtitle, items, cols }) => {
    const { isMobile } = useInlineStyles()
    return (<>
        <div className="screenmate-one__specifications-body-content-top">
            <div className="font-manrope-52 mob:font-manrope-28 font-500">{title}</div>
            <div className="font-manrope-20 mob:font-manrope-14">{subtitle}</div>
        </div>
        <div
            className="screenmate-one__specifications-body-content-grid"
            style={{ gridTemplateColumns: `repeat(${!isMobile ? cols : 1}, 1fr)` }}
        >
            {items.map((item, index) => {
                const Component = item.image ? ContentGridImageItem : ContentGridInfoItem
                return <Component {...item} key={index} />
            })}
        </div>
    </>)
}

const installation: Record<string, any[]> = {
    texts: [
        <>
            Screenmate ONE installs in about 10 minutes with a <br />
            simple, non-invasive setup. The unit fits neatly into the <br />
            compartment under the center console, keeping the <br />
            installation clean and fully integrated.
        </>,
        <>
            The setup process is straightforward, but if you need <br />
            assistance, you can contact one of our trusted installers <br />
            or visit a local service center that works with Tesla <br />
            accessories.
        </>
    ],
    links: [
        { text: 'Where to install', url: '/pages/where-to-install' },
        { text: 'Manuals', url: '/pages/one-manuals' },
    ]
}

const ScreenmateOneInstallation: React.FC = () => {
    const animationConfigs = useMemo(() => {
        let configs = { ...installationAnimatedObjects }
        for (const [key, items] of Object.entries(installation)) {
            for (const index of Object.keys(items)) {
                configs[`${key}-${index}`] = installationAnimatedObjects[key]
            }
        }
        return mapSimpleConfigs(configs)
    }, [])
    
    const { anime } = useAnime(animationConfigs)

    return (
        <div {...anime('body')} className="screenmate-one__specifications-installation">
            <div className="screenmate-one__specifications-installation-info">
                <div className="flex-column gap-24 mob:gap-12">
                    <div {...anime('title')} className="font-manrope-52 mob:font-manrope-32 font-600">Effortless <br />Installation</div>
                    <div className="flex-column gap-20 mob:gap-12 font-manrope-20 mob:font-manrope-16">
                        {installation.texts.map((text, index) => <div {...anime(`texts-${index}`)} key={index}>{text}</div>)}
                    </div>
                </div>
                <div className="flex gap-32 mob:gap-20 font-manrope-24 mob:font-manrope-16 font-500">
                    {installation.links.map(({ text, url }, index) => (
                        <a {...anime(`links-${index}`)} className="flex gap-12 mob:gap-8" href={url} target="_blank" key={index}>
                            <span>{text}</span>
                            <Icon className="flex-center" svg={<ArrowTopRightBlueIcon />} />
                        </a>
                    ))}
                </div>
            </div>
            <Image className="screenmate-one__specifications-installation-image" src={installationImage} />
        </div>
    )
}

const getTabs = (isMobile: boolean) => {
    return {
        'dimensions': {
            title: <>Dimensions</>,
            content: { type: 'image', className: 'flex-center', src: !isMobile ? dimensionsSketchDesktop : dimensionsSketchMobile }
        },
        'main-system': {
            title: <>Main System</>,
            content: {
                title: 'Main System',
                subtitle: <>
                    Screenmate ONE runs Screenmate OS <br />
                    on a Qualcomm Android system-on-module.
                </>,
                items: [
                    { icon: chipset, title: 'Chipset', text: <>Qualcomm SM6225</> },
                    { icon: memory, title: 'Memory', text: <>8 GB LPDDR4X RAM</> },
                    { icon: chipset, title: 'CPU', text: <>Quad-core ARM Cortex-A73 up to 2.4 GHz, <br />Quad-core ARM Cortex-A53 up to 1.9 GHz</> },
                    { icon: storage, title: 'Storage', text: <>128 GB UFS</> },
                    { icon: gpu, title: 'GPU', text: <>Adreno 610</> },
                    { icon: android, title: 'Operating system', text: <>Screenmate OS, based on Android 14</> },
                ],
                cols: 2
            }
        },
        'microcontrollers': {
            title: <>Microcontrollers</>,
            content: {
                title: 'Microcontrollers',
                subtitle: <>
                    Screenmate ONE includes dedicated microcontrollers used for Bluetooth Low Energy <br />
                    communication, vehicle integration, video interface control, and other system functions.
                </>,
                items: [
                    { icon: bluetooth, title: 'Bluetooth Low Energy microcontroller', text: <>Nordic nRF52840, ARM Cortex-M4, 64 MHz, 1 MB flash, 256 KB SRAM</> },
                    { icon: chipset, title: 'Additional system microcontrollers', text: <>2 x STM32G, ARM Cortex-M4, 170 MHz, 512 KB flash</> },
                ],
                cols: 1
            }
        },
        'interfaces': {
            title: <>Interfaces</>,
            content: {
                title: 'Interfaces',
                subtitle: <>
                    Screenmate ONE includes interfaces for video input, data, power, <br />
                    vehicle communication, and external device connection.
                </>,
                items: [
                    { icon: displayPort, title: 'Video In', text: <>USB-C DisplayPort Alt Mode input</> },
                    { icon: displayPort, title: 'Charge In / Backup Power', text: <>USB Power Delivery charger input</> },
                    { icon: wiFi, title: 'Wi-Fi', text: <>802.11 a/b/g/n/ac</> },
                    { icon: hdmi, title: 'HDMI In', text: <>Micro HDMI input, available on product <br />versions equipped with HDMI input</> },
                    { icon: can, title: 'Vehicle communication', text: <>3 x automotive CAN bus interfaces</> },
                    { icon: bluetooth, title: 'Bluetooth', text: <>Bluetooth 5.0 BR/EDR/BLE through <br />the Android system module</> },
                    { icon: usb, title: 'USB data', text: <>USB 3.1 data interface</> },
                    { icon: fpd, title: 'Video interface', text: <>2 x FPD video interfaces</> },
                    { icon: bluetooth, title: 'Screenmate Dash app output', text: <>Bluetooth 5.4</> },
                ],
                cols: 3
            }
        },
        'compatibility': {
            title: <>Compatibility</>,
            content: {
                title: 'Compatible Models',
                subtitle: <>
                    Screenmate ONE is designed for compatible Tesla vehicles. Compatibility depends on the vehicle <br />
                    model, production year, display interface, and the selected Screenmate ONE hardware version.
                </>,
                items: [
                    { image: model31723, title: 'Model 3', subtitle: '‘17-23' },
                    { image: model324Highland, title: 'Model 3', subtitle: '‘24+(Highland)' },
                    { image: modelY2024, title: 'Model Y', subtitle: '‘20-24' },
                    { image: modelY25Juniper, title: 'Model Y', subtitle: '‘25+(Juniper)' },
                    { image: modelS21, title: 'Model S', subtitle: '‘21+' },
                    { image: modelX21, title: 'Model X', subtitle: '‘21+' },
                ],
                cols: 3
            }
        },
    }
}

const ScreenmateOneSpecifications: React.FC = () => {
    const { isMobile } = useInlineStyles()
    const { elementRef: scrollRef, scrollLeft, scrollRight } = useHorizontalScroll<HTMLDivElement>()
    
    const tabs: Record<string, TabProps> = useMemo(() => getTabs(isMobile), [isMobile])
    
    const firstTab = Object.keys(tabs)[0] || null
    const [activeTab, setActiveTab] = useState<string | null>(firstTab)
    
    const animationConfigs = useMemo(() => mapSimpleConfigs(specificationsAnimatedObjects), [])
        
    const { anime } = useAnime(animationConfigs)
    
    return (
        <div className="screenmate-one__specifications">
            <Heading {...anime('title')} title="Technical Specifications" />
            <div className="flex-column gap-150 mob:gap-96">
                <div className="screenmate-one__specifications-body">
                    <div {...anime('content')} className="screenmate-one__specifications-body-content">
                        {activeTab && tabs[activeTab]?.content && (
                            tabs[activeTab].content.type === 'image' ? (
                                <Image {...tabs[activeTab].content as ImageProps} />
                            ) : (
                                <Content {...tabs[activeTab].content as ContentProps} />
                            )
                        )}
                    </div>
                    <div {...anime('tabs')} className="screenmate-one__specifications-tabs-wrap">
                        <div className="screenmate-one__specifications-tabs-fix" style={{ zIndex: scrollLeft <= 0 ? 1 : -1 }}></div>
                        <Tabs ref={scrollRef} {...{tabs, activeTab, setActiveTab}} autoplay={false} />
                        <div className="screenmate-one__specifications-tabs-fix" style={{ zIndex: scrollLeft >= scrollRight ? 0 : -1 }}></div>
                    </div>
                </div>
                <ScreenmateOneInstallation />
            </div>
        </div>
    )
}

export default ScreenmateOneSpecifications
