import React, { forwardRef, Fragment, useMemo, type CSSProperties, type ReactNode } from 'react'
import './screenmate-one-complectation.scss'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { addToCart } from '../../redux/slices/products'

import { Icon, Image } from '../Common'
import screenmateOneDevice from '../../assets/images/screenmate-one/products/screenmate-one-device.png'
import phoneHolder from '../../assets/images/screenmate-one/products/phone-holder.png'
import plasticTool from '../../assets/images/screenmate-one/products/plastic-tool.png'
import dataWire from '../../assets/images/screenmate-one/products/data-wire.png'
import videoWire from '../../assets/images/screenmate-one/products/video-wire.png'
import wirelessPhoneCharger from '../../assets/images/screenmate-one/products/wireless-phone-charger.png'
import screenmateSplitter from '../../assets/images/screenmate-one/products/screenmate-splitter.png'
import CartBlueIcon from '../../assets/icons/CartBlueIcon'

import { mapBlocksConfigs, useAnime, type AnimatedObjectOptions } from '../../hooks/anime'
import { useInlineStyles } from '../../hooks/inline-styles'

const animatedObjects: Record<string, AnimatedObjectOptions> = {
    title: { yFrom: '40px', duration: 666 },
    grid: { yFrom: '40px', duration: 666 },
    items: { yFrom: '20px', duration: 333 },
}

type ItemProps = BoxItemProps & AddItemProps

interface BoxItemProps {
    className: string
    style: CSSProperties
    slug: string
    name: string
    image: string
    imageStyle?: CSSProperties
}

interface AddItemProps {
    className: string
    style: CSSProperties
    slug: string
    name: string
    image: string
    price: number
    oldPrice?: number
    description: ReactNode
    compatible: ReactNode
    onAdd: () => void
}

const BoxItem = forwardRef<HTMLDivElement, BoxItemProps>(({ className, style, slug, name, image, imageStyle }, ref) => (
    <div ref={ref} className={`${className} flex-column-center-end`} style={style}>
        <Image className="screenmate-one__complectation-group-grid-item-image" style={imageStyle || {}} src={image} alt={name} />
        <div className={`font-manrope-${slug === 'device' ? '24' : '20'} mob:font-manrope-${slug === 'device' ? '18' : '14'} font-500`}>{name}</div>
    </div>
))

const AddItem = forwardRef<HTMLDivElement, AddItemProps>(({ className, style, name, image, price, oldPrice, description, compatible, onAdd }, ref) => (
    <div ref={ref} className={`${className} flex-start-center gap-24 mob:flex-column-center mob:gap-20`} style={style}>
        <Image className="screenmate-one__complectation-group-grid-item-image" src={image} alt={name} />
        <div className="flex-column gap-24 mob:gap-20">
            <div className="flex-column gap-20 mob:gap-16">
                <div className="flex-column gap-8 mob:gap-4">
                    <div className="font-manrope-24 mob:font-manrope-18 font-500">{name}</div>
                    <div className="flex gap-8 font-manrope-20 mob:font-manrope-18 font-600">
                        <span className="text-blue">{price} USD</span>
                        {!!oldPrice && oldPrice !== price && (
                            <span className="text-grey line-through">{oldPrice} USD</span>
                        )}
                    </div>
                </div>
                <div className="flex-column gap-12 font-manrope-16">
                    <div>{description}</div>
                    <div className="font-600">Сompatible with:</div>
                    {compatible}
                </div>
            </div>
            <a className="flex gap-8" onClick={onAdd}>
                <span className="font-manrope-20 mob:font-manrope-18 font-600">Add to cart</span>
                <Icon className="flex-center" svg={<CartBlueIcon />} />
            </a>
        </div>
    </div>
))

interface Group {
    title: string
    grid: boolean
    gridStyle: CSSProperties
    items: Record<string, any>
    itemComponent: React.FC<ItemProps>
}

const ScreenmateOneComplectation: React.FC = () => {
    const dispatch = useAppDispatch()
    const { isMobile, responsive } = useInlineStyles()

    const { additionalProducts } = useAppSelector(state => state.products)

    const additionalProductTitles: string[] = ['Wireless Charger', 'Splitter']
    const additionalProductsData: Record<string, Record<string, number | null | undefined>> = useMemo(() => {
        const data: Record<string, Record<string, number | null | undefined>> = {}
        if (additionalProducts) {
            for (const { id, title, models, price, oldPrice } of additionalProducts) {
                data[title] = { id: models ? models[0].id : id, price, oldPrice }
            }
        } else {
            for (const title of additionalProductTitles) {
                data[title] = { id: null, price: 40, oldPrice: 60 }
            }
        }
        return data
    }, [additionalProducts, additionalProductTitles])

    const groups: Record<string, Group> = useMemo(() => ({
        box: {
            title: 'What\'s in the box',
            grid: true,
            gridStyle: !isMobile ? {
                ...responsive({ gridTemplateColumns: '550px 371px 371px' }),
                gridTemplateRows: '1fr 1fr',
                gridTemplateAreas: `
                    'device    holder       tool'
                    'device    data_wire    video_wire'
                `
            } : {
                ...responsive({ gridTemplateRows: '323px 172px 172px' }),
                gridTemplateColumns: '1fr 1fr',
                gridTemplateAreas: `
                    'device    device'
                    'holder    tool'
                    'data_wire video_wire'
                `
            },
            items: {
                device: {
                    name: 'Screenmate ONE Device',
                    image: screenmateOneDevice,
                    imageStyle: responsive({ width: !isMobile ? '420px' : '257px', height: !isMobile ? '332.872px' : '203px' })
                },
                holder: { name: 'Phone Holder', image: phoneHolder },
                tool: { name: 'Plastic Tool', image: plasticTool },
                data_wire: { name: 'Data Cable', image: dataWire },
                video_wire: { name: 'Video Cable', image: videoWire }
            },
            itemComponent: BoxItem
        },
        add: {
            title: 'Additional products',
            grid: true,
            gridStyle: !isMobile ? {
                gridTemplateColumns: '1fr 1fr',
                gridTemplateAreas: `'charger splitter'`
            } : {
                gridTemplateRows: '1fr 1fr',
                gridTemplateAreas: `
                    'charger'
                    'splitter'
                `
            },
            items: {
                charger: {
                    id: additionalProductsData['Wireless Charger'].id,
                    name: 'Wireless Phone Charger',
                    image: wirelessPhoneCharger,
                    price: additionalProductsData['Wireless Charger'].price,
                    oldPrice: additionalProductsData['Wireless Charger'].oldPrice,
                    description: <>
                        This magnetic charger installs on <br />
                        a Phone Holder instead of a magnet. 
                    </>,
                    compatible: <>
                        iPhone 12 and above, or any phone with wireless <br />
                        charging (using the included magnetic ring).
                    </>
                },
                splitter: {
                    id: additionalProductsData['Splitter'].id,
                    name: 'Connection Splitter',
                    image: screenmateSplitter,
                    price: additionalProductsData['Splitter'].price,
                    oldPrice: additionalProductsData['Splitter'].oldPrice,
                    description: <>
                        The Connection Splitter lets you <br />
                        connect two devices simultaneously <br />
                        through one connector.
                    </>,
                    compatible: <div className="flex gap-12 mob:w-full mob:flex-between mob:gap-0">
                        {['Model 3 ‘21+', 'Model Y', 'Model S', 'Model X'].map((model, index, array) => (
                            <Fragment key={index}>
                                <span>{model}</span>
                                {index < array.length - 1 && (
                                    <span style={{ width: '1px', background: 'rgba(255, 255, 255, 0.15)' }} />
                                )}
                            </Fragment>
                        ))}
                    </div>
                }
            },
            itemComponent: AddItem
        }
    }), [additionalProductsData, isMobile, responsive])

    const handleAddToCart = (id: number | null) => {
        if (id) {
            dispatch(addToCart({ items: [{ id, quantity: 1 }] }))
        }
    }

    const animationConfigs = useMemo(() => mapBlocksConfigs(groups, animatedObjects), [groups])

    const { anime } = useAnime(animationConfigs)

    return (
        <div className="screenmate-one__complectation">
            {Object.entries(groups).map(([key, { title, gridStyle, items, itemComponent: Item }]) => (
                <div className="screenmate-one__complectation-group" key={key}>
                    <div {...anime(`${key}-title`)} className="font-manrope-52 mob:font-manrope-32 font-600">{title}</div>
                    <div
                        {...anime(`${key}-grid`)}
                        className={`screenmate-one__complectation-group-grid ${key}`}
                        style={gridStyle}
                    >
                        {Object.entries(items).map(([slug, item]) => (
                            <Item
                                {...anime(`${key}-items-${slug}`)}
                                key={slug}
                                className={`screenmate-one__complectation-group-grid-item ${slug}`}
                                style={{ gridArea: slug }}
                                slug={slug}
                                {...item}
                                onAdd={() => handleAddToCart(item.id)}
                            />                            
                        ))}
                    </div>
                </div>
            ))}
        </div>
    )
}

export default ScreenmateOneComplectation
