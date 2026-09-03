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
    name: string
    image: string
    imageStyle?: CSSProperties
}

interface AddItemProps {
    className: string
    style: CSSProperties
    name: string
    image: string
    price: number
    oldPrice?: number
    description: ReactNode
    compatible: ReactNode
    onAdd: () => void
}

const BoxItem = forwardRef<HTMLDivElement, BoxItemProps>(({ className, style, name, image, imageStyle }, ref) => (
    <div ref={ref} {...{className, style}}>
        <Image className="screenmate-one__complectation-group-grid-item-image" style={imageStyle || {}} src={image} alt={name} />
        <div className="screenmate-one__complectation-group-grid-item-title">{name}</div>
    </div>
))

const AddItem = forwardRef<HTMLDivElement, AddItemProps>(({ className, style, name, image, price, oldPrice, description, compatible, onAdd }, ref) => (
    <div ref={ref} {...{className, style}}>
        <Image className="screenmate-one__complectation-group-grid-item-image" src={image} alt={name} />
        <div className="screenmate-one__complectation-group-grid-item-info">
            <div>
                <div>
                    <h3 className="screenmate-one__complectation-group-grid-item-info-name">{name}</h3>
                    <div className="screenmate-one__complectation-group-grid-item-info-prices">
                        <span className="screenmate-one__complectation-group-grid-item-info-price-new">{price} USD</span>
                        {!!oldPrice && oldPrice !== price && (
                            <span className="screenmate-one__complectation-group-grid-item-info-price-old">{oldPrice} USD</span>
                        )}
                    </div>
                </div>
                <div>
                    <div>{description}</div>
                    <div className="screenmate-one__complectation-group-grid-item-info-compatible-label">Сompatible with:</div>
                    {compatible}
                </div>
            </div>
            <a onClick={onAdd}>
                <span>Add to cart</span>
                <Icon svg={<CartBlueIcon />} />
            </a>
        </div>
    </div>
))

interface Group {
    title: string
    grid: boolean
    items: Record<string, any>
    itemComponent: React.FC<ItemProps>
}

type AdditionalProduct = Record<string, number | null | undefined>

const getGroups = (
    additionalProductsData: Record<string, AdditionalProduct>,
    isMobile: boolean,
    responsive: (styles?: CSSProperties) => Record<string, string>
) => {
    return {
        box: {
            title: 'What\'s in the box',
            grid: true,
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
                    id: additionalProductsData['Connection Splitter'].id,
                    name: 'Connection Splitter',
                    image: screenmateSplitter,
                    price: additionalProductsData['Connection Splitter'].price,
                    oldPrice: additionalProductsData['Connection Splitter'].oldPrice,
                    description: <>
                        The Connection Splitter lets you <br />
                        connect two devices simultaneously <br />
                        through one connector.
                    </>,
                    compatible: <div className="screenmate-one__complectation-group-grid-item-info-compatible">
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
    }
}

const ScreenmateOneComplectation: React.FC = () => {
    const dispatch = useAppDispatch()
    const { isMobile, responsive } = useInlineStyles()

    const { additionalProducts } = useAppSelector(state => state.products)

    const additionalProductTitles: string[] = ['Wireless Charger', 'Connection Splitter']
    const additionalProductsData: Record<string, AdditionalProduct> = useMemo(() => {
        const data: Record<string, AdditionalProduct> = {}
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

    const groups: Record<string, Group> = useMemo(
        () => getGroups(additionalProductsData, isMobile, responsive),
        [additionalProductsData, isMobile, responsive]
    )

    const handleAddToCart = (id: number | null) => {
        if (id) {
            dispatch(addToCart({ items: [{ id, quantity: 1 }] }))
        }
    }

    const animationConfigs = useMemo(() => mapBlocksConfigs(groups, animatedObjects), [groups])

    const { anime } = useAnime(animationConfigs)

    return (
        <div className="screenmate-one__complectation">
            {Object.entries(groups).map(([key, { title, items, itemComponent: Item }]) => (
                <div className="screenmate-one__complectation-group" key={key}>
                    <h2 {...anime(`${key}-title`)} className="screenmate-one__complectation-group-title">{title}</h2>
                    <div
                        {...anime(`${key}-grid`)}
                        className={`screenmate-one__complectation-group-grid ${key}`}
                    >
                        {Object.entries(items).map(([slug, item]) => (
                            <Item
                                // {...anime(`${key}-items-${slug}`)}
                                key={slug}
                                className={`screenmate-one__complectation-group-grid-item ${slug}`}
                                style={{ gridArea: slug }}
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
