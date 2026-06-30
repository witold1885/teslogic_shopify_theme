import React, { Fragment, useMemo, useState, type CSSProperties, type ReactNode } from 'react'
import { Heading, Icon, Image, Popup, Video } from '../Common'

import dualViewModeImage from '../../assets/images/screenmate-one/dual-view-mode.png'
import beyondBasicControlsImage from '../../assets/images/screenmate-one/beyond-basic-controls.png'
import {
    dualViewMode as dualViewModeVideo,
    beyondBasicControls as beyondBasicControlsVideo
} from '../../assets/videos/screenmate-one'
import frontCameraIntegration from '../../assets/images/screenmate-one/front-camera-integration.png'

import pointerTopLeftDesktop from '../../assets/images/screenmate-one/pointers/pointer-top-left-desktop.svg'
import pointerTopRightDesktop from '../../assets/images/screenmate-one/pointers/pointer-top-right-desktop.svg'
import pointerBottomLeftDesktop from '../../assets/images/screenmate-one/pointers/pointer-bottom-left-desktop.svg'
import pointerBottomRightDesktop from '../../assets/images/screenmate-one/pointers/pointer-bottom-right-desktop.svg'

import pointerTopLeftMobile from '../../assets/images/screenmate-one/pointers/pointer-top-left-mobile.svg'
import pointerTopRightMobile from '../../assets/images/screenmate-one/pointers/pointer-top-right-mobile.svg'
import pointerBottomLeftMobile from '../../assets/images/screenmate-one/pointers/pointer-bottom-left-mobile.svg'
import pointerBottomRightMobile from '../../assets/images/screenmate-one/pointers/pointer-bottom-right-mobile.svg'

import arrowIcon from '../../assets/icons/arrow-top-right-blue.svg'
import closeIcon from '../../assets/icons/close-rounded.svg'

import commandIcons from '../../assets/icons/screenmate-one/commands'
import chevronLeft from '../../assets/icons/chevron-small-left.svg'
import chevronRight from '../../assets/icons/chevron-small-right.svg'

import { getAnimationConfig, mapBlocksConfigs, useAnime, type AnimatedObjectOptions } from '../../hooks/anime'
import { useInlineStyles } from '../../hooks/inline-styles'

const animatedObjects: Record<string, AnimatedObjectOptions> = {
    heading: { yFrom: '40px', duration: 666 },
    title: { yFrom: '40px', duration: 666 },
    text: { yFrom: '40px', duration: 666 },
    subtext: { yFrom: '20px', duration: 333 },
    additional: { yFrom: '20px', duration: 333 },
    pointers: { yFrom: '20px', duration: 333 },
    image: { yFrom: '40px', duration: 666 },
}

interface Block {
    wrapClassName?: string
    topClassName?: string
    wrapGap?: number
    topGap?: number
    title: ReactNode
    text: ReactNode
    additional?: ReactNode
    image?: string
    video?: string
    pointers?: Record<string, Pointer>
}

interface Command {
    type: 'button' | 'range' | 'switch' | 'control'
    icon?: string
    text?: string
    content?: ReactNode
    options?: ReactNode[]
    title: ReactNode
    num?: number
    typeCount?: number
}

const CommandItem: React.FC<Command> = ({ type, icon, text, content, options, title, num, typeCount }) => {
    const { isMobile, responsive } = useInlineStyles()
    const className = type === 'button' ? 'flex-start-center gap-20 mob:flex-column-center' : 'flex-column mob:flex-column-center gap-16'
    const isLastOdd = type === 'button' && typeCount as number % 2 === 1 && num === typeCount as number - 1
    const itemStyle = isMobile && isLastOdd ? { gridColumn: 'span 2' } : {}
    const optionWidth: string = type === 'control' ? (
        options?.length as number <= 4 ? (!isMobile ? '107px' : '77.5px') : (!isMobile ? '79px' : '38.75px')
    ) : 'auto'
    return (
        <div
            className={`screenmate-one__convenience-commands-grid-item ${className}`}
            style={itemStyle}
        >        
            <div className={`screenmate-one__convenience-commands-grid-item-content ${type}`}>
                {type === 'button' && (<>
                    {icon && <Icon className="flex-center" icon={icon} />}
                    {text && <div>{text}</div>}
                </>)}
                {type === 'range' && (<>
                    <Icon className="chevron" icon={chevronLeft} />
                    {content}
                    <Icon className="chevron" icon={chevronRight} />
                </>)}
                {(type === 'switch' || type === 'control') && (<>
                    {options?.map((option, index) => (
                        <div
                            key={index}
                            className="flex-center"
                            style={index !== 0 && index !== options.length - 1 ? responsive({ width: optionWidth }) : {}}
                        >
                            {option}
                        </div>
                    ))}
                </>)}
            </div>
            <div className="screenmate-one__convenience-commands-grid-item-title">{title}</div>
        </div>
    )
}

interface Pointer {
    title: string
    text: ReactNode
    legendStyle?: CSSProperties
    image: string
    imageStyle?: CSSProperties
}

const ScreenmateOneConvenience: React.FC = () => {
    const { isMobile, responsive } = useInlineStyles()

    const blocks: Record<string, Block> = useMemo(() => ({
        'dual-view-mode': {
            wrapClassName: 'flex-column',
            topClassName: 'w-full flex-between',
            wrapGap: 56,
            title: 'Dual View Mode',
            text: <>
                Place any two apps side by side, or keep the Tesla interface on one <br />
                side and an app on the other. Resize and rearrange elements freely <br />
                for a layout optimized for comfort, clarity, and ease of use.
            </>,
            image: dualViewModeImage,
            video: dualViewModeVideo
        },
        'key-driving-info': {
            wrapClassName: 'flex-column',
            topClassName: 'w-full flex-between',
            title: 'Key Driving Info',
            text: <>
                The Dashboard keeps vital information visible while <br />
                you run apps, so you can check current speed, speed <br />
                limit, blind-spot warnings, battery charge, and more.
            </>,
            pointers: {
                'top-left': {
                    title: 'Cruise & Speed Limit',
                    text: <>Keep an eye on autopilot, <br />cruise control, and speed limit</>,
                    legendStyle: { top: !isMobile ? '156px' : '192px', left: !isMobile ? 0 : '24px' },
                    image: !isMobile ? pointerTopLeftDesktop : pointerTopLeftMobile,
                    imageStyle: { top: !isMobile ? '185px' : '224px', left : !isMobile ? '259.5px' : '24px' }
                },
                'top-right': {
                    title: 'Battery Status',
                    text: <>Monitor your Tesla's <br />battery status easily</>,
                    legendStyle: { top: !isMobile ? '156px' : '192px', right: !isMobile ? 0 : '24px' },
                    image: !isMobile ? pointerTopRightDesktop : pointerTopRightMobile,
                    imageStyle: { top: !isMobile ? '185px' : '224px', right : !isMobile ? '191.5px' : '24px' }
                },
                'bottom-left': {
                    title: 'SI and Imperial',
                    text: <>Screenmate supports both SI <br />and Imperial measurement systems</>,
                    legendStyle: { top: !isMobile ? '376px' : '412px', left: !isMobile ? 0 : '24px' },
                    image: !isMobile ? pointerBottomLeftDesktop : pointerBottomLeftMobile,
                    imageStyle: { top: !isMobile ? '376px' : '353px', left : !isMobile ? '182.25px' : '24px' }
                },
                'bottom-right': {
                    title: 'Blind Spot Alerts',
                    text: <>Stay aware of surrounding traffic <br />with real-time blind spot alerts</>,
                    legendStyle: { top: !isMobile ? '376px' : '412px', right: !isMobile ? 0 : '24px' },
                    image: !isMobile ? pointerBottomRightDesktop : pointerBottomRightMobile,
                    imageStyle: { top: !isMobile ? '371.5px' : '371px', right : !isMobile ? '204px' : '24px' }
                }
            }
        },
        'beyond-basic-control': {
            wrapClassName: 'flex-wrap flex-between flex-end',
            topClassName: 'flex-column',
            wrapGap: 60,
            topGap: 12,
            title: 'Beyond Basic Controls',
            text: <>
                The compact Control Panel puts essential commands <br />
                and extra vehicle controls right at your fingertips, all just <br />
                one swipe away. Fully customizable to match your needs.
            </>,
            additional: <>
                <div>Choose from 50 commands <br />to build your own control panel.</div>
                <a className="flex-start-center gap-12 font-500 text-blue" onClick={() => setCommandsPopupOpen(true)}>
                    <span>View full command list</span>
                    <Icon className="flex-center" icon={arrowIcon} />
                </a>
            </>,
            image: beyondBasicControlsImage,
            video: beyondBasicControlsVideo
        },
        'front-camera-integration': {
            wrapClassName: 'flex-between mob:flex-column',
            topClassName: 'flex-column',
            topGap: 20,
            title: <>Front Camera <br />Integration</>,
            text: <>
                Bring a live front camera view to your <br />
                Tesla screen for added confidence <br />
                when parking, maneuvering in tight <br />
                spaces, or approaching curbs.
            </>,
            image: frontCameraIntegration
        }
    }), [isMobile])

    const [commandsPopupOpen, setCommandsPopupOpen] = useState<boolean>(false)

    const commands: Record<string, Command[]> = {
        'CLIMATE': [
            { type: 'button', icon: commandIcons['climate'], title: <>Climate</> },
            { type: 'button', text: 'AUTO', title: <>Auto Climate</> },
            { type: 'button', icon: commandIcons['air-intake'], title: <>Air Intake</> },
            { type: 'button', icon: commandIcons['windshield-defroster'], title: <>Windshield <br />Defroster</> },
            { type: 'button', icon: commandIcons['rear-window-defroster'], title: <>Rear Window <br />Defroster</> },
            { type: 'button', icon: commandIcons['steering-wheel-heater'], title: <>Steering <br />Wheel Heater</> },
            { type: 'button', icon: commandIcons['seat-heaters-off'], title: <>Seat Heaters <br />(All off)</> },
            { type: 'button', icon: commandIcons['seat-heaters-rear'], title: <>Seat Heaters <br />(All rear)</> },
            { type: 'button', icon: commandIcons['seat-heaters-driver'], title: <>Seat Heaters <br />(Driver)</> },
            { type: 'button', icon: commandIcons['seat-heaters-front'], title: <>Seat Heaters <br />(Front Passenger)</> },
            { type: 'button', icon: commandIcons['seat-heaters-left'], title: <>
                Seat Heaters <br className="hidden mob:block" />(Rear <br className="mob:hidden" />Left  <br className="hidden mob:block" />Passenger)
            </> },
            { type: 'button', icon: commandIcons['seat-heaters-right'], title: <>
                Seat Heaters <br className="hidden mob:block" />(Rear <br className="mob:hidden" />Right  <br className="hidden mob:block" />Passenger)
            </> },
            { type: 'button', icon: commandIcons['seat-heaters-central'], title: <>
                Seat Heaters <br className="hidden mob:block" />(Rear <br className="mob:hidden" />Central <br />Passenger)
            </> },
            { type: 'button', icon: commandIcons['keep-climate-on'], title: <>Keep Climate On</> },
            { type: 'range', content: <>22°</>, title: <>Temperature Driver</> },
            { type: 'range', content: <div className="h-full flex-column-center-end gap-6">
                <div>22</div>
                <span className="uppercase">Passenger</span>
            </div>, title: <>Temperature Passenger</> },
            { type: 'switch', options: [<>SPLIT</>, <>SYNC</>], title: <>Split / Sync (Dual Zone)</> },
            { type: 'range', content: <div className="flex-center gap-4">
                <div>3</div>
                <Icon className="flex-center" icon={commandIcons['wind-flow']} />
            </div>, title: <>Wind flow level control</> },
            {
                type: 'switch',
                options: ['up', 'face', 'down'].map(direction => (
                    <Icon className="flex-center" icon={commandIcons[`airflow-direction-${direction}`]} />
                )),
                title: <>Airflow Direction</>
            }
        ],
        'Wipers & Washers': [
            { type: 'button', icon: commandIcons['wipers-off'], title: <>Wipers Off</> },
            { type: 'button', icon: commandIcons['wiper-service-mode'], title: <>Wiper Service <br />Mode</> },
            { type: 'button', icon: commandIcons['wiper-defrost'], title: <>Wiper Defrost</> },
            { type: 'control', options: [
                <div className="flex-center">
                    <Icon className="flex-center" icon={commandIcons['wiper-off']} />
                    <span>Off</span>
                </div>,
                <>I</>,
                <>II</>,
                <>III</>,
                <>IIII</>,
                <>Auto</>,
            ], title: <>Wiper Control Panel</> }
        ],
        'Lights': [
            { type: 'button', icon: commandIcons['auto-beam-lights'], title: <>Auto Beam Lights</> },
            { type: 'button', icon: commandIcons['front-fog-lights'], title: <>Front Fog Lights</> },
            { type: 'button', icon: commandIcons['rear-fog-lights'], title: <>Rear Fog Lights</> },
            { type: 'control', options: [
                <div className="flex-center">
                    <Icon className="flex-center" icon={commandIcons['headlights-off']} />
                    <span>Off</span>
                </div>,
                <>Parking</>,
                <>On</>,
                <>Auto</>,
            ], title: <>Headlights (Off / Parking / On / Auto)</> }
        ],
        'Mirrors & Ergonomics': [
            { type: 'button', icon: commandIcons['fold-mirrors'], title: <>Fold Mirrors</> },
            { type: 'button', icon: commandIcons['dim-mirrors'], title: <>Dim Mirrors</> }
        ],
        'Driving': [
            { type: 'button', icon: commandIcons['slippy-road-mode'], title: <>Slippy Road <br />Mode (4x4)</> },
            { type: 'button', icon: commandIcons['slip-start'], title: <>Slip Start <br />(Traction Control)</> },
            { type: 'button', icon: commandIcons['track-mode'], title: <>Track Mode <br />(Traction OFF)</> },
            { type: 'button', icon: commandIcons['drift-mode'], title: <>Drift Mode <br />(Traction OFF)</> },
            { type: 'button', icon: commandIcons['front-motor-disable'], title: <>Front Motor <br />Disable</> },
            { type: 'switch', options: [<>CHILL</>, <>STANDART</>], title: <>Acceleration (Chill / Standard) </> }
        ],
        'Service & Maintenance': [
            { type: 'button', icon: commandIcons['car-wash-mode'], title: <>Car Wash Mode</> }
        ],
        'Access': [
            { type: 'button', icon: commandIcons['child-lock-left'], title: <>Child Lock RL</> },
            { type: 'button', icon: commandIcons['child-lock-right'], title: <>Child Lock RR</> },
            { type: 'button', icon: commandIcons['lock-unlock'], title: <>Lock / Unlock</> },
            { type: 'button', icon: commandIcons['windows-lock'], title: <>Windows Lock</> },
            { type: 'button', icon: commandIcons['open-frunk'], title: <>Open Frunk</> },
            { type: 'button', icon: commandIcons['open-trunk'], title: <>Open Trunk</> },
            { type: 'button', icon: commandIcons['open-charge-port'], title: <>Open Charge <br className="hidden mob:block" />Port</> },
            { type: 'button', icon: commandIcons['open-front-passenger'], title: <>Open Front <br className="hidden mob:block" />Passenger</> },
            { type: 'button', icon: commandIcons['open-rear-left-door'], title: <>Open Rear <br className="hidden mob:block" />Left Door</> },
            { type: 'button', icon: commandIcons['open-rear-right-door'], title: <>Open Rear <br className="hidden mob:block" />Right Door</> }
        ],
        'Seats': [
            { type: 'range', content: <div className="flex-center gap-4">
                <Icon className="flex-center" icon={commandIcons['right-seat']} />
                <div className="screenmate-one__convenience-commands-font-18">Right Seat</div>
            </div>, title: <>Move Front Passenger Seat</> },
            { type: 'range', content: <div className="flex-center gap-8">
                <Icon className="flex-center" icon={commandIcons['backrest']} />
                <div className="screenmate-one__convenience-commands-font-18">Backrest</div>
            </div>, title: <>Move Front Passenger <br />Seat Backrest</> }            
        ],
        'Charging': [
            { type: 'button', icon: commandIcons['battery-preheat'], title: <>Battery Preheat</> },
            { type: 'button', icon: commandIcons['unlock-charge-port'], title: <>Unlock Charge Port</> }
        ]
    }

    const headingConfig = Object.values(animatedObjects.heading) as [string, number]
    const animationConfigs = useMemo(() => mapBlocksConfigs(blocks, animatedObjects, (blockKey: string, param: string) => {
        if (blockKey === 'beyond-basic-control' || blockKey === 'front-camera-integration') {
            if (param === 'text') return animatedObjects.subtext
        }
        return animatedObjects[param] || {}
    }), [])

    const { anime } = useAnime({
        heading: getAnimationConfig(...headingConfig),
        ...animationConfigs
    })

    return (
        <div className="screenmate-one__convenience">
            <div className="screenmate-one__convenience-wrap">
                <Heading {...anime('heading')} title="Built Around Everyday Convenience" />
                {Object.entries(blocks).map(([blockKey, { wrapClassName, topClassName, wrapGap, topGap, title, text, additional, image, video, pointers }]) => (
                    <div
                        key={blockKey}
                        className={`screenmate-one__convenience-block ${blockKey} w-full`}
                    >
                        <div className={`container ${wrapClassName} ${wrapGap ? `gap-${wrapGap}` : ''} mob:gap-32 relative`}>
                            <div className={`screenmate-one__convenience-block-top ${topClassName} mob:flex-column ${topGap ? `gap-${topGap}` : ''} mob:gap-12`}>
                                <div {...anime(`${blockKey}-title`)} className="block-title">{title}</div>
                                <div {...anime(`${blockKey}-text`)} className="block-text">{text}</div>
                            </div>
                            {additional && (
                                <div {...anime(`${blockKey}-additional`)} className="screenmate-one__convenience-block-additional flex-column">
                                    {additional}
                                </div>
                            )}
                            {video ? (
                                <Video {...anime(`${blockKey}-image`)} className="screenmate-one__convenience-block-video" src={video} background={image} />
                            ) : (image && (
                                <Image {...anime(`${blockKey}-image`)} className="screenmate-one__convenience-block-image" src={image} />
                            ))}
                            {pointers && (<>
                                {Object.entries(pointers).map(([pointerKey, pointer]) => (
                                    <div
                                        key={pointerKey}
                                        {...anime(`${blockKey}-pointers-${pointerKey}`)}
                                        className="w-full absolute"
                                    >
                                        <Icon
                                            className={`screenmate-one__convenience-block-pointer ${pointerKey} absolute`}
                                            style={responsive(pointer.imageStyle)}
                                            icon={pointer.image}
                                        />
                                        <div
                                            className={`screenmate-one__convenience-block-legend flex-column gap-12 absolute text-${pointerKey.split('-')[1] || ''}`}
                                            style={responsive(pointer.legendStyle)}
                                        >
                                            <span>{pointer.title}</span>
                                            <span className="mob:hidden">{pointer.text}</span>
                                        </div>
                                    </div>
                                ))}
                            </>)}
                        </div>
                    </div>
                ))}
            </div>
            <Popup open={commandsPopupOpen} onClose={() => setCommandsPopupOpen(false)}>
                <div className="screenmate-one__convenience-commands">
                    <div className="screenmate-one__convenience-commands-head">
                        <div className="font-manrope-28 font-500 mob:font-manrope-22">Full Commands List <br />of Control Panel</div>
                        <Icon className="screenmate-one__convenience-commands-close" icon={closeIcon} onClick={() => setCommandsPopupOpen(false)}/>
                    </div>
                    <div className="screenmate-one__convenience-commands-body">
                        {Object.entries(commands).map(([section, items]) => (
                            <Fragment key={section}>
                                <div className="flex-column gap-28 mob:flex-column-center" key={section}>
                                    <div className="font-manrope-20 font-500 uppercase">{section}</div>
                                    <div className="screenmate-one__convenience-commands-grid">
                                        {items.map((item, index) => (
                                            <CommandItem
                                                {...item}
                                                num={index}
                                                typeCount={items.filter(({ type }) => item.type === type).length}
                                                key={`${section}-${index}`}
                                            />
                                        ))}
                                    </div>
                                </div>
                                <div className="screenmate-one__convenience-commands-delimiter" />
                            </Fragment>
                        ))}
                    </div>
                </div>
            </Popup>
        </div>
    )
}

export default ScreenmateOneConvenience
